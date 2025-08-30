import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

interface LessonFormProps {
  initialData?: {
    id?: number;
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
  };
  mode: 'create' | 'edit';
  classId?: number | string;
}

interface ClassOption {
  id: number;
  name: string;
}

export default function LessonForm({ initialData, mode, classId }: LessonFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [classes, setClasses] = useState<ClassOption[]>([]);
  
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    scripture: initialData?.scripture || '',
    objectives: initialData?.objectives || '',
    materials: initialData?.materials || '',
    content: initialData?.content || '',
    activities: initialData?.activities || '',
    classId: initialData?.classId || parseInt(classId as string, 10) || 0,
    teacherId: initialData?.teacherId || 0,
    scheduledDate: initialData?.scheduledDate || new Date().toISOString().substring(0, 10),
    duration: initialData?.duration || 60,
    status: initialData?.status || 'draft' as 'draft' | 'published' | 'archived',
  });

  useEffect(() => {
    // Fetch classes for dropdown
    const fetchClasses = async () => {
      try {
        const response = await fetch('/api/classes?active=true');
        if (!response.ok) {
          throw new Error('Failed to fetch classes');
        }
        const data = await response.json();
        setClasses(data);
      } catch (error) {
        console.error('Error fetching classes:', error);
        toast.error('Failed to load classes');
      }
    };

    fetchClasses();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: 
        name === 'duration' || name === 'classId' || name === 'teacherId'
          ? parseInt(value, 10)
          : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const url = mode === 'create' 
        ? '/api/lessons' 
        : `/api/lessons/${initialData?.id}`;
      
      const method = mode === 'create' ? 'POST' : 'PUT';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save lesson plan');
      }
      
      toast.success(mode === 'create' ? 'Lesson plan created successfully!' : 'Lesson plan updated successfully!');
      
      if (mode === 'create') {
        const data = await response.json();
        router.push(`/lessons/${data.id}`);
      } else {
        router.push(`/lessons/${initialData?.id}`);
      }
    } catch (error) {
      console.error('Error saving lesson plan:', error);
      toast.error('Failed to save lesson plan. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Lesson Title *
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        
        <div>
          <label htmlFor="classId" className="block text-sm font-medium text-gray-700 mb-1">
            Class *
          </label>
          <select
            id="classId"
            name="classId"
            required
            value={formData.classId}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={!!classId}
          >
            <option value="">Select Class</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="scheduledDate" className="block text-sm font-medium text-gray-700 mb-1">
            Scheduled Date *
          </label>
          <input
            id="scheduledDate"
            name="scheduledDate"
            type="date"
            required
            value={formData.scheduledDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
            Duration (minutes) *
          </label>
          <input
            id="duration"
            name="duration"
            type="number"
            required
            min="1"
            value={formData.duration}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        
        <div className="md:col-span-2">
          <label htmlFor="scripture" className="block text-sm font-medium text-gray-700 mb-1">
            Scripture Reference *
          </label>
          <input
            id="scripture"
            name="scripture"
            type="text"
            required
            value={formData.scripture}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g., John 3:16-21"
          />
        </div>
        
        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Short Description *
          </label>
          <textarea
            id="description"
            name="description"
            rows={2}
            required
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        
        <div className="md:col-span-2">
          <label htmlFor="objectives" className="block text-sm font-medium text-gray-700 mb-1">
            Learning Objectives *
          </label>
          <textarea
            id="objectives"
            name="objectives"
            rows={3}
            required
            value={formData.objectives}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter the learning objectives for this lesson"
          />
        </div>
        
        <div className="md:col-span-2">
          <label htmlFor="materials" className="block text-sm font-medium text-gray-700 mb-1">
            Materials Needed
          </label>
          <textarea
            id="materials"
            name="materials"
            rows={3}
            value={formData.materials}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="List any materials needed for this lesson"
          />
        </div>
        
        <div className="md:col-span-2">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Lesson Content *
          </label>
          <textarea
            id="content"
            name="content"
            rows={8}
            required
            value={formData.content}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter the main content of the lesson"
          />
        </div>
        
        <div className="md:col-span-2">
          <label htmlFor="activities" className="block text-sm font-medium text-gray-700 mb-1">
            Activities
          </label>
          <textarea
            id="activities"
            name="activities"
            rows={5}
            value={formData.activities}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Describe any activities planned for this lesson"
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Lesson Plan' : 'Update Lesson Plan'}
        </button>
      </div>
    </form>
  );
}
