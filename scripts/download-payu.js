import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const url = "https://static.payu.com/sites/all/files/payu_logo_2.png";
// Go up one level from scripts/ to root, then into public/
const dest = path.join(__dirname, '../public/payu-logo.png');

const file = fs.createWriteStream(dest);
https.get(url, function (response) {
    response.pipe(file);
    file.on('finish', function () {
        file.close(() => {
            console.log("Download completed.");
        });
    });
}).on('error', function (err) {
    fs.unlink(dest, () => { }); // Delete the file async. (But we don't check result)
    console.error("Error downloading file:", err.message);
});
