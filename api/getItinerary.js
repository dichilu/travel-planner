import Redis from 'ioredis';

let redis;
const url = process.env.REDIS_URL || process.env.KV_URL;

if (url) {
  redis = new Redis(url);
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  if (!redis) {
    const envKeys = Object.keys(process.env).filter(k => k.includes('REDIS') || k.includes('KV') || k.includes('UPSTASH'));
    return res.status(500).json({ error: `Database URL missing. Found related env vars: ${envKeys.join(', ')}` });
  }

  try {
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({ error: 'Missing share ID' });
    }

    const dataString = await redis.get(`share:${id}`);
    
    if (!dataString) {
      return res.status(404).json({ error: 'Itinerary not found or expired' });
    }
    
    const data = JSON.parse(dataString);
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching itinerary from Redis:', error);
    return res.status(500).json({ error: error.message || String(error) });
  }
}
