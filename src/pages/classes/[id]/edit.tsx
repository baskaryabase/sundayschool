import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import ClassForm from '@/components/classes/ClassForm';
import toast from 'react-hot-toast';

interface ClassData {
  id: number;
  name: string;
  gradeLevel: string;
  description: string;
  academicYear: string;
  semester: string;
  maxCapacity: number;
  scheduleDay: string;
  scheduleTime: string;
  location: string;
}

export default function EditClassPage() {
  const router = useRouter();
  const { id } = router.query;
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchClassData = async () => {
      try {
        const response = await fetch(`/api/classes/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch class data');
        }
        const data = await response.json();
        setClassData(data);
      } catch (error) {
        console.error('Error fetching class data:', error);
        toast.error('Failed to load class data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchClassData();
  }, [id]);

  if (!id || Array.isArray(id)) {
    return (
      <Layout>
        <div className="text-center py-10 text-red-500">Invalid class ID</div>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="text-center py-10">Loading class data...</div>
      </Layout>
    );
  }

  if (!classData) {
    return (
      <Layout>
        <div className="text-center py-10 text-red-500">Class not found</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Edit Class</h1>
          <p className="text-gray-600">Update class details for {classData.name}</p>
        </div>
        <ClassForm mode="edit" initialData={classData} />
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

  // Only admins can edit classes
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
