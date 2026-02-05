import { Router, Request, Response, NextFunction } from 'express';
import { Resend } from 'resend';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';

const router = Router();

// Initialize Resend (null if no API key - email sending will be disabled)
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Rate limiting dla contact endpoint - max 3 wiadomości na godzinę z tego samego IP
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: 'Zbyt wiele wiadomości. Spróbuj ponownie za godzinę.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Validation schema
const contactSchema = z.object({
  name: z.string().min(2, 'Imię musi mieć minimum 2 znaki'),
  email: z.string().email('Nieprawidłowy adres email'),
  subject: z.string().min(3, 'Temat musi mieć minimum 3 znaki'),
  message: z.string().min(10, 'Wiadomość musi mieć minimum 10 znaków'),
});

// POST /api/contact - Wyślij wiadomość kontaktową
router.post('/', contactLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate input
    const data = contactSchema.parse(req.body);

    // Check if Resend is configured
    if (!resend) {
      console.log('Email sending disabled - no RESEND_API_KEY');
      return res.json({
        success: true,
        message: 'Wiadomość została wysłana pomyślnie (dev mode)',
      });
    }

    // Wyślij email przez Resend
    await resend.emails.send({
      from: 'Acro Clinic Shop <onboarding@resend.dev>', // Zmień na swoją zweryfikowaną domenę
      to: ['support@wb-partners.pl'],
      reply_to: data.email,
      subject: `[Kontakt] ${data.subject}`,
      html: `
        <h2>Nowa wiadomość z formularza kontaktowego</h2>
        <p><strong>Od:</strong> ${data.name} (${data.email})</p>
        <p><strong>Temat:</strong> ${data.subject}</p>
        <hr />
        <p><strong>Wiadomość:</strong></p>
        <p>${data.message.replace(/\n/g, '<br>')}</p>
      `,
    });

    res.json({
      success: true,
      message: 'Wiadomość została wysłana pomyślnie',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Błąd walidacji',
        details: error.errors,
      });
    }

    console.error('Contact form error:', error);
    next(error);
  }
});

export { router as contactRouter };
