
import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

const PAYU_CONFIG = {
    clientId: '502587',
    clientSecret: 'a5b7f5c75cc2781829f45e61df4335ff',
    baseUrl: 'https://secure.snd.payu.com',
};

async function getPayUToken() {
    try {
        const response = await axios.post(
            `${PAYU_CONFIG.baseUrl}/pl/standard/user/oauth/authorize`,
            new URLSearchParams({
                grant_type: 'client_credentials',
                client_id: PAYU_CONFIG.clientId,
                client_secret: PAYU_CONFIG.clientSecret,
            }),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );
        return response.data.access_token;
    } catch (error: any) {
        console.error('PayU OAuth error:', error.response?.data || error.message);
        throw error;
    }
}

async function main() {
    try {
        const order = await prisma.order.findFirst({
            orderBy: { createdAt: 'desc' },
            where: { payuOrderId: { not: null } }
        });

        if (!order || !order.payuOrderId) {
            console.log('No order with PayU ID found');
            return;
        }

        console.log(`Checking status for Order ${order.orderNumber} (PayU ID: ${order.payuOrderId})`);

        const token = await getPayUToken();
        console.log('Token acquired:', token.substring(0, 10) + '...');

        const response = await axios.get(
            `${PAYU_CONFIG.baseUrl}/api/v2_1/orders/${order.payuOrderId}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );

        const payuOrder = response.data.orders[0];
        console.log('PayU Status:', payuOrder.status);
        console.log('Full Response:', JSON.stringify(payuOrder, null, 2));

    } catch (error: any) {
        console.error('Error:', error.response?.data || error.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
