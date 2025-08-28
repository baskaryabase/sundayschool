import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [dailyVerse, setDailyVerse] = useState<{ verseText: string; reference: string } | null>(null);

  useEffect(() => {
    // Redirect to dashboard if already authenticated
    if (status === 'authenticated') {
      router.push('/dashboard');
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
      }
    };

    fetchDailyVerse();
  }, []);

  return (
    <>
      <Head>
        <title>Sunday School Management System</title>
        <meta name="description" content="A comprehensive Sunday School Management System" />
      </Head>
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
        {/* Hero Section */}
        <header className="bg-indigo-600 text-white">
          <div className="container mx-auto px-4 py-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Sunday School Management</h1>
            <div>
              <Link
                href="/auth/login"
                className="bg-white text-indigo-600 px-4 py-2 rounded font-medium hover:bg-gray-100 transition"
              >
                Sign In
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Sunday School Management System</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A comprehensive platform for managing classes, lessons, attendance, and more for your Sunday School.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-indigo-600 text-4xl mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Class Management</h3>
              <p className="text-gray-600">
                Easily organize and manage your Sunday School classes, assign teachers and students.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-indigo-600 text-4xl mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Lesson Planning</h3>
              <p className="text-gray-600">
                Create and share lesson plans, including resources, materials, and learning objectives.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="text-indigo-600 text-4xl mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Attendance Tracking</h3>
              <p className="text-gray-600">
                Track student attendance and generate reports for parents and administrators.
              </p>
            </div>
          </div>

          {/* Daily Verse */}
          <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto text-center">
            <h3 className="text-xl font-semibold text-indigo-700 mb-4">Daily Bible Verse</h3>
            {dailyVerse ? (
              <div>
                <p className="text-xl italic mb-2">&ldquo;{dailyVerse.verseText}&rdquo;</p>
                <p className="text-gray-600">- {dailyVerse.reference}</p>
              </div>
            ) : (
              <p>Loading daily verse...</p>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-8 mt-12">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <p>&copy; {new Date().getFullYear()} Sunday School Management System. All rights reserved.</p>
              <p className="mt-2 text-gray-300">Powered by Next.js, PostgreSQL, and Sequelize</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
