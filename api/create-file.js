export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { repo, filename, content } = req.body;
  const token = process.env.GITHUB_PAT; // From Vercel env vars

  if (!token) {
    return res.status(500).json({ error: 'GitHub token not configured' });
  }

  try {
    const response = await fetch(`https://api.github.com/repos/${repo}/contents/${filename}`, {
      method: 'PUT',
      headers: {
        Authorization: `token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Created via Vercel app',
        content: Buffer.from(content).toString('base64'),
      }),
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create file' });
  }
};
