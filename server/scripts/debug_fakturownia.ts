import axios from 'axios';
import 'dotenv/config';

const API_TOKEN = process.env.FAKTUROWNIA_API_TOKEN;
const SUBDOMAIN = process.env.FAKTUROWNIA_SUBDOMAIN;
const BASE_URL = SUBDOMAIN ? `https://${SUBDOMAIN}.fakturownia.pl/` : null;

async function main() {
    console.log('=== Fakturownia API Debug ===');
    console.log('Base URL:', BASE_URL);

    if (!API_TOKEN || !BASE_URL) {
        console.error('Missing credentials');
        return;
    }

    const payload = {
        api_token: API_TOKEN,
        invoice: {
            kind: 'receipt',
            sell_date: new Date().toISOString().split('T')[0],
            issue_date: new Date().toISOString().split('T')[0],
            payment_to: new Date().toISOString().split('T')[0],
            payment_type: 'transfer',
            status: 'issued',
            buyer_name: 'Test Debug',
            seller_name: 'Acro Clinic',
            seller_tax_no: process.env.SELLER_NIP || '',
            positions: [
                { name: 'Test Product', quantity: 1, total_price_gross: 10.00, tax: 23 }
            ],
            send_email: true,
            buyer_email: 'test@example.com',
            buyer_email_for_sending: 'test@example.com'
        }
    };

    try {
        const response = await axios.post(`${BASE_URL}invoices.json`, payload);
        console.log('SUCCESS:', response.data.number);
        // Cleanup
        await axios.delete(`${BASE_URL}invoices/${response.data.id}.json?api_token=${API_TOKEN}`);
        console.log('Deleted test invoice');
    } catch (error: any) {
        console.error('ERROR STATUS:', error.response?.status);
        console.error('ERROR DATA:', JSON.stringify(error.response?.data, null, 2));
    }
}

main();
