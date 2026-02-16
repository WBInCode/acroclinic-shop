import axios from 'axios';
import 'dotenv/config';

const API_TOKEN = process.env.FAKTUROWNIA_API_TOKEN;
const SUBDOMAIN = process.env.FAKTUROWNIA_SUBDOMAIN;
const BASE_URL = SUBDOMAIN ? `https://${SUBDOMAIN}.fakturownia.pl/` : null;

async function main() {
    console.log('=== Fakturownia API Test ===');
    console.log('Token:', API_TOKEN ? `${API_TOKEN.substring(0, 6)}...` : 'MISSING');
    console.log('Subdomain:', SUBDOMAIN || 'MISSING');
    console.log('Base URL:', BASE_URL || 'NOT SET');
    console.log('Seller NIP:', process.env.SELLER_NIP || 'MISSING');
    console.log('');

    if (!API_TOKEN || !BASE_URL) {
        console.error('FAIL: Fakturownia credentials missing!');
        process.exit(1);
    }

    // Test 1: Check API connectivity by listing invoices
    try {
        console.log('Test 1: Listing recent invoices...');
        const response = await axios.get(`${BASE_URL}invoices.json?page=1&per_page=3&api_token=${API_TOKEN}`, {
            headers: { 'Accept': 'application/json' },
        });

        console.log(`OK: API connection OK! Found ${response.data.length} invoices.`);
        if (response.data.length > 0) {
            response.data.forEach((inv: any) => {
                console.log(`   - ${inv.number}: ${inv.buyer_name} (${inv.total_price_gross} PLN)`);
            });
        }
    } catch (error: any) {
        console.error('FAIL: API connection failed:', error.response?.status, error.response?.data || error.message);
        process.exit(1);
    }

    // Test 2: Create a test receipt using api_token in body (matching new auth method)
    try {
        console.log('');
        console.log('Test 2: Creating a test receipt...');
        const testInvoice = {
            api_token: API_TOKEN,
            invoice: {
                kind: 'receipt',
                number: null,
                sell_date: new Date().toISOString().split('T')[0],
                issue_date: new Date().toISOString().split('T')[0],
                payment_to: new Date().toISOString().split('T')[0],
                payment_type: 'transfer',
                status: 'issued',
                buyer_name: 'Test Kupujacy',
                buyer_street: 'ul. Testowa 1',
                buyer_city: 'Warszawa',
                buyer_post_code: '00-001',
                buyer_country: 'PL',
                buyer_email: 'test@test.pl',
                positions: [
                    {
                        name: 'TEST - Tasma do rozciagania (DO USUNIECIA)',
                        quantity: 1,
                        total_price_gross: 29.99,
                        tax: 23,
                    },
                ],
                description: 'TEST - ten paragon mozna usunac',
            },
        };

        const response = await axios.post(
            `${BASE_URL}invoices.json`,
            testInvoice,
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            }
        );

        const invoice = response.data;
        console.log('OK: Test receipt created!');
        console.log(`   Number: ${invoice.number}`);
        console.log(`   ID: ${invoice.id}`);
        console.log(`   View: ${BASE_URL}invoices/${invoice.id}`);
        console.log('');
        console.log('WARNING: Pamietaj aby usunac ten testowy paragon z Fakturowni!');

    } catch (error: any) {
        console.error('FAIL: Receipt creation failed:', error.response?.status);
        if (error.response?.data) {
            console.error('Response:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('Error:', error.message);
        }
    }
}

main();
