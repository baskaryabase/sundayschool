// Script to fix model imports in migration files

import fs from 'fs';
import path from 'path';

const migrationsDir = './src/migrations';

// Get all migration files
const files = fs.readdirSync(migrationsDir).filter(file => file.endsWith('.ts'));

console.log(`Found ${files.length} migration files to check for model imports...`);

for (const file of files) {
  const filePath = path.join(migrationsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Check if file imports from models
  if (content.includes('from \'../models/')) {
    console.log(`Fixing model imports in ${file}`);
    
    // Handle AttendanceStatus enum
    if (content.includes('AttendanceStatus')) {
      content = content.replace(
        "import { AttendanceStatus } from '../models/Attendance';",
        `// Attendance status enum
enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  EXCUSED = 'EXCUSED',
  LATE = 'LATE',
}`
      );
    }
    
    // Write the updated content back to file
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  }
}

console.log('Done fixing model imports!');
