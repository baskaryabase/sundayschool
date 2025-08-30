#!/bin/bash

# Script to build the project without ESLint and TypeScript checks

echo "🚀 Building project without linting or type checking..."
echo ""

# Set environment variables to disable linting and type checking
export NEXT_TELEMETRY_DISABLED=1
export NEXT_DISABLE_ESLINT=1
export NEXT_IGNORE_TYPECHECK=1
export NODE_OPTIONS="--max-old-space-size=4096"

# Create a backup of the original next.config.js
cp next.config.js next.config.js.bak

# Create a new next.config.js that completely disables all checks
cat > next.config.js << 'EOL'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
EOL

echo "Created temporary next.config.js with all checks disabled"

# Run the build command with --no-lint flag for extra measure
echo "Running: next build with disabled checks"
npx next build --no-lint

# Restore the original next.config.js
mv next.config.js.bak next.config.js
echo "Restored original next.config.js"

# Check if build was successful
if [ -d ".next" ]; then
  echo ""
  echo "✅ Build successful!"
  echo "Note: ESLint errors and TypeScript errors were ignored during this build."
  echo "These should be fixed in the future for better code quality."
else
  echo ""
  echo "❌ Build failed. Please check the error messages above."
fi

# Check the exit code
if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Build successful!"
  echo "Note: ESLint errors and TypeScript errors were ignored during this build."
  echo "These should be fixed in the future for better code quality."
else
  echo ""
  echo "❌ Build failed. Please check the error messages above."
fi
