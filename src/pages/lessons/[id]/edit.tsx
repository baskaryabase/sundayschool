import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import LessonForm from '@/components/lessons/LessonForm';
import toast from 'react-hot-toast';

interface LessonData {
  id: number;
  title: string;
  description: string;
  scripture: string;
  objectives: string;
  materials: string;
  content: string;
  activities: string;
  classId: number;
  teacherId: number;
  scheduledDate: string;
  duration: number;
  status: 'draft' | 'published' | 'archived';
}

export default function EditLessonPage() {
  const router = useRouter();
  const { id } = router.query;
  const [lessonData, setLessonData] = useState<LessonData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchLessonData = async () => {
      try {
        const response = await fetch(`/api/lessons/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch lesson data');
        }
        const data = await response.json();
        setLessonData(data);
      } catch (error) {
        console.error('Error fetching lesson data:', error);
        toast.error('Failed to load lesson data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLessonData();
  }, [id]);

  if (!id || Array.isArray(id)) {
    return (
      <Layout>
        <div className="text-center py-10 text-red-500">Invalid lesson ID</div>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="text-center py-10">Loading lesson data...</div>
      </Layout>
    );
  }

  if (!lessonData) {
    return (
      <Layout>
        <div className="text-center py-10 text-red-500">Lesson not found</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Edit Lesson Plan</h1>
          <p className="text-gray-600">Update lesson plan for {lessonData.title}</p>
        </div>
        <LessonForm mode="edit" initialData={lessonData} />
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

  // Only teachers and admins can edit lesson plans
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
