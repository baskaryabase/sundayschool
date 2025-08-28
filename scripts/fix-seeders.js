/**
 * This script updates seeder files to use ES module exports
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const seedersPath = path.join(__dirname, '../src/seeders');

// Get all seeder files
const files = fs.readdirSync(seedersPath).filter(file => file.endsWith('.ts'));

// Process each file
files.forEach(file => {
  const filePath = path.join(seedersPath, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Check if the file uses CommonJS exports
  if (content.includes('module.exports =')) {
    console.log(`Converting ${file} to ES module format`);
    
    // Replace CommonJS exports with ES module exports
    content = content.replace(
      /module\.exports\s*=\s*/,
      'const seeder = '
    );
    
    // Add export default at the end
    content += '\n\nexport default seeder;\n';
    
    // Write the updated content back to the file
    fs.writeFileSync(filePath, content);
    console.log(`Successfully updated ${file}`);
  } else {
    console.log(`${file} already uses ES module format or has no exports`);
  }
});

console.log('All seeder files processed');
