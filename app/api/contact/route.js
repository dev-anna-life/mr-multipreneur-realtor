import nodemailer from 'nodemailer'

export async function POST(request) {
  const { name, email, phone, source } = await request.json()

  if (!name || !email || !phone) {
    return Response.json({ error: 'Name, email, and phone are required.' }, { status: 400 })
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  try {
    await transporter.sendMail({
      from: `"${name}" <${process.env.SMTP_USER}>`,
      to: process.env.EMAIL_TO,
      subject: `New Lead from ${source || 'Website'} — ${name}`,
      html: `
        <h2>New Lead Captured</h2>
        <table style="border-collapse:collapse;width:100%;max-width:500px">
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Name</td><td style="padding:8px;border:1px solid #ddd">${name}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Email</td><td style="padding:8px;border:1px solid #ddd">${email}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Phone</td><td style="padding:8px;border:1px solid #ddd">${phone}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Source</td><td style="padding:8px;border:1px solid #ddd">${source || 'Website'}</td></tr>
        </table>
        <p style="margin-top:16px;color:#666;font-size:13px">Sent from mr-multipreneur-realtor lead form.</p>
      `,
    })
    return Response.json({ success: true })
  } catch (err) {
    console.error('Email send error:', err)
    return Response.json({ error: 'Failed to send message.' }, { status: 500 })
  }
}
