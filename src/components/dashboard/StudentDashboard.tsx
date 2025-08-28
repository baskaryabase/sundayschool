import { Session } from 'next-auth';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface DailyVerse {
  verseText: string;
  reference: string;
}

interface StudentDashboardProps {
  session: Session;
  dailyVerse: DailyVerse | null;
}

// Define types for classes and assignments
interface ClassInfo {
  id: number;
  name: string;
  gradeLevel: string;
  teacherName: string;
}

interface AssignmentInfo {
  id: number;
  title: string;
  dueDate: string;
  className: string;
  completed: boolean;
}

export default function StudentDashboard({ session, dailyVerse }: StudentDashboardProps) {
  const [myClasses, setMyClasses] = useState<ClassInfo[]>([]);
  const [assignments, setAssignments] = useState<AssignmentInfo[]>([]);

  // In a real app, you would fetch the student's classes and assignments
  useEffect(() => {
    // Fetch student's classes
    const fetchClasses = async () => {
      try {
        // This would be implemented in a real app
        // const res = await fetch(`/api/student/classes?userId=${session.user.id}`);
        // if (res.ok) {
        //   const data = await res.json();
        //   setMyClasses(data);
        // }
        
        // Mock data for now
        setMyClasses([
          { id: 1, name: 'Beginners Class', gradeLevel: 'Grade 1-2', teacherName: 'Teacher One' }
        ]);
      } catch (error) {
        console.error('Error fetching classes:', error);
        toast.error('Failed to load your classes');
      }
    };

    // Fetch assignments
    const fetchAssignments = async () => {
      try {
        // This would be implemented in a real app
        // const res = await fetch(`/api/student/assignments?userId=${session.user.id}`);
        // if (res.ok) {
        //   const data = await res.json();
        //   setAssignments(data);
        // }
        
        // Mock data for now
        setAssignments([
          { id: 1, title: 'Bible Heroes Quiz', dueDate: '2025-09-05', className: 'Beginners Class', completed: false },
          { id: 2, title: 'Noah\'s Ark Worksheet', dueDate: '2025-09-03', className: 'Beginners Class', completed: true },
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
        <h1 className="text-3xl font-bold text-gray-800">Student Dashboard</h1>
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
                  <th className="py-2 px-4 border-b text-left">Teacher</th>
                  <th className="py-2 px-4 border-b text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {myClasses.map(cls => (
                  <tr key={cls.id}>
                    <td className="py-2 px-4 border-b">{cls.name}</td>
                    <td className="py-2 px-4 border-b">{cls.gradeLevel}</td>
                    <td className="py-2 px-4 border-b">{cls.teacherName}</td>
                    <td className="py-2 px-4 border-b">
                      <Link href={`/student/classes/${cls.id}`} className="text-indigo-600 hover:text-indigo-800">
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">You are not enrolled in any classes yet.</p>
        )}
      </div>

      {/* Assignments */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-indigo-700 mb-4">My Assignments</h2>
        
        {assignments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-left">Title</th>
                  <th className="py-2 px-4 border-b text-left">Class</th>
                  <th className="py-2 px-4 border-b text-left">Due Date</th>
                  <th className="py-2 px-4 border-b text-left">Status</th>
                  <th className="py-2 px-4 border-b text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map(assignment => (
                  <tr key={assignment.id}>
                    <td className="py-2 px-4 border-b">{assignment.title}</td>
                    <td className="py-2 px-4 border-b">{assignment.className}</td>
                    <td className="py-2 px-4 border-b">{new Date(assignment.dueDate).toLocaleDateString()}</td>
                    <td className="py-2 px-4 border-b">
                      <span className={`px-2 py-1 rounded ${assignment.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {assignment.completed ? 'Completed' : 'Pending'}
                      </span>
                    </td>
                    <td className="py-2 px-4 border-b">
                      <Link href={`/student/assignments/${assignment.id}`} className="text-indigo-600 hover:text-indigo-800">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No assignments yet.</p>
        )}
      </div>
    </div>
  );
}
