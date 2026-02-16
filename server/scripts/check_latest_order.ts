
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const order = await prisma.order.findFirst({
            orderBy: { createdAt: 'desc' },
        });

        if (order) {
            console.log('Latest Order:', {
                id: order.id,
                orderNumber: order.orderNumber,
                status: order.status,
                paymentStatus: order.paymentStatus,
                payuOrderId: order.payuOrderId,
                createdAt: order.createdAt
            });
        } else {
            console.log('No orders found.');
        }

    } catch (error) {
        console.error('Error querying DB:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
