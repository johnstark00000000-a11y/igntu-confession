import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    // 1. GET: सभी मैसेज फेच करना
    if (req.method === 'GET') {
      const { data, error } = await supabase.from('confessions').select('*').order('id', { ascending: false });
      if (error) throw error;
      return res.status(200).json({ success: true, data });
    }

    // 2. POST: स्टेटस अपडेट करना (Pending <-> Completed)
    if (req.method === 'POST') {
      const { id, status } = req.body;
      const { error } = await supabase.from('confessions').update({ status }).eq('id', id);
      if (error) throw error;
      return res.status(200).json({ success: true });
    }

    // 3. DELETE: सभी मैसेज डिलीट करना (Clear All)
    if (req.method === 'DELETE') {
      const { error } = await supabase.from('confessions').delete().neq('id', 0);
      if (error) throw error;
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
