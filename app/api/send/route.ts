import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    
    const { data, error } = await resend.emails.send({
      from:'Contact Form <onboarding@resend.dev>', 
      to: 'geolcarter21@gmail.com',    
      subject: `New  Message from ${name}`,
      html: `<p><strong>From:</strong> ${name} (${email})</p><p>${message}</p>`,
    });

    if (error) {
      console.error("Resend API Error:", error);
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("Server Error:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
