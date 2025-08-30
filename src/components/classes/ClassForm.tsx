import { useState } from 'react';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

interface ClassFormProps {
  initialData?: {
    id?: number;
    name: string;
    gradeLevel: string;
    description: string;
    academicYear: string;
    semester: string;
    maxCapacity: number;
    scheduleDay: string;
    scheduleTime: string;
    location: string;
  };
  mode: 'create' | 'edit';
}

export default function ClassForm({ initialData, mode }: ClassFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    gradeLevel: initialData?.gradeLevel || '',
    description: initialData?.description || '',
    academicYear: initialData?.academicYear || new Date().getFullYear().toString(),
    semester: initialData?.semester || '',
    maxCapacity: initialData?.maxCapacity || 15,
    scheduleDay: initialData?.scheduleDay || 'Sunday',
    scheduleTime: initialData?.scheduleTime || '09:00',
    location: initialData?.location || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'maxCapacity' ? parseInt(value, 10) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const url = mode === 'create' 
        ? '/api/classes' 
        : `/api/classes/${initialData?.id}`;
      
      const method = mode === 'create' ? 'POST' : 'PUT';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save class');
      }
      
      toast.success(mode === 'create' ? 'Class created successfully!' : 'Class updated successfully!');
      router.push('/classes');
    } catch (error) {
      console.error('Error saving class:', error);
      toast.error('Failed to save class. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Class Name *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        
        <div>
          <label htmlFor="gradeLevel" className="block text-sm font-medium text-gray-700 mb-1">
            Grade Level *
          </label>
          <input
            id="gradeLevel"
            name="gradeLevel"
            type="text"
            required
            value={formData.gradeLevel}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g., Grade 1-2, Middle School"
          />
        </div>
        
        <div>
          <label htmlFor="academicYear" className="block text-sm font-medium text-gray-700 mb-1">
            Academic Year *
          </label>
          <input
            id="academicYear"
            name="academicYear"
            type="text"
            required
            value={formData.academicYear}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="2025-2026"
          />
        </div>
        
        <div>
          <label htmlFor="semester" className="block text-sm font-medium text-gray-700 mb-1">
            Semester
          </label>
          <select
            id="semester"
            name="semester"
            value={formData.semester}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select Semester</option>
            <option value="Fall">Fall</option>
            <option value="Spring">Spring</option>
            <option value="Summer">Summer</option>
            <option value="Full Year">Full Year</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="maxCapacity" className="block text-sm font-medium text-gray-700 mb-1">
            Maximum Capacity *
          </label>
          <input
            id="maxCapacity"
            name="maxCapacity"
            type="number"
            required
            min="1"
            value={formData.maxCapacity}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        
        <div>
          <label htmlFor="scheduleDay" className="block text-sm font-medium text-gray-700 mb-1">
            Schedule Day *
          </label>
          <select
            id="scheduleDay"
            name="scheduleDay"
            required
            value={formData.scheduleDay}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="Sunday">Sunday</option>
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
            <option value="Saturday">Saturday</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="scheduleTime" className="block text-sm font-medium text-gray-700 mb-1">
            Schedule Time *
          </label>
          <input
            id="scheduleTime"
            name="scheduleTime"
            type="time"
            required
            value={formData.scheduleTime}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            id="location"
            name="location"
            type="text"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Room 101"
          />
        </div>
      </div>
      
      <div className="col-span-full">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={formData.description}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
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
          {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Class' : 'Update Class'}
        </button>
      </div>
    </form>
  );
}
