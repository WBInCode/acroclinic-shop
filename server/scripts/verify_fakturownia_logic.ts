import { PrismaClient } from '@prisma/client';
import { generateInvoiceForOrder } from '../src/lib/fakturownia';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
    console.log('=== Verifying Fakturownia Logic ===');

    // 1. Create a dummy test order
    const orderNumber = `TEST-LOGIC-${Date.now()}`;
    console.log(`Creating order ${orderNumber}...`);

    // Need a product
    const product = await prisma.product.findFirst();
    if (!product) { console.error('No products'); return; }

    const order = await prisma.order.create({
        data: {
            orderNumber,
            status: 'CONFIRMED',
            paymentStatus: 'COMPLETED', // Needs to be completed for invoice
            paidAt: new Date(),
            total: 50.00,
            subtotal: 40.00,
            shippingCost: 10.00,
            shipmentType: 'STANDARD',
            shippingFirstName: 'Test',
            shippingLastName: 'Logic',
            shippingStreet: 'Logic 1',
            shippingCity: 'Logice',
            shippingPostalCode: '00-001',
            shippingCountry: 'Polska',
            shippingEmail: 'test@logic.pl',
            items: {
                create: [
                    { name: product.name, quantity: 1, price: 40.00, productId: product.id }
                ]
            }
        }
    });

    console.log(`Order created: ${order.id}`);

    // 2. Call generateInvoiceForOrder directly
    console.log('Generating invoice...');
    try {
        const invoice = await generateInvoiceForOrder(order.id);

        if (invoice) {
            console.log('✅ Invoice generated successfully!');
            console.log('Number:', invoice.number);
            console.log('URL:', invoice.view_url);
        } else {
            console.error('❌ Failed to generate invoice (returned null).');
        }
    } catch (error: any) {
        console.error('❌ Error generating invoice:', error.message);
        if (error.response) {
            console.error('Response data:', JSON.stringify(error.response.data, null, 2));
        }
    }

    // Cleanup
    // await prisma.order.delete({ where: { id: order.id } });
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
