#!/bin/bash

# Stop any running containers
echo "Stopping any existing database containers..."
docker-compose down

# Start the database container
echo "Starting database container..."
docker-compose up -d

# Wait for the database to be ready
echo "Waiting for database to be ready..."
sleep 10

# Run migrations
echo "Running database migrations..."
npx sequelize-cli db:migrate

# Seed the database
echo "Seeding the database..."
npx sequelize-cli db:seed:all

echo "Database setup complete!"
echo "You can connect to the database using: postgresql://user:password@localhost:5431/sundayschool"
