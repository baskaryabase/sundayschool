// Script to update all migration files to ES Module format

import fs from 'fs';
import path from 'path';

const migrationsDir = './src/migrations';

// Get all migration files
const files = fs.readdirSync(migrationsDir).filter(file => file.endsWith('.ts'));

console.log(`Found ${files.length} migration files to update...`);

for (const file of files) {
  const filePath = path.join(migrationsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Skip files that have already been updated
  if (content.includes('export default migration')) {
    console.log(`Skipping ${file} - already updated`);
    continue;
  }
  
  // Replace module.exports with const migration
  content = content.replace('module.exports = {', 'const migration = {');
  
  // Add export default at the end
  content = content.replace(/};(\s*)$/, '};\n\nexport default migration;$1');
  
  // Write the updated content back to file
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file} to use ES module format`);
}

console.log('All migration files have been updated!');
