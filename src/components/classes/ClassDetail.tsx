import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

interface ClassDetailProps {
  classId: number | string;
}

interface ClassInfo {
  id: number;
  name: string;
  gradeLevel: string;
  description: string;
  academicYear: string;
  semester: string;
  maxCapacity: number;
  currentEnrollment: number;
  scheduleDay: string;
  scheduleTime: string;
  location: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface EnrolledStudent {
  id: number;
  name: string;
  email: string;
}

interface ClassTeacher {
  id: number;
  name: string;
  email: string;
}

export default function ClassDetail({ classId }: ClassDetailProps) {
  const router = useRouter();
  const [classInfo, setClassInfo] = useState<ClassInfo | null>(null);
  const [students, setStudents] = useState<EnrolledStudent[]>([]);
  const [teachers, setTeachers] = useState<ClassTeacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'details' | 'students' | 'teachers' | 'lessons'>('details');

  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        // Fetch class info
        const classResponse = await fetch(`/api/classes/${classId}`);
        if (!classResponse.ok) {
          throw new Error('Failed to fetch class details');
        }
        const classData = await classResponse.json();
        setClassInfo(classData);

        // Fetch enrolled students
        const studentsResponse = await fetch(`/api/classes/${classId}/students`);
        if (studentsResponse.ok) {
          const studentsData = await studentsResponse.json();
          setStudents(studentsData);
        }

        // Fetch assigned teachers
        const teachersResponse = await fetch(`/api/classes/${classId}/teachers`);
        if (teachersResponse.ok) {
          const teachersData = await teachersResponse.json();
          setTeachers(teachersData);
        }
      } catch (error) {
        console.error('Error fetching class details:', error);
        toast.error('Failed to load class details');
      } finally {
        setLoading(false);
      }
    };

    if (classId) {
      fetchClassDetails();
    }
  }, [classId]);

  if (loading) {
    return <div className="text-center py-10">Loading class details...</div>;
  }

  if (!classInfo) {
    return <div className="text-center py-10 text-red-500">Class not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{classInfo.name}</h1>
          <p className="text-gray-600">{classInfo.gradeLevel} • {classInfo.academicYear}</p>
        </div>
        <div className="flex space-x-3">
          <Link
            href={`/classes/${classId}/edit`}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
          >
            Edit Class
          </Link>
          <Link
            href={`/attendance/class/${classId}`}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Attendance
          </Link>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('details')}
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'details'
                ? 'border-b-2 border-indigo-500 text-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Class Details
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'students'
                ? 'border-b-2 border-indigo-500 text-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Students ({students.length})
          </button>
          <button
            onClick={() => setActiveTab('teachers')}
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'teachers'
                ? 'border-b-2 border-indigo-500 text-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Teachers ({teachers.length})
          </button>
          <button
            onClick={() => setActiveTab('lessons')}
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'lessons'
                ? 'border-b-2 border-indigo-500 text-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Lesson Plans
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'details' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Class Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Grade Level</p>
                    <p>{classInfo.gradeLevel}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Academic Year</p>
                    <p>{classInfo.academicYear}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Semester</p>
                    <p>{classInfo.semester || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        classInfo.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {classInfo.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Schedule & Capacity</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Schedule</p>
                    <p>
                      {classInfo.scheduleDay}s at{' '}
                      {new Date(`2022-01-01T${classInfo.scheduleTime}`).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p>{classInfo.location || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Enrollment</p>
                    <p>
                      {classInfo.currentEnrollment} / {classInfo.maxCapacity} students
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                      <div
                        className="bg-indigo-600 h-2.5 rounded-full"
                        style={{
                          width: `${Math.min(
                            100,
                            (classInfo.currentEnrollment / classInfo.maxCapacity) * 100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {classInfo.description || 'No description provided.'}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'students' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Enrolled Students</h3>
                <Link
                  href={`/classes/${classId}/enroll`}
                  className="bg-indigo-600 text-white px-3 py-1 text-sm rounded hover:bg-indigo-700 transition"
                >
                  Enroll Students
                </Link>
              </div>

              {students.length === 0 ? (
                <p className="text-gray-500 py-4">No students enrolled in this class yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Student Name
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Email
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {students.map((student) => (
                        <tr key={student.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{student.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{student.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link
                              href={`/users/${student.id}`}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              View Profile
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'teachers' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Assigned Teachers</h3>
                <Link
                  href={`/classes/${classId}/assign-teacher`}
                  className="bg-indigo-600 text-white px-3 py-1 text-sm rounded hover:bg-indigo-700 transition"
                >
                  Assign Teachers
                </Link>
              </div>

              {teachers.length === 0 ? (
                <p className="text-gray-500 py-4">No teachers assigned to this class yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Teacher Name
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Email
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {teachers.map((teacher) => (
                        <tr key={teacher.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{teacher.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{teacher.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link
                              href={`/users/${teacher.id}`}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              View Profile
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'lessons' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Lesson Plans</h3>
                <Link
                  href={`/lessons/create?classId=${classId}`}
                  className="bg-indigo-600 text-white px-3 py-1 text-sm rounded hover:bg-indigo-700 transition"
                >
                  Create Lesson Plan
                </Link>
              </div>
              
              {/* This would be populated with lesson plans data */}
              <p className="text-gray-500 py-4">No lesson plans created for this class yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
