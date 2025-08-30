import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import LessonForm from '@/components/lessons/LessonForm';

export default function CreateLessonPage() {
  const router = useRouter();
  const { classId } = router.query;

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Create New Lesson Plan</h1>
          <p className="text-gray-600">Develop a lesson plan for your Sunday School class</p>
        </div>
        <LessonForm 
          mode="create" 
          classId={classId && !Array.isArray(classId) ? classId : undefined} 
        />
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

  // Only teachers and admins can create lesson plans
  if (session.user.role !== 'TEACHER' && session.user.role !== 'ADMIN') {
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
