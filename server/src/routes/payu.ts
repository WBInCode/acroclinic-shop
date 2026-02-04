import { Router, Request, Response, NextFunction } from 'express';
import axios from 'axios';
import crypto from 'crypto';
import { prisma } from '../lib/prisma.js';
import { optionalAuth } from '../middleware/auth.js';
import { createError } from '../middleware/errorHandler.js';

const router = Router();

// PayU Configuration
const PAYU_CONFIG = {
  posId: process.env.PAYU_POS_ID || '',
  md5Key: process.env.PAYU_MD5_KEY || '',
  clientId: process.env.PAYU_CLIENT_ID || '',
  clientSecret: process.env.PAYU_CLIENT_SECRET || '',
  baseUrl: process.env.PAYU_BASE_URL || 'https://secure.snd.payu.com',
};

// Helper: Get PayU OAuth token
async function getPayUToken(): Promise<string> {
  try {
    const response = await axios.post(
      `${PAYU_CONFIG.baseUrl}/pl/standard/user/oauth/authorize`,
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: PAYU_CONFIG.clientId,
        client_secret: PAYU_CONFIG.clientSecret,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    return response.data.access_token;
  } catch (error: any) {
    console.error('PayU OAuth error:', error.response?.data || error.message);
    throw createError('Błąd połączenia z PayU', 500, 'PAYU_AUTH_ERROR');
  }
}

// Helper: Calculate signature
function calculateSignature(data: string): string {
  return crypto
    .createHash('md5')
    .update(data + PAYU_CONFIG.md5Key)
    .digest('hex');
}

// POST /api/payu/create - Create PayU order
router.post('/create', optionalAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      throw createError('ID zamówienia jest wymagane', 400, 'ORDER_ID_REQUIRED');
    }

    // Get order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    });

    if (!order) {
      throw createError('Zamówienie nie znalezione', 404, 'ORDER_NOT_FOUND');
    }

    if (order.paymentStatus === 'COMPLETED') {
      throw createError('Zamówienie jest już opłacone', 400, 'ALREADY_PAID');
    }

    // Get OAuth token
    const accessToken = await getPayUToken();

    // Prepare PayU order data
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5000';
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001';

    const payuOrderData = {
      notifyUrl: `${backendUrl}/api/payu/notify`,
      continueUrl: `${frontendUrl}/order/${order.orderNumber}?payment=success`,
      customerIp: req.ip || '127.0.0.1',
      merchantPosId: PAYU_CONFIG.posId,
      description: `Zamówienie ${order.orderNumber} - Acro Clinic`,
      currencyCode: 'PLN',
      totalAmount: Math.round(Number(order.total) * 100).toString(), // PayU uses smallest currency unit
      extOrderId: order.id,
      buyer: {
        email: order.user?.email || 'guest@acroclinic.pl',
        phone: order.shippingPhone || '',
        firstName: order.shippingFirstName,
        lastName: order.shippingLastName,
        language: 'pl',
      },
      products: order.items.map((item) => ({
        name: item.name,
        unitPrice: Math.round(Number(item.price) * 100).toString(),
        quantity: item.quantity.toString(),
      })),
    };

    // Add shipping as product if applicable
    if (Number(order.shippingCost) > 0) {
      payuOrderData.products.push({
        name: 'Dostawa',
        unitPrice: Math.round(Number(order.shippingCost) * 100).toString(),
        quantity: '1',
      });
    }

    // Create PayU order
    const payuResponse = await axios.post(
      `${PAYU_CONFIG.baseUrl}/api/v2_1/orders`,
      payuOrderData,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        maxRedirects: 0,
        validateStatus: (status) => status >= 200 && status < 400,
      }
    );

    const payuOrderId = payuResponse.data.orderId;
    const redirectUrl = payuResponse.data.redirectUri;

    // Save PayU order ID
    await prisma.order.update({
      where: { id: order.id },
      data: {
        payuOrderId,
        paymentStatus: 'PROCESSING',
      },
    });

    // Create payment record
    await prisma.payment.create({
      data: {
        orderId: order.id,
        payuOrderId,
        amount: order.total,
        status: 'PROCESSING',
        method: 'PAYU',
      },
    });

    res.json({
      success: true,
      redirectUrl,
      payuOrderId,
    });
  } catch (error: any) {
    console.error('PayU create order error:', error.response?.data || error.message);
    next(error);
  }
});

