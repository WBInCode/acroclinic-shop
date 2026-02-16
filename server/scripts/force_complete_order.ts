
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const order = await prisma.order.findFirst({
            orderBy: { createdAt: 'desc' },
        });

        if (!order) {
            console.log('No orders found.');
            return;
        }

        console.log(`Updating Order ${order.orderNumber} (ID: ${order.id})`);
        console.log(`Current Status: ${order.status}, Payment: ${order.paymentStatus}`);

        const updated = await prisma.order.update({
            where: { id: order.id },
            data: {
                status: 'CONFIRMED',
                paymentStatus: 'COMPLETED',
                paidAt: new Date(),
            },
        });

        console.log('✅ Order updated successfully!');
        console.log(`New Status: ${updated.status}, Payment: ${updated.paymentStatus}`);

    } catch (error) {
        console.error('Error updating DB:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
