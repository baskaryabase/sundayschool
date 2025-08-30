import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../../components/Layout';
import UserForm from '../../components/users/UserForm';
import { UserRole } from '../../types/UserRole';

export default function CreateUserPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

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

  return (
    <>
      <Head>
        <title>Create User | Sunday School Management System</title>
      </Head>
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Create New User</h1>
            <button
              onClick={() => router.push('/users')}
              className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Back to Users
            </button>
          </div>
          <UserForm mode="create" />
        </div>
      </Layout>
    </>
  );
}
