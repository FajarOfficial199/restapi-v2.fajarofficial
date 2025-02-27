const axios = require('axios');

const CLIENT_ID = 'acc6302297e040aeb6e4ac1fbdfd62c3';
const CLIENT_SECRET = '0e8439a1280a43aba9a5bc0a16f3f009';

module.exports = function (app) {
async function getSpotifyToken() {
  const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
  const response = await axios.post('https://accounts.spotify.com/api/token', 
    new URLSearchParams({ grant_type: 'client_credentials' }), 
    { headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' } }
  );
  return response.data.access_token;
}

// Fungsi untuk mendapatkan daftar track dari album
async function getAlbumTracks(albumUrl) {
  const albumId = albumUrl.split('/album/')[1]?.split('?')[0];
  if (!albumId) throw new Error('Link album tidak valid!');

  const accessToken = await getSpotifyToken();
  const response = await axios.get(`https://api.spotify.com/v1/albums/${albumId}`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  const albumData = response.data;
  return albumData.tracks.items.map(track => ({
    title: track.name,
    id: track.id,
    artist: track.artists.map(artist => artist.name).join(', '),
    spotifyUrl: track.external_urls.spotify
  }));
}

// Fungsi untuk mendapatkan link download dari API pihak ketiga
async function getDownloadLink(trackUrl) {
  const apiUrl = `https://fgsi-spotify.hf.space/?url=${encodeURIComponent(trackUrl)}`;
  const response = await axios.get(apiUrl);
  const data = response.data;

  if (!data.status || !data.data || !data.data.downloads) {
    throw new Error(`Gagal mendapatkan lagu untuk ${trackUrl}`);
  }

  const track = data.data.metadata;
  const audio = data.data.downloads.find(d => d.type === 'Download Mp3');

  if (!audio) throw new Error(`Gagal menemukan link download untuk ${track.title}`);

  return {
    title: track.title,
    artist: track.artists,
    spotifyUrl: track.link,
    coverUrl: track.cover_url,
    audioUrl: audio.url
  };
}

// Endpoint untuk mendownload lagu atau album
app.get('/downloader/spotify', async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).json({ success: false, error: 'Masukkan link Spotify!' });

  try {
    let result = [];

    if (url.includes('/track/')) {
      // Jika link adalah lagu
      const trackData = await getDownloadLink(url);
      result.push(trackData);
    } else if (url.includes('/album/')) {
      // Jika link adalah album
      const tracks = await getAlbumTracks(url);
      for (const track of tracks) {
        try {
          const trackData = await getDownloadLink(track.spotifyUrl);
          result.push(trackData);
        } catch (err) {
          console.warn(`Gagal mendownload lagu: ${track.title}`);
        }
      }
    } else {
      return res.status(400).json({ success: false, error: 'Format link tidak didukung!' });
    }

    res.json({ success: true, tracks: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
}