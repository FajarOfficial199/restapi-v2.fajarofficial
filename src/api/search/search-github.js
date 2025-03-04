const axios = require('axios');

module.exports = function (app) {
const userSearches = new Map();
async function GithubRepo(repo) {
    try {
        const response = await axios.get(`https://api.github.com/search/repositories?q=${repo}`);
        if (response.status === 200) {
            const results = response.data.items;
            let data = {
                count: response.data.total_count,
                result: results.map((res) => ({
                    id: res.id,
                    name_repo: res.name,
                    full_name_repo: res.full_name,
                    url_repo: res.html_url,
                    description: res.description || 'No description',
                    git_url: res.git_url,
                    ssh_url: res.ssh_url,
                    clone_url: res.clone_url,
                    homepage: res.homepage,
                    stargazers: res.stargazers_count,
                    watchers: res.watchers,
                    forks: res.forks,
                    language: res.language || 'Not specified',
                    is_private: res.private,
                    is_fork: res.fork,
                    default_branch: res.default_branch,
                    created_at: res.created_at,
                    updated_at: res.updated_at,
                    pushed_at: res.pushed_at
                }))
            };
            return data;
        } else {
            throw new Error('GitHub API error');
        }
    } catch (error) {
        throw error;
    }
}
function displayResults(data, page) {
    const startIndex = (page - 1) * 5;
    const endIndex = Math.min(startIndex + 5, data.result.length);
    const totalPages = Math.ceil(data.result.length / 5);
    const results = data.result.slice(startIndex, endIndex);

    return {
        message: `📃 Page: ${page} of ${totalPages}`,
        total_repositories: data.count,
        results: results,
        next: page < totalPages ? 'Type "next" to see more results' : 'End of search results'
    };
}

app.get('/search/github', async (req, res) => {
    const userId = req.query.user || 'anonymous';
    const text = req.query.q;

    if (!text) return res.json({ error: 'Example usage: /search/github?q=nodejs' });

    if (text.toLowerCase() === 'next') {
        if (!userSearches.has(userId)) {
            return res.json({ error: '❌ No active search found. Please start a new search first.' });
        }

        const userData = userSearches.get(userId);
        const nextPage = userData.currentPage + 1;
        const totalPages = Math.ceil(userData.data.result.length / 5);

        if (nextPage > totalPages) {
            return res.json({ error: '❌ You have reached the end of the search results.' });
        }

        userData.currentPage = nextPage;
        userSearches.set(userId, userData);

        return res.json(displayResults(userData.data, nextPage));
    }

    try {
        const data = await GithubRepo(text);

        if (data.count === 0) {
            return res.json({ error: '❌ Repository not found!' });
        }

        userSearches.set(userId, {
            data: data,
            currentPage: 1,
            query: text,
            timestamp: Date.now()
        });

        // Hapus cache pencarian setelah 30 menit
        setTimeout(() => {
            if (userSearches.has(userId)) {
                userSearches.delete(userId);
            }
        }, 30 * 60 * 1000);

        res.json(displayResults(data, 1));
    } catch (error) {
        console.error(error);
        res.json({ error: '❌ Error fetching repository data. Please try again later.' });
    }
});
}
