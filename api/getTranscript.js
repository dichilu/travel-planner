/**
 * Vercel Serverless Function: YouTube Transcript Fetcher (Custom)
 *
 * Replaces the `youtube-transcript` npm package which fails on Vercel
 * because YouTube blocks cloud provider (AWS/Vercel) IP ranges.
 *
 * Primary strategy: ANDROID InnerTube client (v20.10.38) — proven to
 * bypass datacenter IP restrictions.
 * Fallback: Web page scraping with consent cookies.
 */

const RE_VIDEO_ID = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;

function extractVideoId(url) {
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;
  const match = url.match(RE_VIDEO_ID);
  return match ? match[1] : null;
}

// --- Constants ---
const ANDROID_VERSION = '20.10.38';
const ANDROID_UA = `com.google.android.youtube/${ANDROID_VERSION} (Linux; U; Android 14)`;
const ANDROID_CONTEXT = { client: { clientName: 'ANDROID', clientVersion: ANDROID_VERSION } };

const WEB_UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.83 Safari/537.36,gzip(gfe)';
const CONSENT_COOKIES = 'CONSENT=PENDING+999';

const INNERTUBE_URL = 'https://www.youtube.com/youtubei/v1/player?prettyPrint=false';

// --- Strategy 1: ANDROID InnerTube (most reliable from datacenter IPs) ---
async function fetchViaAndroid(videoId) {
  const resp = await fetch(INNERTUBE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': ANDROID_UA,
    },
    body: JSON.stringify({ context: ANDROID_CONTEXT, videoId }),
  });

  if (!resp.ok) throw new Error(`InnerTube HTTP ${resp.status}`);

  const data = await resp.json();
  const tracks = data?.captions?.playerCaptionsTracklistRenderer?.captionTracks;

  if (!Array.isArray(tracks) || tracks.length === 0) return null;
  return await downloadTranscript(tracks);
}

// --- Strategy 2: Web page scraping with consent cookies ---
async function fetchViaWebPage(videoId) {
  const resp = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
    headers: {
      'User-Agent': WEB_UA,
      'Cookie': CONSENT_COOKIES,
    },
  });

  if (!resp.ok) throw new Error(`WebPage HTTP ${resp.status}`);

  const html = await resp.text();
  if (html.includes('class="g-recaptcha"')) {
    throw new Error('YouTube requires CAPTCHA — IP may be rate-limited');
  }

  // Parse ytInitialPlayerResponse JSON from the page
  const marker = 'var ytInitialPlayerResponse = ';
  const startIdx = html.indexOf(marker);
  if (startIdx === -1) return null;

  const jsonStart = startIdx + marker.length;
  let depth = 0, endIdx = jsonStart;
  for (let i = jsonStart; i < html.length; i++) {
    if (html[i] === '{') depth++;
    else if (html[i] === '}') {
      depth--;
      if (depth === 0) { endIdx = i + 1; break; }
    }
  }

  try {
    const playerResp = JSON.parse(html.slice(jsonStart, endIdx));
    const tracks = playerResp?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
    if (!Array.isArray(tracks) || tracks.length === 0) return null;
    return await downloadTranscript(tracks);
  } catch {
    return null;
  }
}

// --- Download and parse transcript XML from the best caption track ---
async function downloadTranscript(tracks) {
  // Prefer: zh-Hant > zh > ja > first available
  const track =
    tracks.find(t => t.languageCode === 'zh-Hant') ||
    tracks.find(t => t.languageCode?.startsWith('zh')) ||
    tracks.find(t => t.languageCode === 'ja') ||
    tracks[0];

  if (!track?.baseUrl) return null;

  const resp = await fetch(track.baseUrl, {
    headers: { 'User-Agent': ANDROID_UA },
  });

  if (!resp.ok) return null;

  const xml = await resp.text();
  if (!xml || xml.length === 0) return null;

  return parseTranscriptXml(xml);
}

// --- Parse caption XML into plain text ---
function parseTranscriptXml(xml) {
  const segments = [];
  let match;

  // Format 1 (modern): <p t="offset" d="duration">text or <s>text</s></p>
  const pRegex = /<p\s+t="\d+"\s+d="\d+"[^>]*>([\s\S]*?)<\/p>/g;
  while ((match = pRegex.exec(xml)) !== null) {
    let content = match[1];
    // Try extracting from <s> tags first
    const sRegex = /<s[^>]*>([^<]*)<\/s>/g;
    let sMatch, combined = '';
    while ((sMatch = sRegex.exec(content)) !== null) combined += sMatch[1];
    if (!combined) combined = content.replace(/<[^>]+>/g, '');
    combined = decodeEntities(combined).trim();
    if (combined) segments.push(combined);
  }

  // Format 2 (legacy): <text start="..." dur="...">text</text>
  if (segments.length === 0) {
    const textRegex = /<text start="[^"]*" dur="[^"]*"[^>]*>([^<]*)<\/text>/g;
    while ((match = textRegex.exec(xml)) !== null) {
      const text = decodeEntities(match[1]).trim();
      if (text) segments.push(text);
    }
  }

  return segments.length > 0 ? segments.join(' ') : null;
}

function decodeEntities(str) {
  return str
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&apos;/g, "'")
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)));
}

// --- Main Handler ---
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'Missing YouTube URL' });

  const videoId = extractVideoId(url);
  if (!videoId) return res.status(400).json({ error: 'Invalid YouTube URL', input: url });

  const errors = [];

  // Strategy 1: ANDROID InnerTube (works best from cloud IPs)
  try {
    const transcript = await fetchViaAndroid(videoId);
    if (transcript) return res.status(200).json({ transcript });
    errors.push('Android InnerTube: No caption tracks found');
  } catch (e) {
    errors.push(`Android InnerTube: ${e.message}`);
  }

  // Strategy 2: Web page scraping (fallback)
  try {
    const transcript = await fetchViaWebPage(videoId);
    if (transcript) return res.status(200).json({ transcript });
    errors.push('WebPage: No caption tracks found');
  } catch (e) {
    errors.push(`WebPage: ${e.message}`);
  }

  return res.status(500).json({
    error: 'Failed to fetch transcript. This video may not have CC subtitles.',
    details: errors.join(' | '),
  });
}
