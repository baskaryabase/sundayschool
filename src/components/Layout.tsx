import { ReactNode } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { data: session } = useSession();

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: '/auth/login' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-indigo-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">
            Sunday School Management
          </Link>
          
          {session && (
            <div className="flex items-center space-x-4">
              <span className="text-sm">
                Welcome, {session.user?.name}
              </span>
              <button
                onClick={handleSignOut}
                className="bg-white text-indigo-600 px-3 py-1 rounded text-sm hover:bg-gray-100 transition"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Sunday School Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
