import { Session } from 'next-auth';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface DailyVerse {
  verseText: string;
  reference: string;
}

interface ParentDashboardProps {
  session: Session;
  dailyVerse: DailyVerse | null;
}

// Define types for children and attendance
interface ChildInfo {
  id: number;
  name: string;
  className: string;
  gradeLevel: string;
}

interface AttendanceRecord {
  id: number;
  childName: string;
  date: string;
  status: string;
  className: string;
}

export default function ParentDashboard({ session, dailyVerse }: ParentDashboardProps) {
  const [children, setChildren] = useState<ChildInfo[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);

  // In a real app, you would fetch the parent's children and attendance records
  useEffect(() => {
    // Fetch parent's children
    const fetchChildren = async () => {
      try {
        // This would be implemented in a real app
        // const res = await fetch(`/api/parent/children?userId=${session.user.id}`);
        // if (res.ok) {
        //   const data = await res.json();
        //   setChildren(data);
        // }
        
        // Mock data for now
        setChildren([
          { id: 1, name: 'John Doe', className: 'Beginners Class', gradeLevel: 'Grade 1-2' },
          { id: 2, name: 'Jane Doe', className: 'Youth Class', gradeLevel: 'Grade 6-8' },
        ]);
      } catch (error) {
        console.error('Error fetching children:', error);
        toast.error('Failed to load your children\'s information');
      }
    };

    // Fetch attendance records
    const fetchAttendance = async () => {
      try {
        // This would be implemented in a real app
        // const res = await fetch(`/api/parent/attendance?userId=${session.user.id}`);
        // if (res.ok) {
        //   const data = await res.json();
        //   setAttendance(data);
        // }
        
        // Mock data for now
        setAttendance([
          { id: 1, childName: 'John Doe', date: '2025-08-25', status: 'PRESENT', className: 'Beginners Class' },
          { id: 2, childName: 'Jane Doe', date: '2025-08-25', status: 'ABSENT', className: 'Youth Class' },
          { id: 3, childName: 'John Doe', date: '2025-08-18', status: 'PRESENT', className: 'Beginners Class' },
          { id: 4, childName: 'Jane Doe', date: '2025-08-18', status: 'PRESENT', className: 'Youth Class' },
        ]);
      } catch (error) {
        console.error('Error fetching attendance:', error);
        toast.error('Failed to load attendance records');
      }
    };

    fetchChildren();
    fetchAttendance();
  }, [session]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Parent Dashboard</h1>
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

      {/* My Children */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-indigo-700 mb-4">My Children</h2>
        
        {children.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-left">Name</th>
                  <th className="py-2 px-4 border-b text-left">Class</th>
                  <th className="py-2 px-4 border-b text-left">Grade Level</th>
                  <th className="py-2 px-4 border-b text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {children.map(child => (
                  <tr key={child.id}>
                    <td className="py-2 px-4 border-b">{child.name}</td>
                    <td className="py-2 px-4 border-b">{child.className}</td>
                    <td className="py-2 px-4 border-b">{child.gradeLevel}</td>
                    <td className="py-2 px-4 border-b">
                      <Link href={`/parent/children/${child.id}`} className="text-indigo-600 hover:text-indigo-800">
                        View Profile
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No children registered in your account.</p>
        )}
      </div>

      {/* Recent Attendance */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-indigo-700 mb-4">Recent Attendance</h2>
        
        {attendance.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-left">Child</th>
                  <th className="py-2 px-4 border-b text-left">Class</th>
                  <th className="py-2 px-4 border-b text-left">Date</th>
                  <th className="py-2 px-4 border-b text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map(record => (
                  <tr key={record.id}>
                    <td className="py-2 px-4 border-b">{record.childName}</td>
                    <td className="py-2 px-4 border-b">{record.className}</td>
                    <td className="py-2 px-4 border-b">{new Date(record.date).toLocaleDateString()}</td>
                    <td className="py-2 px-4 border-b">
                      <span className={`px-2 py-1 rounded ${record.status === 'PRESENT' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No attendance records yet.</p>
        )}
        
        <div className="mt-4">
          <Link 
            href="/parent/attendance" 
            className="text-indigo-600 hover:text-indigo-800"
          >
            View Full Attendance History
          </Link>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-indigo-700 mb-4">Quick Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link 
            href="/parent/assignments" 
            className="bg-indigo-600 text-white px-4 py-2 rounded text-center hover:bg-indigo-700 transition"
          >
            View Assignments
          </Link>
          <Link 
            href="/parent/lessons" 
            className="bg-indigo-600 text-white px-4 py-2 rounded text-center hover:bg-indigo-700 transition"
          >
            Browse Lesson Plans
          </Link>
          <Link 
            href="/parent/profile" 
            className="bg-indigo-600 text-white px-4 py-2 rounded text-center hover:bg-indigo-700 transition"
          >
            Update Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
