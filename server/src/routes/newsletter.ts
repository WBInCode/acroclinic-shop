import { Router, Request, Response, NextFunction } from 'express';
import { Resend } from 'resend';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import { prisma } from '../lib/prisma.js';
import { randomUUID } from 'crypto';

const router = Router();

// Initialize Resend
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Rate limiting - max 5 zapisów na godzinę z tego samego IP
const newsletterLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: { error: 'Zbyt wiele prób. Spróbuj ponownie za godzinę.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Validation
const subscribeSchema = z.object({
    email: z.string().email('Nieprawidłowy adres email'),
});

// POST /api/newsletter/subscribe - Zapisz się do newslettera
router.post('/subscribe', newsletterLimiter, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = subscribeSchema.parse(req.body);

        // Sprawdź czy email już istnieje
        const existing = await prisma.newsletterSubscriber.findUnique({
            where: { email },
        });

        if (existing) {
            if (existing.status === 'CONFIRMED') {
                return res.json({
                    success: true,
                    message: 'Ten adres email jest już zapisany do newslettera.',
                });
            }

            if (existing.status === 'UNSUBSCRIBED') {
                // Ponowna subskrypcja
                const token = randomUUID();
                await prisma.newsletterSubscriber.update({
                    where: { email },
                    data: {
                        status: 'PENDING',
                        confirmationToken: token,
                        unsubscribedAt: null,
                    },
                });

                await sendConfirmationEmail(email, token);

                return res.json({
                    success: true,
                    message: 'Wysłaliśmy link potwierdzający na Twój adres email.',
                });
            }

            // PENDING - wyślij ponownie
            const token = randomUUID();
            await prisma.newsletterSubscriber.update({
                where: { email },
                data: { confirmationToken: token },
            });

            await sendConfirmationEmail(email, token);

            return res.json({
                success: true,
                message: 'Wysłaliśmy ponownie link potwierdzający na Twój adres email.',
            });
        }

        // Nowa subskrypcja
        const token = randomUUID();
        await prisma.newsletterSubscriber.create({
            data: {
                email,
                confirmationToken: token,
            },
        });

        await sendConfirmationEmail(email, token);

        res.json({
            success: true,
            message: 'Dziękujemy! Sprawdź swoją skrzynkę email, aby potwierdzić subskrypcję.',
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                error: 'Nieprawidłowy adres email',
                details: error.errors,
            });
        }
        console.error('Newsletter subscribe error:', error);
        next(error);
    }
});

// GET /api/newsletter/confirm/:token - Potwierdź subskrypcję
router.get('/confirm/:token', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { token } = req.params;

        const subscriber = await prisma.newsletterSubscriber.findUnique({
            where: { confirmationToken: token },
        });

        if (!subscriber) {
            return res.status(400).json({
                error: 'Nieprawidłowy lub wygasły link potwierdzający.',
            });
        }

        if (subscriber.status === 'CONFIRMED') {
            return res.json({
                success: true,
                message: 'Twoja subskrypcja jest już potwierdzona.',
            });
        }

        await prisma.newsletterSubscriber.update({
            where: { id: subscriber.id },
            data: {
                status: 'CONFIRMED',
                confirmedAt: new Date(),
                confirmationToken: null,
            },
        });

        // Przekieruj na stronę główną z parametrem sukcesu
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        res.redirect(`${frontendUrl}?newsletter=confirmed`);
    } catch (error) {
        console.error('Newsletter confirm error:', error);
        next(error);
    }
});

// GET /api/newsletter/unsubscribe/:email - Wypisz się (link z maila)
router.get('/unsubscribe/:email', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.params;

        const subscriber = await prisma.newsletterSubscriber.findUnique({
            where: { email },
        });

        if (!subscriber) {
            return res.status(404).json({ error: 'Nie znaleziono subskrypcji.' });
        }

        await prisma.newsletterSubscriber.update({
            where: { email },
            data: {
                status: 'UNSUBSCRIBED',
                unsubscribedAt: new Date(),
            },
        });

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        res.redirect(`${frontendUrl}?newsletter=unsubscribed`);
    } catch (error) {
        console.error('Newsletter unsubscribe error:', error);
        next(error);
    }
});

// GET /api/newsletter/status/:email - Sprawdź status subskrypcji
router.get('/status/:email', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.params;

        const subscriber = await prisma.newsletterSubscriber.findUnique({
            where: { email },
        });

        if (!subscriber) {
            return res.json({ subscribed: false, status: null });
        }

        res.json({
            subscribed: subscriber.status === 'CONFIRMED',
            status: subscriber.status,
        });
    } catch (error) {
        console.error('Newsletter status error:', error);
        next(error);
    }
});

