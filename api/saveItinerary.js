import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const data = req.body;
    
    // Generate an 8-character random alphanumeric ID
    const id = Math.random().toString(36).substring(2, 10);
    
    // Save to KV with an expiration of 30 days (2592000 seconds)
    // to prevent the DB from growing infinitely
    await kv.set(`share:${id}`, data, { ex: 2592000 });
    
    return res.status(200).json({ id });
  } catch (error) {
    console.error('Error saving itinerary to KV:', error);
    return res.status(500).json({ error: 'Failed to save itinerary' });
  }
}
