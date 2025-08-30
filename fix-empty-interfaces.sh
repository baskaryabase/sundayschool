#!/bin/bash

# Script to fix empty CreationAttributes interfaces in model files

# Models with empty creation attributes interfaces
models=(
  "Assignment"
  "Attendance"
  "BibleVerse"
  "Class"
  "ClassAssignment"
  "LessonMaterial"
  "LessonPlan"
  "ParentChild"
  "Quiz"
  "QuizQuestion"
  "QuizSubmission"
  "User"
)

for model in "${models[@]}"; do
  file_path="src/models/${model}.ts"
  
  echo "Checking $file_path..."
  
  # Check if the file exists
  if [ ! -f "$file_path" ]; then
    echo "  File not found: $file_path"
    continue
  fi
  
  # Check if the file contains an empty CreationAttributes interface
  if grep -q "interface.*CreationAttributes.*extends.*{}" "$file_path"; then
    echo "  Fixing empty CreationAttributes interface in $file_path"
    
    # Get the attributes interface name
    attrs_interface=$(grep -o "[A-Za-z0-9]*Attributes" "$file_path" | head -1)
    
    # Get the creation attributes interface name
    creation_interface=$(grep -o "[A-Za-z0-9]*CreationAttributes" "$file_path" | head -1)
    
    if [ -n "$attrs_interface" ] && [ -n "$creation_interface" ]; then
      # Replace the empty interface with a commented one
      sed -i '' "s/export interface $creation_interface extends Optional<$attrs_interface, .*> {}/export interface $creation_interface extends Optional<$attrs_interface, 'id' | 'createdAt' | 'updatedAt'> {\n  \\/\\/ This interface defines which attributes are required when creating a new instance\n  \\/\\/ The Optional type makes 'id', 'createdAt', and 'updatedAt' optional during creation\n  \\/\\/ No additional fields are needed beyond what's specified in the Optional<> generic\n}/" "$file_path"
      
      echo "  ✅ Fixed interface in $file_path"
    else
      echo "  ❌ Could not find interface names in $file_path"
    fi
  else
    echo "  No empty CreationAttributes interface found in $file_path"
  fi
done

echo "Done fixing empty interfaces."
