#!/bin/bash

# Script to check and fix Model generic parameters in model files

echo "Checking Model generic parameters in all model files..."

# Find all model files
model_files=$(find src/models/ -name "*.ts" -type f | grep -v "index.ts" | grep -v "init")

for file in $model_files; do
  model_name=$(basename "$file" .ts)
  echo "Checking $file..."
  
  # Check if the file has a class extending Model
  if grep -q "class $model_name extends Model<" "$file"; then
    # Check if the class uses both generic parameters
    if grep -q "class $model_name extends Model<${model_name}Attributes, ${model_name}CreationAttributes>" "$file"; then
      echo "  ✅ Model $model_name already has both generic parameters"
    else
      echo "  ⚠️  Model $model_name may need update to its generic parameters"
      # Get the line with the class definition
      class_line=$(grep "class $model_name extends Model<" "$file")
      echo "      Current: $class_line"
    fi
  else
    echo "  ⚠️  Could not find proper class definition for $model_name"
  fi
done

echo "Done checking Model generic parameters."
