export default async function handler(req, res) {
  // CORS Headers for Security
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { password } = req.body;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD; // .env से आएगा

  if (!ADMIN_PASSWORD) {
    return res.status(500).json({ success: false, error: "Server config error: Password not set" });
  }

  if (password === ADMIN_PASSWORD) {
    return res.status(200).json({ success: true });
  }
  
  return res.status(401).json({ success: false, error: "गलत पासवर्ड!" });
}
