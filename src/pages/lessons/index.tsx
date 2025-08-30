import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import Layout from '@/components/Layout';
import LessonList from '@/components/lessons/LessonList';

export default function LessonsPage() {
  return (
    <Layout>
      <LessonList />
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
