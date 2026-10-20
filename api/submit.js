import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { sender, instagram, message, image } = req.body;

  if (!message && !image) {
    return res.status(400).json({ success: false, error: "मैसेज या फोटो होना अनिवार्य है!" });
  }

  const { error } = await supabase.from('confessions').insert([
    { sender, instagram, message, image, status: 'pending' }
  ]);

  if (error) {
    return res.status(500).json({ success: false, error: error.message });
  }

  return res.status(200).json({ success: true });
}
