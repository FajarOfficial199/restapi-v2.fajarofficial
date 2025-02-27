const axios = require('axios');

// Ganti dengan API Key & CX ID dari Google CSE
const GOOGLE_API_KEY = 'AIzaSyACtziQOIHppEmKL_a8Xb2ECmUoMkKRCjQ'; // <-- Ganti dengan API Key Anda
const GOOGLE_CX_ID = 'd3b3a61678e5a4c1a'; // <-- Ganti dengan CX ID Anda

module.exports = function (app) {
async function igsearch(query, num = 8) {
  try {
    const params = {
      key: GOOGLE_API_KEY,
      cx: GOOGLE_CX_ID,
      q: query,
      num,
      safe: 'off',
    };

    let response = await axios.get('https://www.googleapis.com/customsearch/v1', { params });

    if (!response.data.items) {
      return { status: false, msg: "No results found" };
    }

    let data = response.data.items.map(item => ({
      title: item.title,
      desc: item.snippet,
      url: item.link,
    }));

    return { status: true, data };
  } catch (error) {
    return { status: false, msg: `Failed to load data, log: ${error.response?.data?.error?.message || error.message}` };
  }
}

app.get('/search/ig', async (req, res) => {
  let { query } = req.query;
  if (!query) return res.status(400).json({ status: false, msg: 'Query parameter is required' });

  const result = await igsearch(query);

  if (!result.status) return res.status(500).json({ status: false, msg: result.msg });

  res.json(result);
});
}