# Sunday School Management System

A comprehensive web application for managing Sunday School operations, including class management, lesson planning, attendance tracking, assignments, and quizzes.

## Tech Stack

- **Frontend**: Next.js 15 (Pages Router), React, TailwindCSS
- **Backend**: Next.js API routes
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: NextAuth.js with role-based authentication (JWT)
- **Migrations**: Sequelize CLI scripts for DB initialization

## Features

- **User Roles & Authentication**:
  - Roles: Student, Teacher, Parent, Admin (Superintendent)
  - Role-based access control via middleware

- **Class Management**:
  - Create/manage classes
  - Assign students and teachers to classes

- **Lesson Plans**:
  - Upload and share lesson plans (PDF, video, or text)
  - View lesson plans by class

- **Attendance Tracking**:
  - Mark attendance for students
  - View attendance history and reports

- **Assignments & Quizzes**:
  - Create and assign homework
  - Create quizzes with auto-grading for MCQs

- **Bible Resources**:
  - Daily Bible verse API
  - Bible reference materials

## Getting Started

### Database Setup

First, set up the PostgreSQL database using Docker Compose:

```bash
# Using the provided setup script
./setup-database.sh

# Or manually with Docker Compose
docker-compose up -d
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

### Environment Setup

Create a `.env.local` file with the following variables:

```
DATABASE_URL=postgresql://user:password@localhost:5431/sundayschool
DB_HOST=localhost
DB_PORT=5431
DB_DATABASE=sundayschool
DB_USERNAME=user
DB_PASSWORD=password
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

### Running the Application

```bash
# Install dependencies
npm install
# or
yarn install

# Start the development server
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to access the application.

## Project Structure

```
sundayschool/
├── components/         # Reusable UI components
├── pages/              # Page components and routes
│   ├── api/            # API routes
│   ├── auth/           # Authentication pages
│   └── dashboard/      # Dashboard pages for different roles
├── models/             # Sequelize ORM models
├── migrations/         # Database migrations
├── seeders/            # Database seed data
├── middleware.ts       # NextAuth middleware for route protection
├── lib/                # Utility functions and helpers
└── public/             # Static assets
```

## Authentication

The application uses NextAuth.js with JWT for authentication. Users are assigned roles (Student, Teacher, Parent, Admin) which determine their access to different parts of the application.

```typescript
// Example of protected API route
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  
  if (!session || session.user.role !== 'ADMIN') {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  // Handle request for authorized users
}
```

## API Routes

The application includes the following API endpoints:

### Authentication
- `POST /api/auth/[...nextauth]` - NextAuth.js authentication endpoints

### Users
- `GET /api/users` - List all users (Admin only)
- `GET /api/users/:id` - Get user details
- `POST /api/users` - Create a new user (Admin only)
- `PUT /api/users/:id` - Update user details
- `DELETE /api/users/:id` - Delete a user (Admin only)

### Classes
- `GET /api/classes` - List all classes
- `GET /api/classes/:id` - Get class details
- `POST /api/classes` - Create a new class (Admin/Teacher only)
- `PUT /api/classes/:id` - Update class details (Admin/Teacher only)
- `DELETE /api/classes/:id` - Delete a class (Admin only)

### Lesson Plans
- `GET /api/lesson-plans` - List all lesson plans
- `GET /api/lesson-plans/:id` - Get lesson plan details
- `POST /api/lesson-plans` - Create a new lesson plan (Teacher only)
- `PUT /api/lesson-plans/:id` - Update lesson plan (Teacher only)
- `DELETE /api/lesson-plans/:id` - Delete a lesson plan (Teacher/Admin only)

### Attendance
- `GET /api/attendance/:classId` - Get attendance for a class
- `POST /api/attendance` - Submit attendance (Teacher only)
- `GET /api/attendance/student/:studentId` - Get attendance history for a student

### Bible Resources
- `GET /api/daily-verse` - Get the daily Bible verse

## Deployment

To deploy this application:

1. Set up a PostgreSQL database
2. Configure environment variables
3. Build the application: `npm run build`
4. Start the application: `npm run start`

For production deployment, it's recommended to use platforms like Vercel or Netlify, which offer seamless integration with Next.js applications.