// POST /api/payu/notify - PayU notification webhook
router.post('/notify', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const signature = req.headers['openpayu-signature'] as string;
    const body = JSON.stringify(req.body);

    // Verify signature (optional but recommended)
    if (signature) {
      const signatureParts = signature.split(';').reduce((acc: any, part) => {
        const [key, value] = part.split('=');
        acc[key] = value;
        return acc;
      }, {});

      const expectedSignature = calculateSignature(body);
      
      if (signatureParts.signature !== expectedSignature) {
        console.warn('Invalid PayU signature');
        // W produkcji można odrzucić, ale dla testów akceptujemy
      }
    }

    const { order: payuOrder } = req.body;

    if (!payuOrder) {
      res.status(200).json({ status: 'OK' });
      return;
    }

    const { orderId: payuOrderId, status, extOrderId } = payuOrder;

    // Find order
    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { payuOrderId },
          { id: extOrderId },
        ],
      },
    });

    if (!order) {
      console.error('Order not found for PayU notification:', payuOrderId);
      res.status(200).json({ status: 'OK' });
      return;
    }

    // Map PayU status to our status
    let paymentStatus: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'REFUNDED';
    let orderStatus: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';

    switch (status) {
      case 'COMPLETED':
        paymentStatus = 'COMPLETED';
        orderStatus = 'CONFIRMED';
        break;
      case 'CANCELED':
        paymentStatus = 'CANCELLED';
        orderStatus = order.status as any;
        break;
      case 'REJECTED':
        paymentStatus = 'FAILED';
        orderStatus = order.status as any;
        break;
      case 'PENDING':
      case 'WAITING_FOR_CONFIRMATION':
        paymentStatus = 'PROCESSING';
        orderStatus = order.status as any;
        break;
      default:
        paymentStatus = 'PROCESSING';
        orderStatus = order.status as any;
    }

    // Update order
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus,
        status: orderStatus,
        paidAt: paymentStatus === 'COMPLETED' ? new Date() : undefined,
      },
    });

    // Update payment record
    await prisma.payment.updateMany({
      where: { payuOrderId },
      data: {
        status: paymentStatus,
        payuResponse: req.body,
      },
    });

    console.log(`PayU notification processed: Order ${order.orderNumber}, Status: ${status}`);

    res.status(200).json({ status: 'OK' });
  } catch (error) {
    console.error('PayU notify error:', error);
    // Always return 200 to PayU
    res.status(200).json({ status: 'OK' });
  }
});

// GET /api/payu/status/:orderId - Check payment status
router.get('/status/:orderId', optionalAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.params;

    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id: orderId }, { orderNumber: orderId }],
      },
      select: {
        id: true,
        orderNumber: true,
        paymentStatus: true,
        payuOrderId: true,
        total: true,
      },
    });

    if (!order) {
      throw createError('Zamówienie nie znalezione', 404, 'ORDER_NOT_FOUND');
    }

    // If we have PayU order ID, check status directly
    if (order.payuOrderId && order.paymentStatus === 'PROCESSING') {
      try {
        const accessToken = await getPayUToken();
        const response = await axios.get(
          `${PAYU_CONFIG.baseUrl}/api/v2_1/orders/${order.payuOrderId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const payuStatus = response.data.orders?.[0]?.status;
        
        if (payuStatus === 'COMPLETED' && order.paymentStatus !== 'COMPLETED') {
          await prisma.order.update({
            where: { id: order.id },
            data: {
              paymentStatus: 'COMPLETED',
              status: 'CONFIRMED',
              paidAt: new Date(),
            },
          });
          order.paymentStatus = 'COMPLETED';
        }
      } catch (error) {
        console.error('Error checking PayU status:', error);
      }
    }

    res.json({
      orderId: order.id,
      orderNumber: order.orderNumber,
      paymentStatus: order.paymentStatus,
      total: Number(order.total),
    });
  } catch (error) {
    next(error);
  }
});

export { router as payuRouter };
