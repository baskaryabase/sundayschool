import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import toast from 'react-hot-toast';
import { UserRole } from '../../models/User';
import Layout from '../../components/Layout';

// Components for different role dashboards
import AdminDashboard from '../../components/dashboard/AdminDashboard';
import TeacherDashboard from '../../components/dashboard/TeacherDashboard';
import StudentDashboard from '../../components/dashboard/StudentDashboard';
import ParentDashboard from '../../components/dashboard/ParentDashboard';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [dailyVerse, setDailyVerse] = useState<{ verseText: string; reference: string } | null>(null);
  
  useEffect(() => {
    // If not authenticated, redirect to login
    if (status === 'unauthenticated') {
      router.replace('/auth/login');
    }
  }, [status, router]);

  useEffect(() => {
    // Fetch daily verse
    const fetchDailyVerse = async () => {
      try {
        const res = await fetch('/api/daily-verse');
        if (res.ok) {
          const data = await res.json();
          setDailyVerse(data);
        }
      } catch (error) {
        console.error('Error fetching daily verse:', error);
        toast.error('Could not load daily verse');
      }
    };

    fetchDailyVerse();
  }, []);

  // Show loading state while session is being fetched
  if (status === 'loading') {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </Layout>
    );
  }

  // If no session, don't render anything (will be redirected by useEffect)
  if (!session) {
    return null;
  }

  // Render appropriate dashboard based on user role
  const renderDashboard = () => {
    switch (session.user.role) {
      case UserRole.ADMIN:
        return <AdminDashboard session={session} dailyVerse={dailyVerse} />;
      case UserRole.TEACHER:
        return <TeacherDashboard session={session} dailyVerse={dailyVerse} />;
      case UserRole.STUDENT:
        return <StudentDashboard session={session} dailyVerse={dailyVerse} />;
      case UserRole.PARENT:
        return <ParentDashboard session={session} dailyVerse={dailyVerse} />;
      default:
        return (
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold text-red-600">Invalid User Role</h1>
            <p>Please contact the administrator.</p>
          </div>
        );
    }
  };

  return (
    <>
      <Head>
        <title>Dashboard | Sunday School Management System</title>
      </Head>
      <Layout>
        <div className="container mx-auto px-4 py-8">
          {renderDashboard()}
        </div>
      </Layout>
    </>
  );
}
