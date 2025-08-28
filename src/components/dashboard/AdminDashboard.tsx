import { Session } from 'next-auth';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface DailyVerse {
  verseText: string;
  reference: string;
}

interface AdminDashboardProps {
  session: Session;
  dailyVerse: DailyVerse | null;
}

export default function AdminDashboard({ session, dailyVerse }: AdminDashboardProps) {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalClasses: 0,
    totalLessons: 0,
  });

  // Fetch dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // In a real app, you would implement these API endpoints
        const usersRes = await fetch('/api/users');
        const classesRes = await fetch('/api/classes');
        
        if (usersRes.ok && classesRes.ok) {
          const users = await usersRes.json();
          const classes = await classesRes.json();
          
          setStats({
            totalUsers: users.length,
            totalClasses: classes.length,
            totalLessons: 0, // This would come from a lessons API endpoint
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
        toast.error('Failed to load dashboard data');
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Administrator Dashboard</h1>
      </div>

      {/* Daily Verse */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-indigo-700 mb-2">Daily Verse</h2>
        {dailyVerse ? (
          <div>
            <p className="text-lg italic">"{dailyVerse.verseText}"</p>
            <p className="text-sm font-medium text-gray-600 mt-1">- {dailyVerse.reference}</p>
          </div>
        ) : (
          <p>Loading daily verse...</p>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-indigo-700">Total Users</h2>
          <p className="text-3xl font-bold">{stats.totalUsers}</p>
          <Link href="/admin/users" className="text-indigo-600 hover:text-indigo-800 text-sm inline-block mt-2">
            Manage Users &rarr;
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-indigo-700">Classes</h2>
          <p className="text-3xl font-bold">{stats.totalClasses}</p>
          <Link href="/admin/classes" className="text-indigo-600 hover:text-indigo-800 text-sm inline-block mt-2">
            Manage Classes &rarr;
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-indigo-700">Lesson Plans</h2>
          <p className="text-3xl font-bold">{stats.totalLessons}</p>
          <Link href="/admin/lessons" className="text-indigo-600 hover:text-indigo-800 text-sm inline-block mt-2">
            Manage Lessons &rarr;
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-indigo-700 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link 
            href="/admin/users/create" 
            className="bg-indigo-600 text-white px-4 py-2 rounded text-center hover:bg-indigo-700 transition"
          >
            Add User
          </Link>
          <Link 
            href="/admin/classes/create" 
            className="bg-indigo-600 text-white px-4 py-2 rounded text-center hover:bg-indigo-700 transition"
          >
            Create Class
          </Link>
          <Link 
            href="/admin/assignments" 
            className="bg-indigo-600 text-white px-4 py-2 rounded text-center hover:bg-indigo-700 transition"
          >
            View Assignments
          </Link>
          <Link 
            href="/admin/attendance" 
            className="bg-indigo-600 text-white px-4 py-2 rounded text-center hover:bg-indigo-700 transition"
          >
            Attendance Reports
          </Link>
        </div>
      </div>
    </div>
  );
}
