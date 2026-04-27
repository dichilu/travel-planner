// --- YouTube 字幕擷取 API (使用 RapidAPI 專業服務) ---

const VIDEO_ID_REGEX = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/i;

function extractVideoId(url) {
  if (!url) return null;
  if (url.length === 11 && /^[a-zA-Z0-9_-]+$/.test(url)) return url;
  const match = url.match(VIDEO_ID_REGEX);
  return match ? match[1] : null;
}

export default async function handler(req, res) {
  // 設定 CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: 'Missing YouTube URL' });
  }

  const videoId = extractVideoId(url);
  if (!videoId) {
    return res.status(400).json({ error: 'Invalid YouTube URL' });
  }

  const apiKey = '0aa24c7342mshab6d9fc681d7d2fp10a9c7jsnd19a03607252';
  const apiHost = 'youtube-transcript3.p.rapidapi.com';

  try {
    console.log(`[getTranscript] Fetching transcript from RapidAPI for ${videoId}...`);
    
    const response = await fetch(`https://${apiHost}/api/transcript?videoId=${videoId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-host': apiHost,
        'x-rapidapi-key': apiKey
      }
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`RapidAPI responded with status ${response.status}: ${errText}`);
    }

    const data = await response.json();
    
    // 根據 youtube-transcript3 的常見回傳格式：
    // 可能是一個物件 { transcript: [...] } 或是陣列 [...]，內部包含 { text, start, duration }
    let transcriptText = '';
    
    const lines = data.transcript || (Array.isArray(data) ? data : null);
    
    if (Array.isArray(lines)) {
      transcriptText = lines.map(line => line.text).join(' ');
    } else if (typeof data === 'string') {
      transcriptText = data;
    }

    if (!transcriptText || transcriptText.trim().length === 0) {
      console.log(`[getTranscript] ❌ RapidAPI returned empty transcript for ${videoId}`);
      return res.status(404).json({ 
        error: 'Transcript is empty', 
        details: 'Could not extract text lines from API response.' 
      });
    }

    console.log(`[getTranscript] ✅ Success! Fetched ${transcriptText.length} chars.`);
    return res.status(200).json({ transcript: transcriptText });

  } catch (err) {
    console.error(`[getTranscript] 💥 Error:`, err.message);
    return res.status(500).json({
      error: 'Failed to fetch transcript via RapidAPI.',
      details: err.message
    });
  }
}
