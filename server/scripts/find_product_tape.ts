import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
    console.log('Searching for products...');
    const products = await prisma.product.findMany({
        where: {
            name: {
                contains: 'taśma',
                mode: 'insensitive'
            }
        }
    });

    console.log('Found products:');
    products.forEach(p => {
        console.log(`- [${p.id}] ${p.name} (Color: ${p.color || 'N/A'})`);
    });
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
