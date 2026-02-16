
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const count = await prisma.order.count();
        console.log(`Total orders in DB: ${count}`);

        const orders = await prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                items: true
            }
        });

        console.log('Last 5 orders:');
        orders.forEach(o => {
            console.log(`- ${o.orderNumber}: Status=${o.status}, Payment=${o.paymentStatus}, Items=${o.items.length}, CreatedAt=${o.createdAt}`);
        });

        const users = await prisma.user.count();
        console.log(`Total users: ${users}`);

    } catch (error) {
        console.error('Error querying DB:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
