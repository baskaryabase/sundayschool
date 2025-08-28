#!/bin/bash

# Set environment variables
export NODE_ENV=development

# Run migrations
echo "Running migrations..."
npx sequelize-cli db:migrate

# Run seeders
echo "Running seeders..."
npx sequelize-cli db:seed:all

echo "Database setup complete!"
