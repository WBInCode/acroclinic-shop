import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputLogo = path.join(__dirname, '../public/images/logo.png');
const outputDir = path.join(__dirname, '../public');

async function generateFavicons() {
    try {
        // Generate favicon.ico (32x32)
        await sharp(inputLogo)
            .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
            .png()
            .toFile(path.join(outputDir, 'favicon-32x32.png'));

        // Generate 16x16
        await sharp(inputLogo)
            .resize(16, 16, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
            .png()
            .toFile(path.join(outputDir, 'favicon-16x16.png'));

        // Generate apple-touch-icon (180x180)
        await sharp(inputLogo)
            .resize(180, 180, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
            .png()
            .toFile(path.join(outputDir, 'apple-touch-icon.png'));

        // Generate og-image (1200x630) - with black background for social sharing
        await sharp(inputLogo)
            .resize(400, 400, { fit: 'contain', background: { r: 10, g: 10, b: 10, alpha: 255 } })
            .extend({
                top: 115,
                bottom: 115,
                left: 400,
                right: 400,
                background: { r: 10, g: 10, b: 10, alpha: 255 }
            })
            .png()
            .toFile(path.join(outputDir, 'og-image.png'));

        // Generate favicon.ico replacement (use 32x32 png as ico)
        await sharp(inputLogo)
            .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
            .toFormat('png')
            .toFile(path.join(outputDir, 'favicon.ico'));

        console.log('✅ All favicons generated successfully!');
    } catch (err) {
        console.error('Error generating favicons:', err);
    }
}

generateFavicons();
