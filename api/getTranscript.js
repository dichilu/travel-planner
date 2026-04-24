import { YoutubeTranscript } from 'youtube-transcript/dist/youtube-transcript.esm.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Missing YouTube URL' });
  }

  try {
    const transcriptArray = await YoutubeTranscript.fetchTranscript(url);
    const fullText = transcriptArray.map(item => item.text).join(' ');
    res.status(200).json({ transcript: fullText });
  } catch (error) {
    console.error('Error fetching transcript:', error);
    res.status(500).json({ error: 'Failed to fetch transcript. Video might not have closed captions or is age-restricted.', details: error.message });
  }
}
