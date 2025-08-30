import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../../components/Layout';
import UserList from '../../components/users/UserList';
import { UserRole } from '../../types/UserRole';

export default function UsersPage() {
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
        <title>User Management | Sunday School Management System</title>
      </Head>
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">User Management</h1>
          <UserList />
        </div>
      </Layout>
    </>
  );
}
