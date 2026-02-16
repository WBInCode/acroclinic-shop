import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

async function runTests() {
    console.log('Starting backend verification...');

    // 1. Health Check
    try {
        const health = await axios.get(`${API_URL}/health`);
        console.log('✅ Health Check:', health.status, health.data);
    } catch (e: any) {
        console.error('❌ Health Check Failed:', e.message);
    }

    // 2. Get Products
    let products: any[] = [];
    try {
        const res = await axios.get(`${API_URL}/products?limit=5`);
        console.log('✅ Get Products:', res.status, `Found ${res.data.products.length} products`);
        products = res.data.products;
    } catch (e: any) {
        console.error('❌ Get Products Failed:', e.message);
    }

    // 3. Check Shipping Config
    try {
        const res = await axios.get(`${API_URL}/orders/config/shipping`);
        console.log('✅ Shipping Config:', res.status, res.data);
    } catch (e: any) {
        console.error('❌ Shipping Config Failed:', e.message);
    }

    // 4. Simulate Cart Sync
    if (products.length > 0) {
        try {
            const item = products[0];
            const res = await axios.put(`${API_URL}/cart/sync`, {
                items: [{ productId: item.id, quantity: 1 }]
            }, {
                headers: { 'X-Session-ID': 'test-session-123' }
            });
            console.log('✅ Cart Sync:', res.status, res.data);
        } catch (e: any) {
            console.error('❌ Cart Sync Failed:', e.message);
        }
    }

    // 5. Test Frontend Reachability
    try {
        const res = await axios.get('http://localhost:5000');
        console.log('✅ Frontend Reachable:', res.status, 'Title:', res.data.match(/<title>(.*?)<\/title>/)?.[1] || 'No title');
    } catch (e: any) {
        console.error('❌ Frontend Unreachable:', e.message);
    }
}

runTests();
