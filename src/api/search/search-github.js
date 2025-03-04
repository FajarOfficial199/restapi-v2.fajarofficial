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
 description: res.description 