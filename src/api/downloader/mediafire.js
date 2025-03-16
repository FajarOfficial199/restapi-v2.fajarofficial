const axios = require('axios');
const fetch = require('node-fetch');
const cheerio = require('cheerio');

module.exports = function (app) {
    async function mediaFire(url) {
  try {
    const response = await fetch('https://r.jina.ai/' + url, {
      headers: {
        'x-return-format': 'html',
      }
    });
    const text = await response.text();
    const $ = cheerio.load(text);
  
    const Time = $('div.DLExtraInfo-uploadLocation div.DLExtraInfo-sectionDetails')
      .text()
      .match(/This file was uploaded from (.*?) on (.*?) at (.*?)\n/);

    const result = {
      title: $('div.dl-btn-label').text().trim(),
      link: $('div.dl-utility-nav a').attr('href'),
      filename: $('div.dl-btn-label').attr('title'),
      url: $('a#downloadButton').attr('href'),
      size: $('a#downloadButton').text().match(/(.*?)/)?.[1] || 'Unknown',
      from: Time?.[1] || 'Unknown',
      date: Time?.[2] || 'Unknown',
      time: Time?.[3] || 'Unknown',
      map: {
        background: "https://static.mediafire.com/images/backgrounds/download/additional_content/world.svg",
        region: "https://static.mediafire.com/images/backgrounds/download/additional_content/" + ($('div.DLExtraInfo-uploadLocationRegion').attr('data-lazyclass') || '') + ".svg",
      },
      repair: $('a.retry').attr('href') || null,
    };
    
    return result;
  } catch (error) {
    return { error: error.message };
  }
}

app.get('/downloader/mediafire', async (req, res) => {
  const url = req.query.url;
  if (!url) {
    return res.status(400).json({ error: 'Parameter url tidak boleh kosong' });
  }

  const result = await mediaFire(url);
  res.json({ results: result });
});
}
