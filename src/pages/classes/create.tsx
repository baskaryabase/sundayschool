import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import Layout from '@/components/Layout';
import ClassForm from '@/components/classes/ClassForm';

export default function CreateClassPage() {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Create New Class</h1>
          <p className="text-gray-600">Set up a new Sunday School class</p>
        </div>
        <ClassForm mode="create" />
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }

  // Only admins can create classes
  if (session.user.role !== 'ADMIN') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};
