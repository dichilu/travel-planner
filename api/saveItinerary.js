import Redis from 'ioredis';

let redis;
const url = process.env.REDIS_URL || process.env.KV_URL;

if (url) {
  redis = new Redis(url);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  if (!redis) {
    // Collect all env var names to help debug
    const envKeys = Object.keys(process.env).filter(k => k.includes('REDIS') || k.includes('KV') || k.includes('UPSTASH'));
    return res.status(500).json({ error: `Database URL missing. Found related env vars: ${envKeys.join(', ')}` });
  }

  try {
    const data = req.body;
    
    // Generate an 8-character random alphanumeric ID
    const id = Math.random().toString(36).substring(2, 10);
    
    // Save to Redis with an expiration of 30 days (2592000 seconds)
    // We use JSON.stringify because ioredis stores strings
    await redis.set(`share:${id}`, JSON.stringify(data), 'EX', 2592000);
    
    return res.status(200).json({ id });
  } catch (error) {
    console.error('Error saving itinerary to Redis:', error);
    return res.status(500).json({ error: error.message || String(error) });
  }
}
