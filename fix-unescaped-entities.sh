#!/bin/bash

# Script to fix unescaped entities in AdminDashboard.tsx

FILE_PATH="./src/components/dashboard/AdminDashboard.tsx"

echo "🔄 Fixing unescaped entities in AdminDashboard.tsx..."

if [ -f "$FILE_PATH" ]; then
  # Make a backup
  cp "$FILE_PATH" "${FILE_PATH}.bak"
  
  # Replace unescaped quote characters with &quot;
  sed -i '' 's/View upcoming events and "Next classes"/View upcoming events and \&quot;Next classes\&quot;/g' "$FILE_PATH"
  
  echo "✅ Fixed unescaped entities in AdminDashboard.tsx"
else
  echo "❌ File not found: $FILE_PATH"
fi
