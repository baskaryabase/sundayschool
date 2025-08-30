import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../../components/Layout';
import RelationshipForm from '../../components/relationships/RelationshipForm';
import { UserRole } from '../../types/UserRole';

export default function CreateRelationshipPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { userId, childId, parentId } = router.query;
  
  const [initialParentId, setInitialParentId] = useState<number | undefined>(undefined);
  const [initialChildId, setInitialChildId] = useState<number | undefined>(undefined);

  // Set initial values from query params
  useEffect(() => {
    if (parentId && typeof parentId === 'string') {
      setInitialParentId(parseInt(parentId, 10));
    } else if (userId && typeof userId === 'string' && session?.user?.role === UserRole.PARENT) {
      // If the logged in user is a parent and userId is provided, set them as the parent
      setInitialParentId(parseInt(userId, 10));
    }

    if (childId && typeof childId === 'string') {
      setInitialChildId(parseInt(childId, 10));
    }
  }, [userId, childId, parentId, session]);

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/auth/login');
    }
  }, [status, router]);

  // Only allow access to admins and parents
  React.useEffect(() => {
    if (session && session.user.role !== UserRole.ADMIN && session.user.role !== UserRole.PARENT) {
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
  if (!session || (session.user.role !== UserRole.ADMIN && session.user.role !== UserRole.PARENT)) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Create Relationship | Sunday School Management System</title>
      </Head>
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Create Family Relationship</h1>
            <button
              onClick={() => router.push('/relationships')}
              className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Back to Relationships
            </button>
          </div>
          <RelationshipForm 
            initialParentId={initialParentId} 
            initialChildId={initialChildId} 
          />
        </div>
      </Layout>
    </>
  );
}
