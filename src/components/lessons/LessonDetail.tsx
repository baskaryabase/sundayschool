import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

interface LessonDetailProps {
  lessonId: number | string;
}

interface LessonInfo {
  id: number;
  title: string;
  description: string;
  scripture: string;
  objectives: string;
  materials: string;
  content: string;
  activities: string;
  classId: number;
  className: string;
  teacherId: number;
  teacherName: string;
  scheduledDate: string;
  duration: number;
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export default function LessonDetail({ lessonId }: LessonDetailProps) {
  const router = useRouter();
  const [lesson, setLesson] = useState<LessonInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLessonDetails = async () => {
      try {
        const response = await fetch(`/api/lessons/${lessonId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch lesson details');
        }
        const data = await response.json();
        setLesson(data);
      } catch (error) {
        console.error('Error fetching lesson details:', error);
        toast.error('Failed to load lesson details');
      } finally {
        setLoading(false);
      }
    };

    if (lessonId) {
      fetchLessonDetails();
    }
  }, [lessonId]);

  if (loading) {
    return <div className="text-center py-10">Loading lesson details...</div>;
  }

  if (!lesson) {
    return <div className="text-center py-10 text-red-500">Lesson not found</div>;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{lesson.title}</h1>
          <p className="text-gray-600">
            {formatDate(lesson.scheduledDate)} • {lesson.duration} minutes
          </p>
        </div>
        <div className="flex space-x-3">
          <Link
            href={`/lessons/${lessonId}/edit`}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
          >
            Edit Lesson
          </Link>
          <Link
            href={`/lessons/${lessonId}/resources`}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Add Resources
          </Link>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6 space-y-6">
          {/* Header Info */}
          <div className="flex flex-wrap justify-between items-start pb-4 border-b">
            <div className="space-y-1 mb-4 md:mb-0">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-500">Class:</span>
                <Link href={`/classes/${lesson.classId}`} className="text-indigo-600 hover:underline">
                  {lesson.className}
                </Link>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-500">Teacher:</span>
                <Link href={`/users/${lesson.teacherId}`} className="text-indigo-600 hover:underline">
                  {lesson.teacherName}
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-500">Status:</span>
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusBadgeClass(
                  lesson.status
                )}`}
              >
                {lesson.status}
              </span>
            </div>
          </div>

          {/* Scripture Reference */}
          <div>
            <h2 className="text-lg font-semibold text-indigo-700 mb-2">Scripture Reference</h2>
            <p className="text-gray-800">{lesson.scripture}</p>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-lg font-semibold text-indigo-700 mb-2">Description</h2>
            <p className="text-gray-800">{lesson.description}</p>
          </div>

          {/* Learning Objectives */}
          <div>
            <h2 className="text-lg font-semibold text-indigo-700 mb-2">Learning Objectives</h2>
            <p className="text-gray-800 whitespace-pre-wrap">{lesson.objectives}</p>
          </div>

          {/* Materials */}
          {lesson.materials && (
            <div>
              <h2 className="text-lg font-semibold text-indigo-700 mb-2">Materials Needed</h2>
              <p className="text-gray-800 whitespace-pre-wrap">{lesson.materials}</p>
            </div>
          )}

          {/* Lesson Content */}
          <div>
            <h2 className="text-lg font-semibold text-indigo-700 mb-2">Lesson Content</h2>
            <div className="text-gray-800 whitespace-pre-wrap prose max-w-none">
              {lesson.content}
            </div>
          </div>

          {/* Activities */}
          {lesson.activities && (
            <div>
              <h2 className="text-lg font-semibold text-indigo-700 mb-2">Activities</h2>
              <p className="text-gray-800 whitespace-pre-wrap">{lesson.activities}</p>
            </div>
          )}

          {/* Last Updated Info */}
          <div className="pt-4 border-t text-xs text-gray-500">
            <p>Created: {new Date(lesson.createdAt).toLocaleString()}</p>
            <p>Last updated: {new Date(lesson.updatedAt).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
