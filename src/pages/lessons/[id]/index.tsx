import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import LessonDetail from '@/components/lessons/LessonDetail';

export default function LessonDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  if (!id || Array.isArray(id)) {
    return (
      <Layout>
        <div className="text-center py-10 text-red-500">Invalid lesson ID</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <LessonDetail lessonId={id} />
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
