const fetch = require('node-fetch');

const CLIENT_ID = 'acc6302297e040aeb6e4ac1fbdfd62c3';
const CLIENT_SECRET = '0e8439a1280a43aba9a5bc0a16f3f009';

module.exports = function (app) {
async function getSpotifyToken() {
  const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${auth}`,
    },
    body: new URLSearchParams({ grant_type: 'client_credentials' }),
  });

  const data = await response.json();
  return data.access_token;
}

async function searchSpotifyTracks(query) {
  if (!query) throw new Error('Query tidak boleh kosong!');

  const accessToken = await getSpotifyToken();
  const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=5`;
  const response = await fetch(searchUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const data = await response.json();
  if (!data.tracks || !data.tracks.items.length) throw new Error('Lagu tidak ditemukan!');

  return data.tracks.items.map((track) => ({
    name: track.name,
    artist: track.artists.map((artist) => artist.name).join(', '),
    album: {
      name: track.album.name,
      url: track.album.external_urls.spotify,
      image: track.album.images[0]?.url,
      releaseDate: track.album.release_date,
    },
    previewUrl: track.preview_url,
    spotifyUrl: track.external_urls.spotify,
  }));
}

app.get('/search/spotify', async (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.status(400).json({ error: 'Masukkan query pencarian!' });
  }

  try {
    const tracks = await searchSpotifyTracks(query);
    res.json({ results: tracks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
}