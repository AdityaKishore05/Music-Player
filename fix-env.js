const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env.local');

try {
    if (fs.existsSync(envPath)) {
        const buffer = fs.readFileSync(envPath);
        let content;
        
        if (buffer.length >= 2 && buffer[0] === 0xFF && buffer[1] === 0xFE) {
            console.log('Detected UTF-16LE BOM. Converting to UTF-8...');
            content = buffer.toString('utf16le');
        } else if (buffer.indexOf(0x00) !== -1) {
             console.log('Detected null bytes (likely UTF-16LE). Converting to UTF-8...');
             content = buffer.toString('utf16le');
        } else {
            console.log('File seems to be UTF-8 already. No changes needed.');
            process.exit(0);
        }

        fs.writeFileSync(envPath, content, 'utf8');
        console.log('Successfully converted .env.local to UTF-8.');
    } else {
        console.log('.env.local not found.');
    }
} catch (err) {
    console.error('Error:', err);
}
