const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env.local');

console.log(`Checking ${envPath}...`);

try {
  if (fs.existsSync(envPath)) {
    console.log('File exists.');
    const buffer = fs.readFileSync(envPath);
    console.log(`File size: ${buffer.length} bytes`);
    
    // Check for UTF-16LE BOM or null bytes
    let content;
    if (buffer.length >= 2 && buffer[0] === 0xFF && buffer[1] === 0xFE) {
        console.log('Detected UTF-16LE BOM. Decoding as utf16le...');
        content = buffer.toString('utf16le');
    } else if (buffer.indexOf(0x00) !== -1) {
         console.log('Detected null bytes. Trying utf16le...');
         content = buffer.toString('utf16le');
    } else {
        content = buffer.toString('utf8');
    }

    const lines = content.split(/\r?\n/);
    const keys = [];
    lines.forEach((line, index) => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) return;
        
        const parts = trimmed.split('=');
        if (parts.length > 1) {
            keys.push(parts[0].trim());
        }
    });
    
    console.log('Keys found:', keys);
    
    const required = ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'NEXTAUTH_SECRET'];
    const missing = required.filter(k => !keys.includes(k));
    
    if (missing.length > 0) {
        console.log('MISSING REQUIRED KEYS:', missing);
    } else {
        console.log('All required keys appear to be present.');
    }
    
  } else {
    console.log('File DOES NOT exist.');
  }
} catch (err) {
  console.error('Error:', err);
}
