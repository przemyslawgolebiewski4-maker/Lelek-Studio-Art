export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'contact@lelekstudio.com',
        to: 'lelekstudio@lelekstudio.com',
        reply_to: email,
        subject: `[Lelek Studio] ${subject || 'New message'} — from ${name}`,
        html: `
          <div style="font-family:Georgia,serif;max-width:600px;color:#3A2F28">
            <h2 style="font-weight:400;border-bottom:1px solid #E6D8C7;padding-bottom:16px">
              New message from lelekstudio.com
            </h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Subject:</strong> ${subject || '—'}</p>
            <div style="background:#FAF6F1;padding:20px;margin-top:16px;border-left:3px solid #A36B3F">
              <p style="white-space:pre-wrap">${message}</p>
            </div>
            <p style="font-size:12px;color:#999;margin-top:24px">
              Sent from lelekstudio.com contact form
            </p>
          </div>
        `
      })
    });

    if (response.ok) {
      return res.status(200).json({ ok: true });
    } else {
      const err = await response.json();
      console.error('Resend error:', err);
      return res.status(500).json({ error: 'Failed to send email' });
    }
  } catch (error) {
    console.error('Handler error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
