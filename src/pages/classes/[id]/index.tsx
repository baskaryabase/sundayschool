import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import ClassDetail from '@/components/classes/ClassDetail';
import toast from 'react-hot-toast';

export default function ClassDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [isLoading, setIsLoading] = useState(true);

  if (!id || Array.isArray(id)) {
    return (
      <Layout>
        <div className="text-center py-10 text-red-500">Invalid class ID</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <ClassDetail classId={id} />
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
