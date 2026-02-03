import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    const data = await resend.emails.send({
      from: 'onboarding@resend.dev', // Use your verified domain in production
      to: 'geolcarter21@gmail.com',    // Where you want to receive the messages
      subject: `New Portfolio Message from ${name}`,
      html: `<p><strong>Email:</strong> ${email}</p><p>${message}</p>`,
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
