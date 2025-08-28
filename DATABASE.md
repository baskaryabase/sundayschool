# Sunday School Management System Database Guide

## Database Setup

This project uses PostgreSQL 14 running in Docker. The database configuration is defined in the `docker-compose.yaml` file.

### Connection Details

- **Database Name**: sundayschool
- **Username**: postgres
- **Password**: postgres
- **Host**: localhost
- **Port**: 5431

## 1. Start the Docker Container

Make sure your Docker container is running with:

```bash
docker-compose up -d
```

## 2. Verify Database Connection

Check if the database is accessible:

```bash
docker exec -it sundayschool_db psql -U postgres -d sundayschool -c "SELECT 1 as test;"
```

If this command succeeds, your database connection is working!

## 3. Configuration Changes Made

The following configuration changes were made to fix the connection:

1. Updated `docker-compose.yaml`:
   - Changed image to postgres:14
   - Set POSTGRES_USER and POSTGRES_PASSWORD to "postgres"
   - Port mapping: 5431:5432

2. Updated `config/config.js`:
   - Hard-coded credentials for development environment
   - Set port explicitly to 5431

3. Updated `src/lib/db.ts`:
   - Added port configuration to Sequelize connection
   - Updated interface to include port

## 4. Running Migrations

To run migrations:

```bash
npx sequelize-cli db:migrate --migrations-path ./src/migrations
```

### Migration File Format

Each migration file needs to use ES module export format:

```typescript
const migration = {
  up: async (queryInterface, Sequelize) => {
    // migration code
  },
  down: async (queryInterface, Sequelize) => {
    // rollback code
  }
};

export default migration;
```

### Common Migration Issues and Solutions

#### 1. ES Module Export Issues

Migration files need to use ES module exports instead of CommonJS:

```javascript
// CORRECT: ES Module syntax
const migration = {
  up: async (queryInterface, Sequelize) => {
    // migration code
  },
  down: async (queryInterface, Sequelize) => {
    // rollback code
  }
};

export default migration;

// INCORRECT: CommonJS syntax
module.exports = {
  up: async (queryInterface, Sequelize) => {},
  down: async (queryInterface, Sequelize) => {}
};
```

#### 2. TypeScript Enum Issues

When using TypeScript enums in migrations, they need to be replaced with string literals:

```javascript
// CORRECT: Using string literals
await queryInterface.createTable('Attendances', {
  status: {
    type: Sequelize.ENUM('PRESENT', 'ABSENT', 'EXCUSED', 'LATE'),
    allowNull: false,
  },
});

// INCORRECT: Using TypeScript enum
import { AttendanceStatus } from '../models/Attendance';
await queryInterface.createTable('Attendances', {
  status: {
    type: Sequelize.ENUM(Object.values(AttendanceStatus)),
    allowNull: false,
  },
});
```

## 5. Utility Scripts

The project includes utility scripts to help with migration issues:

- `scripts/update-migrations.js`: Converts CommonJS exports to ES module exports
- `scripts/fix-model-imports.js`: Fixes model imports in migration files

Run these scripts if you encounter module export or import issues:

```bash
node scripts/update-migrations.js
node scripts/fix-model-imports.js
```

## 6. Database Schema

The Sunday School Management System database includes the following tables:

1. `Users` - Store information about teachers, students and administrators
2. `Classes` - Different Sunday school classes
3. `ClassAssignments` - Assignments of students and teachers to classes
4. `Attendances` - Track student attendance
5. `LessonPlans` - Store lesson content and metadata
6. `Assignments` - Track homework and assignments for students
7. `Quizzes` - Store quiz metadata
8. `QuizQuestions` - Store individual quiz questions
9. `QuizSubmissions` - Track student quiz submissions
10. `BibleVerses` - Store Bible verses for memorization

To see all tables, run:
```bash
docker exec -it sundayschool_db psql -U postgres -d sundayschool -c "\dt"
```

## 7. Troubleshooting

If you encounter issues, try:

1. Removing all Docker containers and volumes:
   ```bash
   docker-compose down -v
   ```

2. Rebuilding the containers:
   ```bash
   docker-compose up -d
   ```

3. Checking container logs:
   ```bash
   docker logs sundayschool_db
   ```

4. Check if all migration files use the correct ES module export format.

5. Verify that any TypeScript enums have been replaced with string literals in migration files.

6. Make sure all model imports use the correct paths.