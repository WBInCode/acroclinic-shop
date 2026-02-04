import { v2 as cloudinary } from 'cloudinary';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function fetchCloudinaryImages() {
  try {
    console.log('🔍 Fetching images from Cloudinary...\n');

    // Pobierz wszystkie zasoby z Cloudinary
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: '', // Pobierz wszystkie, możesz dodać prefix jeśli są w folderze
      max_results: 500,
    });

    console.log(`📦 Found ${result.resources.length} images\n`);

    // Grupuj obrazy według nazwy produktu
    const imagesByProduct: { [key: string]: any[] } = {};

    result.resources.forEach((resource: any) => {
      const filename = resource.public_id.split('/').pop(); // Ostatnia część to nazwa pliku
      const productName = filename?.split('_-_')[0] || filename; // Np. "Bluza", "spodenki"
      
      if (!imagesByProduct[productName]) {
        imagesByProduct[productName] = [];
      }
      
      imagesByProduct[productName].push({
        filename: filename,
        url: resource.secure_url,
        public_id: resource.public_id,
        created_at: resource.created_at,
      });
    });

    // Wyświetl pogrupowane zdjęcia
    console.log('📸 Images grouped by product:\n');
    Object.keys(imagesByProduct).sort().forEach(productName => {
      console.log(`\n🏷️  ${productName.toUpperCase()}:`);
      imagesByProduct[productName].forEach((img, idx) => {
        console.log(`   ${idx + 1}. ${img.filename}`);
        console.log(`      ${img.url}`);
      });
    });

    // Wygeneruj seed data
    console.log('\n\n📝 Generated seed data:\n');
    console.log('Copy this to your seed.ts file:\n');
    
    const productMapping: { [key: string]: string } = {
      'Bluza': 'bluza-regular-dziecieca',
      'Bluzka': 'koszulka-bokserka',
      'T-Shirt': 't-shirt-dzieciecy',
      'sweter': 'longsleeve-dzieciecy',
      'spodenki': 'spodenki-kolarki',
      'top': 'top-sportowy',
      'legginsy': 'legginsy',
      'spodnie': 'dresy-jogger-dzieciece',
    };

    Object.keys(imagesByProduct).sort().forEach(productName => {
      const slug = productMapping[productName];
      if (slug) {
        console.log(`// ${productName}`);
        console.log(`images: [`);
        imagesByProduct[productName].forEach((img, idx) => {
          const isMain = idx === 0 ? ', isMain: true' : '';
          console.log(`  { url: '${img.url}'${isMain}, position: ${idx} },`);
        });
        console.log(`],\n`);
      }
    });

  } catch (error) {
    console.error('❌ Error fetching Cloudinary images:', error);
    process.exit(1);
  }
}

fetchCloudinaryImages();
