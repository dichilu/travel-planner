import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({ error: 'Missing share ID' });
    }

    const data = await kv.get(`share:${id}`);
    
    if (!data) {
      return res.status(404).json({ error: 'Itinerary not found or expired' });
    }
    
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching itinerary from KV:', error);
    return res.status(500).json({ error: 'Failed to fetch itinerary' });
  }
}
