#!/bin/bash

# Script to fix require-style imports in remaining migration files

MIGRATIONS_DIR="./src/migrations"
MIGRATION_FILES=(
  "20250828000011-create-parent-child-relationships.ts"
  "20250828000012-add-user-profile-fields.ts"
  "20250828000013-enhance-class-fields.ts"
  "20250828000014-create-class-enrollments.ts"
  "20250828000015-enhance-lesson-plan-fields.ts"
  "20250828000016-create-lesson-materials.ts"
)

echo "🔄 Fixing require-style imports in migration files..."
echo ""

for file in "${MIGRATION_FILES[@]}"; do
  filepath="${MIGRATIONS_DIR}/${file}"
  
  if [ -f "$filepath" ]; then
    echo "Processing $file..."
    
    # Replace require-style exports with ES6 exports
    sed -i '' 's/const { DataTypes } = require("sequelize");/import { DataTypes } from "sequelize";/g' "$filepath"
    sed -i '' 's/module.exports = {/export default {/g' "$filepath"
    
    echo "✓ Fixed $file"
  else
    echo "❌ File not found: $file"
  fi
done

echo ""
echo "✅ Completed fixing require-style imports in migration files."
echo "Run the build-no-checks.sh script to build the project."
