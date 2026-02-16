import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient();
const API_URL = 'http://localhost:3001/api';

async function main() {
    try {
        console.log('=== Simulating PayU Flow ===');

        // 1. Create a dummy order
        const orderNumber = `TEST-${Date.now()}`;
        console.log(`Creating order ${orderNumber}...`);

        const order = await prisma.order.create({
            data: {
                orderNumber,
                status: 'PENDING',
                paymentStatus: 'PENDING',
                total: 100.00,
                subtotal: 80.00,
                shippingCost: 20.00,
                items: {
                    create: [
                        {
                            name: 'Test Product Flow',
                            quantity: 1,
                            price: 80.00,
                            productId: 'cm6v1q2w30000u90g12345678', // Use a real ID if needed, or dummy
                        }
                    ]
                },
                shippingFirstName: 'Test',
                shippingLastName: 'Flow',
                shippingStreet: 'Testowa 1',
                shippingCity: 'Warszawa',
                shippingPostalCode: '00-001',
                shippingCountry: 'Polska',
                // PayU ID
                payuOrderId: `PAYU-${Date.now()}`,
            },
            include: { items: true }
        });

        // Check if we need to create a dummy product first or if we can use existing one?
        // Prisma will fail if productId doesn't exist.
        // Let's use `findFirst` product to get a valid ID.
    } catch (err) {
        // If fail, likely product ID issue.
        // Let's get a real product first.
    }
}

// Rewriting main with safe product fetch
async function run() {
    try {
        const product = await prisma.product.findFirst();
        if (!product) {
            console.error('No products in DB');
            return;
        }

        const orderNumber = `TEST-${Date.now()}`;
        const payuOrderId = `PAYU-${Date.now()}`;

        console.log(`Creating Order ${orderNumber} (PayU ID: ${payuOrderId})...`);

        const order = await prisma.order.create({
            data: {
                orderNumber,
                status: 'PENDING',
                paymentStatus: 'PENDING',
                total: 123.00,
                subtotal: 100.00,
                shippingCost: 23.00,
                shipmentType: 'STANDARD',
                shippingFirstName: 'Test',
                shippingLastName: 'Simulation',
                shippingStreet: 'Simulated 1',
                shippingCity: 'Warszawa',
                shippingPostalCode: '00-001',
                shippingCountry: 'Polska',
                shippingEmail: 'test@simulation.pl',
                payuOrderId,
                items: {
                    create: [
                        {
                            name: product.name,
                            quantity: 1,
                            price: 100.00,
                            productId: product.id
                        }
                    ]
                }
            }
        });

        console.log(`Order created: ${order.id}`);

        // 2. Simulate PayU Notification
        console.log('Sending PayU notification...');

        const notifyPayload = {
            order: {
                orderId: payuOrderId,
                extOrderId: order.id,
                orderCreateDate: new Date().toISOString(),
                notifyUrl: 'http://localhost:3001/api/payu/notify',
                merchantPosId: '502587',
                description: 'Test Order',
                currencyCode: 'PLN',
                totalAmount: '12300',
                buyer: {
                    email: 'test@simulation.pl',
                    phone: '123456789',
                    firstName: 'Test',
                    lastName: 'Simulation'
                },
                products: [
                    { name: product.name, unitPrice: '10000', quantity: '1' },
                    { name: 'Dostawa', unitPrice: '2300', quantity: '1' }
                ],
                status: 'COMPLETED'
            }
        };

        const crypto = require('crypto');

        // Calculate signature
        const data = JSON.stringify(notifyPayload);
        const key = process.env.PAYU_SECOND_KEY || '';
        const signature = crypto.createHash('md5').update(data + key).digest('hex');
        const header = `sender=checkout;signature=${signature};algorithm=MD5`;

        const response = await axios.post(`${API_URL}/payu/notify`, notifyPayload, {
            headers: {
                'OpenPayU-Signature': header,
                'Content-Type': 'application/json'
            }
        });

        console.log('Notification sent. Response:', response.status);

        // 3. Verify Order Status and Invoice
        console.log('Verifying order status...');

        // Wait a bit for async invoice generation
        await new Promise(r => setTimeout(r, 2000));

        const updatedOrder = await prisma.order.findUnique({
            where: { id: order.id }
        });

        console.log('Updated Status:', updatedOrder?.status);
        console.log('Updated Payment:', updatedOrder?.paymentStatus);
        console.log('Invoice Number:', updatedOrder?.invoiceNumber);
        console.log('Invoice URL:', updatedOrder?.invoiceUrl);

        if (updatedOrder?.paymentStatus === 'COMPLETED' && updatedOrder?.invoiceNumber) {
            console.log('✅ TEST PASSED: Order completed and invoice generated!');
        } else {
            console.error('❌ TEST FAILED: Order not updated or invoice missing.');
        }

    } catch (error: any) {
        console.error('Error:', error.message);
        if (error.response) console.error('Response:', error.response.data);
    } finally {
        await prisma.$disconnect();
    }
}

run();
