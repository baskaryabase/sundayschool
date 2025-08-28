/**
 * This script fixes model imports and TypeScript enums in seeder files
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
  let newContent = content;
  
  // Fix imports
  if (content.includes('from \'../models/')) {
    console.log(`Fixing model imports in ${file}`);
    newContent = newContent.replace(/import.*from\s+'\.\.\/models\/.*';/g, '');
  }
  
  // Fix UserRole enums
  if (content.includes('UserRole.')) {
    console.log(`Fixing UserRole enums in ${file}`);
    newContent = newContent
      .replace(/UserRole\.ADMIN/g, "'ADMIN'")
      .replace(/UserRole\.TEACHER/g, "'TEACHER'")
      .replace(/UserRole\.STUDENT/g, "'STUDENT'")
      .replace(/UserRole\.PARENT/g, "'PARENT'");
  }
  
  // Write changes if needed
  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent);
    console.log(`Successfully updated ${file}`);
  } else {
    console.log(`No changes needed for ${file}`);
  }
});

console.log('All seeder files processed');