// POST /api/newsletter/unsubscribe - Wypisz się (z panelu użytkownika)
router.post('/unsubscribe', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = z.object({ email: z.string().email() }).parse(req.body);

        const subscriber = await prisma.newsletterSubscriber.findUnique({
            where: { email },
        });

        if (!subscriber) {
            return res.json({ success: true, message: 'Nie jesteś zapisany/a do newslettera.' });
        }

        await prisma.newsletterSubscriber.update({
            where: { email },
            data: {
                status: 'UNSUBSCRIBED',
                unsubscribedAt: new Date(),
            },
        });

        res.json({
            success: true,
            message: 'Zostałeś/aś wypisany/a z newslettera.',
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Nieprawidłowy adres email' });
        }
        console.error('Newsletter unsubscribe error:', error);
        next(error);
    }
});

// Helper: Wyślij email z potwierdzeniem
async function sendConfirmationEmail(email: string, token: string) {
    if (!resend) {
        console.log(`[DEV] Newsletter confirmation link for ${email}: /api/newsletter/confirm/${token}`);
        return;
    }

    const apiUrl = process.env.API_URL || `http://localhost:${process.env.PORT || 3001}`;
    const confirmUrl = `${apiUrl}/api/newsletter/confirm/${token}`;
    const unsubscribeUrl = `${apiUrl}/api/newsletter/unsubscribe/${email}`;

    await resend.emails.send({
        from: process.env.RESEND_FROM || 'Acro Clinic <onboarding@resend.dev>',
        to: [email],
        subject: 'Potwierdź subskrypcję newslettera — Acro Clinic',
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin:0; padding:0; background-color:#000000; font-family:'Helvetica Neue', Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#000000; padding:40px 20px;">
          <tr>
            <td align="center">
              <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;">
                <!-- Logo -->
                <tr>
                  <td align="center" style="padding-bottom:40px;">
                    <span style="font-family:Georgia,serif; font-size:28px; color:#ffffff; font-weight:normal;">Acro</span>
                    <span style="font-family:Georgia,serif; font-size:28px; color:#d4af37; font-style:italic; margin-left:4px;">Clinic</span>
                  </td>
                </tr>
                
                <!-- Divider -->
                <tr>
                  <td align="center" style="padding-bottom:40px;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:48px; height:1px; background:linear-gradient(to right, transparent, rgba(212,175,55,0.3));"></td>
                        <td style="width:6px; height:6px; border:1px solid rgba(212,175,55,0.4); transform:rotate(45deg); margin:0 8px;"></td>
                        <td style="width:48px; height:1px; background:linear-gradient(to left, transparent, rgba(212,175,55,0.3));"></td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Content -->
                <tr>
                  <td align="center" style="padding-bottom:32px;">
                    <h1 style="font-family:Georgia,serif; font-size:24px; color:#ffffff; font-weight:normal; margin:0 0 16px;">
                      Potwierdź <span style="color:#d4af37; font-style:italic;">subskrypcję</span>
                    </h1>
                    <p style="font-family:'Helvetica Neue', Arial, sans-serif; font-size:14px; color:rgba(255,255,255,0.5); line-height:1.6; margin:0;">
                      Dziękujemy za zapisanie się do newslettera Acro Clinic.<br>
                      Kliknij poniższy przycisk, aby potwierdzić subskrypcję.
                    </p>
                  </td>
                </tr>
                
                <!-- Button -->
                <tr>
                  <td align="center" style="padding-bottom:40px;">
                    <a href="${confirmUrl}" 
                       style="display:inline-block; padding:16px 40px; background:linear-gradient(135deg,#d4af37,#b8962e); color:#000000; font-family:'Helvetica Neue', Arial, sans-serif; font-weight:600; font-size:13px; letter-spacing:0.15em; text-transform:uppercase; text-decoration:none; border-radius:9999px;">
                      Potwierdzam subskrypcję
                    </a>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td align="center" style="padding-top:32px; border-top:1px solid rgba(255,255,255,0.05);">
                    <p style="font-family:'Helvetica Neue', Arial, sans-serif; font-size:11px; color:rgba(255,255,255,0.2); line-height:1.6; margin:0;">
                      Jeśli nie zapisywałeś/aś się do naszego newslettera, zignoruj tę wiadomość.<br>
                      <a href="${unsubscribeUrl}" style="color:rgba(255,255,255,0.3); text-decoration:underline;">Wypisz się</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
    });
}

export { router as newsletterRouter };
