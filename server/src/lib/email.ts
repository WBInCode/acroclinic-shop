import { Resend } from 'resend';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM = process.env.RESEND_FROM || 'Acro Clinic <onboarding@resend.dev>';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5000';

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

async function sendEmail(to: string, subject: string, html: string) {
  if (!resend) {
    console.warn('RESEND_API_KEY is missing. Email not sent.');
    return;
  }

  const response = await resend.emails.send({
    from: RESEND_FROM,
    to,
    subject,
    html,
  });

  if (response.error) {
    console.error('Resend error:', response.error);
    throw new Error(response.error.message || 'Email send failed');
  }

  if (response.data?.id) {
    console.log(`Resend email queued: ${response.data.id}`);
  }
}

export async function sendWelcomeEmail(to: string, firstName?: string | null) {
  const greeting = firstName ? `Cześć ${firstName}!` : 'Cześć!';
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
      <h2>${greeting}</h2>
      <p>Twoje konto w Acro Clinic zostało utworzone.</p>
      <p>Możesz już logować się i składać zamówienia.</p>
      <p>
        <a href="${FRONTEND_URL}" style="display:inline-block;padding:10px 16px;background:#d4af37;color:#000;text-decoration:none;border-radius:6px;">
          Przejdź do sklepu
        </a>
      </p>
      <p>Do zobaczenia!<br/>Zespół Acro Clinic</p>
    </div>
  `;

  await sendEmail(to, 'Witamy w Acro Clinic', html);
}

export async function sendPasswordResetEmail(to: string, token: string) {
  const resetLink = `${FRONTEND_URL}/?resetToken=${token}`;
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
      <h2>Reset hasła</h2>
      <p>Otrzymaliśmy prośbę o zresetowanie hasła.</p>
      <p>
        <a href="${resetLink}" style="display:inline-block;padding:10px 16px;background:#d4af37;color:#000;text-decoration:none;border-radius:6px;">
          Ustaw nowe hasło
        </a>
      </p>
      <p>Jeśli link nie działa, wklej token w panelu resetu hasła:</p>
      <p style="font-family: monospace; background: #f4f4f4; padding: 8px; border-radius: 6px;">${token}</p>
      <p>Jeśli to nie Ty, zignoruj tę wiadomość.</p>
    </div>
  `;

  await sendEmail(to, 'Reset hasła - Acro Clinic', html);
}
