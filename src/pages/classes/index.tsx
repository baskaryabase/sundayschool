import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import Layout from '@/components/Layout';
import ClassList from '@/components/classes/ClassList';

export default function ClassesPage() {
  return (
    <Layout>
      <ClassList />
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

  return {
    props: { session },
  };
};
