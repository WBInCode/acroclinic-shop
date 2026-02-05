import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM = process.env.RESEND_FROM || 'Acro Clinic <onboarding@resend.dev>';

console.log('=== RESEND TEST ===');
console.log('API Key (first 10 chars):', RESEND_API_KEY?.slice(0, 10) + '...');
console.log('From:', RESEND_FROM);

if (!RESEND_API_KEY) {
  console.error('RESEND_API_KEY is not set!');
  process.exit(1);
}

const resend = new Resend(RESEND_API_KEY);

async function sendTestEmail() {
  const to = 'kuba41881@gmail.com';
  
  console.log('Sending test email to:', to);
  
  try {
    const response = await resend.emails.send({
      from: RESEND_FROM,
      to,
      subject: 'Test email z Acro Clinic',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Test wysyłki email</h2>
          <p>Jeśli widzisz tę wiadomość, to wysyłka emaili działa poprawnie.</p>
          <p>Data: ${new Date().toISOString()}</p>
        </div>
      `,
    });
    
    console.log('Response:', JSON.stringify(response, null, 2));
    
    if (response.error) {
      console.error('Resend error:', response.error);
    } else {
      console.log('Email sent successfully! ID:', response.data?.id);
    }
  } catch (error) {
    console.error('Exception:', error);
  }
}

sendTestEmail();
