import { Resend } from 'resend';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM = process.env.RESEND_FROM || 'Acro Clinic <onboarding@resend.dev>';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5000';

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

interface EmailAttachment {
  filename: string;
  content: Buffer;
  content_type?: string;
}

async function sendEmail(to: string, subject: string, html: string, attachments?: EmailAttachment[]) {
  if (!resend) {
    console.warn('RESEND_API_KEY is missing. Email not sent.');
    return;
  }

  const emailData: any = {
    from: RESEND_FROM,
    to,
    subject,
    html,
  };

  if (attachments && attachments.length > 0) {
    emailData.attachments = attachments.map(att => ({
      filename: att.filename,
      content: att.content,
      content_type: att.content_type || 'application/pdf',
    }));
  }

  const response = await resend.emails.send(emailData);

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

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  size?: string | null;
}

interface OrderConfirmationData {
  orderNumber: string;
  customerName: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  shippingAddress: {
    street: string;
    city: string;
    postalCode: string;
  };
  invoiceNumber?: string | null;
  invoicePdf?: Buffer | null;
}

export async function sendOrderConfirmationEmail(to: string, data: OrderConfirmationData) {
  const itemsHtml = data.items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">
        ${item.name}${item.size ? ` <small>(${item.size})</small>` : ''}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">${item.price.toFixed(2)} zł</td>
    </tr>
  `).join('');

  const invoiceInfo = data.invoiceNumber 
    ? `<p style="color: #666;">Numer dokumentu: <strong>${data.invoiceNumber}</strong></p>
       <p style="color: #666; font-size: 12px;">Dokument sprzedaży został załączony do tej wiadomości w formacie PDF.</p>`
    : '';

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #1a1a1a 0%, #333 100%); padding: 30px; text-align: center;">
        <h1 style="color: #d4af37; margin: 0; font-size: 28px;">Acro Clinic</h1>
        <p style="color: #fff; margin: 10px 0 0 0;">Dziękujemy za zakup!</p>
      </div>
      
      <div style="padding: 30px; background: #fff;">
        <h2 style="color: #1a1a1a; margin-top: 0;">Cześć ${data.customerName}!</h2>
        <p>Twoje zamówienie <strong style="color: #d4af37;">#${data.orderNumber}</strong> zostało opłacone i jest w trakcie realizacji.</p>
        
        ${invoiceInfo}
        
        <h3 style="color: #1a1a1a; border-bottom: 2px solid #d4af37; padding-bottom: 10px;">Podsumowanie zamówienia</h3>
        
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #f8f8f8;">
              <th style="padding: 12px; text-align: left;">Produkt</th>
              <th style="padding: 12px; text-align: center;">Ilość</th>
              <th style="padding: 12px; text-align: right;">Cena</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding: 12px; text-align: right;">Produkty:</td>
              <td style="padding: 12px; text-align: right;">${data.subtotal.toFixed(2)} zł</td>
            </tr>
            <tr>
              <td colspan="2" style="padding: 12px; text-align: right;">Dostawa:</td>
              <td style="padding: 12px; text-align: right;">${data.shippingCost.toFixed(2)} zł</td>
            </tr>
            <tr style="background: #f8f8f8; font-weight: bold;">
              <td colspan="2" style="padding: 12px; text-align: right;">Razem:</td>
              <td style="padding: 12px; text-align: right; color: #d4af37; font-size: 18px;">${data.total.toFixed(2)} zł</td>
            </tr>
          </tfoot>
        </table>
        
        <h3 style="color: #1a1a1a; border-bottom: 2px solid #d4af37; padding-bottom: 10px; margin-top: 30px;">Adres dostawy</h3>
        <p style="background: #f8f8f8; padding: 15px; border-radius: 8px;">
          ${data.shippingAddress.street}<br>
          ${data.shippingAddress.postalCode} ${data.shippingAddress.city}
        </p>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="${FRONTEND_URL}/order/${data.orderNumber}" style="display: inline-block; padding: 15px 30px; background: #d4af37; color: #000; text-decoration: none; border-radius: 8px; font-weight: bold;">
            Sprawdź status zamówienia
          </a>
        </div>
        
        <p style="margin-top: 30px; color: #666; font-size: 14px;">
          <strong>Ważne informacje:</strong><br>
          • Odzież sportowa jest szyta na zamówienie - czas realizacji ok. 2 tygodnie od 11. dnia miesiąca<br>
          • Akcesoria wysyłamy w ciągu 1-3 dni roboczych<br>
          • Masz pytania? Napisz do nas: support@wb-partners.pl
        </p>
      </div>
      
      <div style="background: #1a1a1a; padding: 20px; text-align: center;">
        <p style="color: #888; margin: 0; font-size: 12px;">
          © ${new Date().getFullYear()} Acro Clinic. Wszystkie prawa zastrzeżone.
        </p>
      </div>
    </div>
  `;

  const attachments = data.invoicePdf ? [{
    filename: `Faktura_${data.orderNumber}.pdf`,
    content: data.invoicePdf,
    content_type: 'application/pdf',
  }] : undefined;

  await sendEmail(to, `Potwierdzenie zamówienia #${data.orderNumber} - Acro Clinic`, html, attachments);
}
