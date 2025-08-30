import { Session } from 'next-auth';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface DailyVerse {
  verseText: string;
  reference: string;
}

interface TeacherDashboardProps {
  session: Session;
  dailyVerse: DailyVerse | null;
}

export default function TeacherDashboard({ session, dailyVerse }: TeacherDashboardProps) {
  const [myClasses, setMyClasses] = useState([]);
  const [upcomingAssignments, setUpcomingAssignments] = useState([]);

  // In a real app, you would fetch the teacher's classes and assignments
  useEffect(() => {
    // Fetch teacher's classes
    const fetchClasses = async () => {
      try {
        // This would be implemented in a real app
        // const res = await fetch(`/api/teacher/classes?userId=${session.user.id}`);
        // if (res.ok) {
        //   const data = await res.json();
        //   setMyClasses(data);
        // }
        
        // Mock data for now
        setMyClasses([
          { id: 1, name: 'Beginners Class', gradeLevel: 'Grade 1-2', studentCount: 12 },
          { id: 2, name: 'Intermediate Class', gradeLevel: 'Grade 3-5', studentCount: 15 },
        ]);
      } catch (error) {
        console.error('Error fetching classes:', error);
        toast.error('Failed to load your classes');
      }
    };

    // Fetch upcoming assignments
    const fetchAssignments = async () => {
      try {
        // This would be implemented in a real app
        // const res = await fetch(`/api/teacher/assignments?userId=${session.user.id}`);
        // if (res.ok) {
        //   const data = await res.json();
        //   setUpcomingAssignments(data);
        // }
        
        // Mock data for now
        setUpcomingAssignments([
          { id: 1, title: 'Bible Heroes Quiz', dueDate: '2025-09-05', className: 'Beginners Class' },
          { id: 2, title: 'Creation Story Essay', dueDate: '2025-09-10', className: 'Intermediate Class' },
        ]);
      } catch (error) {
        console.error('Error fetching assignments:', error);
        toast.error('Failed to load assignments');
      }
    };

    fetchClasses();
    fetchAssignments();
  }, [session]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Teacher Dashboard</h1>
      </div>

      {/* Daily Verse */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-indigo-700 mb-2">Daily Verse</h2>
        {dailyVerse ? (
          <div>
            <p className="text-lg italic">&ldquo;{dailyVerse.verseText}&rdquo;</p>
            <p className="text-sm font-medium text-gray-600 mt-1">- {dailyVerse.reference}</p>
          </div>
        ) : (
          <p>Loading daily verse...</p>
        )}
      </div>

      {/* My Classes */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-indigo-700 mb-4">My Classes</h2>
        
        {myClasses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-left">Class Name</th>
                  <th className="py-2 px-4 border-b text-left">Grade Level</th>
                  <th className="py-2 px-4 border-b text-left">Students</th>
                  <th className="py-2 px-4 border-b text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {myClasses.map((cls: any) => (
                  <tr key={cls.id}>
                    <td className="py-2 px-4 border-b">{cls.name}</td>
                    <td className="py-2 px-4 border-b">{cls.gradeLevel}</td>
                    <td className="py-2 px-4 border-b">{cls.studentCount}</td>
                    <td className="py-2 px-4 border-b">
                      <Link href={`/teacher/classes/${cls.id}`} className="text-indigo-600 hover:text-indigo-800">
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">You are not assigned to any classes yet.</p>
        )}
      </div>

      {/* Upcoming Assignments */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-indigo-700 mb-4">Upcoming Assignments</h2>
        
        {upcomingAssignments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-left">Title</th>
                  <th className="py-2 px-4 border-b text-left">Class</th>
                  <th className="py-2 px-4 border-b text-left">Due Date</th>
                  <th className="py-2 px-4 border-b text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {upcomingAssignments.map((assignment: any) => (
                  <tr key={assignment.id}>
                    <td className="py-2 px-4 border-b">{assignment.title}</td>
                    <td className="py-2 px-4 border-b">{assignment.className}</td>
                    <td className="py-2 px-4 border-b">{new Date(assignment.dueDate).toLocaleDateString()}</td>
                    <td className="py-2 px-4 border-b">
                      <Link href={`/teacher/assignments/${assignment.id}`} className="text-indigo-600 hover:text-indigo-800">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No upcoming assignments.</p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-indigo-700 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link 
            href="/teacher/lessons/create" 
            className="bg-indigo-600 text-white px-4 py-2 rounded text-center hover:bg-indigo-700 transition"
          >
            Create Lesson Plan
          </Link>
          <Link 
            href="/teacher/assignments/create" 
            className="bg-indigo-600 text-white px-4 py-2 rounded text-center hover:bg-indigo-700 transition"
          >
            Create Assignment
          </Link>
          <Link 
            href="/teacher/quizzes/create" 
            className="bg-indigo-600 text-white px-4 py-2 rounded text-center hover:bg-indigo-700 transition"
          >
            Create Quiz
          </Link>
          <Link 
            href="/attendance" 
            className="bg-indigo-600 text-white px-4 py-2 rounded text-center hover:bg-indigo-700 transition"
          >
            Take Attendance
          </Link>
        </div>
      </div>
    </div>
  );
}
