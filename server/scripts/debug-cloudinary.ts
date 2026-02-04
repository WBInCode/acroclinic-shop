// Szczegółowe sprawdzenie zdjęć w Cloudinary
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function debugCloudinary() {
  console.log('🔍 Szczegółowa analiza Cloudinary...\n');

  try {
    // Sprawdź wszystkie zasoby
    const allResources = await cloudinary.api.resources({
      type: 'upload',
      max_results: 100,
    });

    console.log(`📊 Znaleziono ${allResources.resources.length} plików:\n`);

    // Grupuj po folderach
    const byFolder: Record<string, string[]> = {};
    
    for (const resource of allResources.resources) {
      const parts = resource.public_id.split('/');
      const folder = parts.length > 1 ? parts.slice(0, -1).join('/') : '(root)';
      const filename = parts[parts.length - 1];
      
      if (!byFolder[folder]) {
        byFolder[folder] = [];
      }
      byFolder[folder].push(filename);
    }

    for (const [folder, files] of Object.entries(byFolder).sort()) {
      console.log(`📁 ${folder}/`);
      for (const file of files.slice(0, 3)) {
        console.log(`   └── ${file}`);
      }
      if (files.length > 3) {
        console.log(`   └── ... i ${files.length - 3} więcej`);
      }
      console.log();
    }

    // Sprawdź konkretny folder
    console.log('\n🔍 Sprawdzam folder "ciuchy/bluza":');
    const bluzaResources = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'ciuchy/bluza',
      max_results: 10,
    });
    console.log('Wynik:', bluzaResources.resources.length, 'plików');
    bluzaResources.resources.forEach((r: any) => {
      console.log('  -', r.public_id, '| URL:', r.secure_url?.substring(0, 60) + '...');
    });

  } catch (error: any) {
    console.error('❌ Błąd:', error.message);
  }
}

debugCloudinary();
