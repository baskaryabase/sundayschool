import { useState, useEffect } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface LessonInfo {
  id: number;
  title: string;
  className: string;
  teacherName: string;
  scheduledDate: string;
  status: 'draft' | 'published' | 'archived';
}

export default function LessonList() {
  const [lessons, setLessons] = useState<LessonInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'draft', 'published', 'archived'

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await fetch('/api/lessons');
        if (!response.ok) {
          throw new Error('Failed to fetch lessons');
        }
        const data = await response.json();
        setLessons(data);
      } catch (error) {
        console.error('Error fetching lessons:', error);
        toast.error('Failed to load lessons');
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, []);

  const handleStatusChange = async (id: number, newStatus: 'draft' | 'published' | 'archived') => {
    try {
      const response = await fetch(`/api/lessons/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update lesson status');
      }

      setLessons((prevLessons) =>
        prevLessons.map((lesson) =>
          lesson.id === id ? { ...lesson, status: newStatus } : lesson
        )
      );

      toast.success('Lesson status updated successfully');
    } catch (error) {
      console.error('Error updating lesson status:', error);
      toast.error('Failed to update lesson status');
    }
  };

  const filteredLessons = lessons.filter((lesson) => {
    if (filter === 'all') return true;
    return lesson.status === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Lesson Plans</h1>
          <p className="text-gray-600">Manage and create lesson plans for Sunday School classes</p>
        </div>
        <Link
          href="/lessons/create"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
        >
          Create New Lesson Plan
        </Link>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded ${
                filter === 'all'
                  ? 'bg-indigo-100 text-indigo-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All Lessons
            </button>
            <button
              onClick={() => setFilter('published')}
              className={`px-3 py-1 rounded ${
                filter === 'published'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Published
            </button>
            <button
              onClick={() => setFilter('draft')}
              className={`px-3 py-1 rounded ${
                filter === 'draft'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Drafts
            </button>
            <button
              onClick={() => setFilter('archived')}
              className={`px-3 py-1 rounded ${
                filter === 'archived'
                  ? 'bg-gray-100 text-gray-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Archived
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-center py-4">Loading lesson plans...</p>
        ) : filteredLessons.length === 0 ? (
          <p className="text-center py-4 text-gray-500">No lesson plans found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Class
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Teacher
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLessons.map((lesson) => (
                  <tr key={lesson.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        <Link href={`/lessons/${lesson.id}`} className="hover:text-indigo-600">
                          {lesson.title}
                        </Link>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{lesson.className}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{lesson.teacherName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(lesson.scheduledDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${
                          lesson.status === 'published'
                            ? 'bg-green-100 text-green-800'
                            : lesson.status === 'draft'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {lesson.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <Link href={`/lessons/${lesson.id}`} className="text-indigo-600 hover:text-indigo-900">
                        View
                      </Link>
                      <Link href={`/lessons/${lesson.id}/edit`} className="text-indigo-600 hover:text-indigo-900">
                        Edit
                      </Link>
                      {lesson.status === 'draft' && (
                        <button
                          onClick={() => handleStatusChange(lesson.id, 'published')}
                          className="text-green-600 hover:text-green-900"
                        >
                          Publish
                        </button>
                      )}
                      {lesson.status === 'published' && (
                        <button
                          onClick={() => handleStatusChange(lesson.id, 'archived')}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          Archive
                        </button>
                      )}
                      {lesson.status === 'archived' && (
                        <button
                          onClick={() => handleStatusChange(lesson.id, 'published')}
                          className="text-green-600 hover:text-green-900"
                        >
                          Restore
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
