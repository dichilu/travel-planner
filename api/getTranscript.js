// --- 自訂 YouTube 字幕擷取 API (Custom YouTube Transcript Fetcher) ---
// 不依賴第三方套件，使用多重策略繞過雲端 IP 封鎖。

const VIDEO_ID_REGEX = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/i;

function extractVideoId(url) {
  if (!url) return null;
  if (url.length === 11 && /^[a-zA-Z0-9_-]+$/.test(url)) return url;
  const match = url.match(VIDEO_ID_REGEX);
  return match ? match[1] : null;
}

function decodeEntities(text) {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)));
}

function parseTranscriptXml(xml) {
  // 嘗試新版 <p> 格式
  const pRegex = /<p\s+t="(\d+)"\s+d="(\d+)"[^>]*>([\s\S]*?)<\/p>/g;
  let results = [];
  let m;
  while ((m = pRegex.exec(xml)) !== null) {
    let text = m[3];
    // 處理 <s> 子元素
    const sRegex = /<s[^>]*>([^<]*)<\/s>/g;
    let sText = '';
    let sMatch;
    while ((sMatch = sRegex.exec(text)) !== null) sText += sMatch[1];
    if (!sText) sText = text.replace(/<[^>]+>/g, '');
    sText = decodeEntities(sText).trim();
    if (sText) results.push(sText);
  }
  if (results.length > 0) return results.join(' ');

  // 嘗試舊版 <text> 格式
  const textRegex = /<text[^>]*>([\s\S]*?)<\/text>/g;
  while ((m = textRegex.exec(xml)) !== null) {
    const text = decodeEntities(m[1].replace(/<[^>]+>/g, '')).trim();
    if (text) results.push(text);
  }
  return results.join(' ');
}

// ====== 策略一：ANDROID InnerTube API（原版套件的方法，成功率最高）======
async function fetchViaAndroid(videoId) {
  const res = await fetch('https://www.youtube.com/youtubei/v1/player?prettyPrint=false', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'com.google.android.youtube/20.10.38 (Linux; U; Android 14)',
    },
    body: JSON.stringify({
      context: { client: { clientName: 'ANDROID', clientVersion: '20.10.38' } },
      videoId,
    }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  const tracks = data?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
  if (!Array.isArray(tracks) || tracks.length === 0) return null;
  return await fetchCaptionTrack(tracks);
}

// ====== 策略二：IOS InnerTube API（Vercel 上成功率較高）======
async function fetchViaIOS(videoId) {
  const res = await fetch('https://www.youtube.com/youtubei/v1/player?prettyPrint=false', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'com.google.ios.youtube/20.10.38 (iPhone16,2; U; CPU iPhone OS 17_7_2 like Mac OS X)',
    },
    body: JSON.stringify({
      context: { client: { clientName: 'IOS', clientVersion: '20.10.38' } },
      videoId,
    }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  const tracks = data?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
  if (!Array.isArray(tracks) || tracks.length === 0) return null;
  return await fetchCaptionTrack(tracks);
}

// ====== 策略三：WEB InnerTube API（加入 consent cookie 繞過 GDPR）======
async function fetchViaWeb(videoId) {
  const res = await fetch('https://www.youtube.com/youtubei/v1/player?prettyPrint=false', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
      'Cookie': 'CONSENT=PENDING+987; SOCS=CAESEwgDEgk2MjQyMjkzMTQaAmVuIAEaBgiA_LUGAQ',
      'Origin': 'https://www.youtube.com',
      'Referer': 'https://www.youtube.com/',
    },
    body: JSON.stringify({
      context: {
        client: {
          clientName: 'WEB',
          clientVersion: '2.20250222.10.00',
          hl: 'en',
          gl: 'US',
        },
      },
      videoId,
    }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  const tracks = data?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
  if (!Array.isArray(tracks) || tracks.length === 0) return null;
  return await fetchCaptionTrack(tracks);
}

// ====== 策略三：直接爬 YouTube 網頁取得字幕軌道（加 consent cookie）======
async function fetchViaWebPage(videoId) {
  const res = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9',
      'Cookie': 'CONSENT=PENDING+987; SOCS=CAESEwgDEgk2MjQyMjkzMTQaAmVuIAEaBgiA_LUGAQ',
    },
  });
  if (!res.ok) return null;
  const html = await res.text();
  if (html.includes('class="g-recaptcha"')) return null;

  // 從頁面中解析 ytInitialPlayerResponse
  const marker = 'var ytInitialPlayerResponse = ';
  const startIdx = html.indexOf(marker);
  if (startIdx === -1) return null;

  let depth = 0;
  const jsonStart = startIdx + marker.length;
  for (let i = jsonStart; i < html.length; i++) {
    if (html[i] === '{') depth++;
    else if (html[i] === '}') {
      depth--;
      if (depth === 0) {
        try {
          const playerResponse = JSON.parse(html.slice(jsonStart, i + 1));
          const tracks = playerResponse?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
          if (!Array.isArray(tracks) || tracks.length === 0) return null;
          return await fetchCaptionTrack(tracks);
        } catch { return null; }
      }
    }
  }
  return null;
}

// ====== 共用：從字幕軌道取得 XML 並解析為文字 ======
async function fetchCaptionTrack(tracks) {
  // 優先選中文，沒有就選第一個
  const track =
    tracks.find(t => t.languageCode === 'zh-Hant') ||
    tracks.find(t => t.languageCode === 'zh-TW') ||
    tracks.find(t => t.languageCode?.startsWith('zh')) ||
    tracks.find(t => t.vssId?.includes('.zh')) ||
    tracks[0];

  if (!track?.baseUrl) return null;

  const res = await fetch(track.baseUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Referer': 'https://www.youtube.com/',
    },
  });
  if (!res.ok) return null;
  const xml = await res.text();
  const text = parseTranscriptXml(xml);
  return text || null;
}

// ====== Vercel Serverless Function Handler ======
export default async function handler(req, res) {
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

  const strategies = [
    { name: 'Android InnerTube', fn: () => fetchViaAndroid(videoId) },
    { name: 'IOS InnerTube', fn: () => fetchViaIOS(videoId) },
    { name: 'Web InnerTube', fn: () => fetchViaWeb(videoId) },
    { name: 'Web Page Scrape', fn: () => fetchViaWebPage(videoId) },
  ];

  for (const strategy of strategies) {
    try {
      const transcript = await strategy.fn();
      if (transcript && transcript.trim().length > 0) {
        console.log(`[getTranscript] ✅ Success via ${strategy.name} for ${videoId}`);
        return res.status(200).json({ transcript });
      }
      console.log(`[getTranscript] ⏭️ ${strategy.name} returned empty for ${videoId}`);
    } catch (err) {
      console.log(`[getTranscript] ⚠️ ${strategy.name} failed for ${videoId}: ${err.message}`);
    }
  }

  console.log(`[getTranscript] ❌ All strategies failed for ${videoId}`);
  return res.status(500).json({
    error: 'Failed to fetch transcript. All strategies exhausted.',
    details: `Video ID: ${videoId}. The video may not have captions, or YouTube is blocking this server.`,
  });
}
