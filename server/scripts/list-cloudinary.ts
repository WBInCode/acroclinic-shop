// Skrypt do listowania folderów z Cloudinary
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function listFolders() {
  console.log('📁 Pobieranie struktury folderów z Cloudinary...\n');

  try {
    // Pobierz główne foldery
    const rootFolders = await cloudinary.api.root_folders();
    
    console.log('=== GŁÓWNE FOLDERY ===');
    for (const folder of rootFolders.folders) {
      console.log(`\n📂 ${folder.name}/`);
      
      // Pobierz podfoldery
      try {
        const subFolders = await cloudinary.api.sub_folders(folder.path);
        
        for (const subFolder of subFolders.folders) {
          console.log(`   └── 📁 ${subFolder.name}/`);
          
          // Pobierz zdjęcia w podfolderze
          const resources = await cloudinary.api.resources({
            type: 'upload',
            prefix: subFolder.path,
            max_results: 10,
          });
          
          for (const resource of resources.resources) {
            const fileName = resource.public_id.split('/').pop();
            console.log(`       └── 🖼️  ${fileName}`);
          }
        }
      } catch (e) {
        // Może nie mieć podfolderów
        const resources = await cloudinary.api.resources({
          type: 'upload',
          prefix: folder.path,
          max_results: 10,
        });
        
        for (const resource of resources.resources) {
          const fileName = resource.public_id.split('/').pop();
          console.log(`   └── 🖼️  ${fileName}`);
        }
      }
    }
    
    console.log('\n✅ Gotowe!');
  } catch (error) {
    console.error('❌ Błąd:', error);
  }
}

listFolders();
