
import { fetch } from 'undici';

async function checkSite() {
    console.log("Starting verification...");

    // 1. Check Frontend
    try {
        const res = await fetch('http://localhost:5173/');
        console.log(`Frontend Status: ${res.status}`);

        if (res.status === 200) {
            const text = await res.text();
            // Check for fonts
            const hasMontserrat = text.includes('Montserrat');
            const hasInter = text.includes('Inter');
            console.log(`Has Montserrat: ${hasMontserrat}`);
            console.log(`Has Inter: ${hasInter}`);

            // Check for hidden header class (approximation, as classes might be dynamic/minified, but index.html is static-ish in dev)
            // Actually, React renders in browser, so raw HTML might just be the root div + scripts. 
            // We can check if the main.tsx script is linked.
            console.log(`Has main script: ${text.includes('/src/main.tsx')}`);
        }
    } catch (e) {
        console.error("Frontend check failed:", e.message);
    }

    // 2. Check Backend
    try {
        const res = await fetch('http://localhost:5000/api/products');
        console.log(`Backend Status: ${res.status}`);
        if (res.status === 200) {
            const json = await res.json();
            console.log(`Products fetched: ${Array.isArray(json) ? json.length : 'Error'}`);
        }
    } catch (e) {
        console.error("Backend check failed:", e.message);
    }
}

checkSite();
