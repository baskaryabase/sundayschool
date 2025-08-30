import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../../../components/Layout';
import UserForm from '../../../components/users/UserForm';
import { UserRole } from '../../../types/UserRole';

export default function EditUserPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = router.query;
  const userId = typeof id === 'string' ? parseInt(id, 10) : undefined;

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/auth/login');
    }
  }, [status, router]);

  // Redirect if not admin
  React.useEffect(() => {
    if (session && session.user.role !== UserRole.ADMIN) {
      router.replace('/dashboard');
    }
  }, [session, router]);

  // Show loading state
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
  if (!session || session.user.role !== UserRole.ADMIN) {
    return null;
  }

  // Check if we have a valid userId
  if (!userId || isNaN(userId)) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            Invalid user ID
          </div>
          <button
            onClick={() => router.push('/users')}
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Back to Users
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Head>
        <title>Edit User | Sunday School Management System</title>
      </Head>
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Edit User</h1>
            <button
              onClick={() => router.push('/users')}
              className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Back to Users
            </button>
          </div>
          <UserForm mode="edit" userId={userId} />
        </div>
      </Layout>
    </>
  );
}
