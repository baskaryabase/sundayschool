import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import toast from 'react-hot-toast';
import { UserRole } from '../../types/UserRole';

interface RelationshipFormProps {
  initialParentId?: number;
  initialChildId?: number;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

interface RelationshipType {
  id: string;
  name: string;
  description?: string;
}

const RelationshipForm: React.FC<RelationshipFormProps> = ({ initialParentId, initialChildId }) => {
  const router = useRouter();
  const [parents, setParents] = useState<User[]>([]);
  const [children, setChildren] = useState<User[]>([]);
  const [relationshipTypes, setRelationshipTypes] = useState<RelationshipType[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedParentId, setSelectedParentId] = useState<number | undefined>(initialParentId);
  const [selectedChildId, setSelectedChildId] = useState<number | undefined>(initialChildId);
  const [selectedRelationshipType, setSelectedRelationshipType] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    Promise.all([
      fetchParents(),
      fetchChildren(),
      fetchRelationshipTypes()
    ]).then(() => {
      setLoading(false);
    }).catch((err) => {
      console.error('Error initializing form:', err);
      setError('Failed to load necessary data for the form');
      setLoading(false);
    });
  }, []);

  const fetchParents = async () => {
    try {
      const response = await axios.get('/api/users', { params: { role: UserRole.PARENT } });
      setParents(response.data);
      return response.data;
    } catch (err) {
      console.error('Error fetching parents:', err);
      throw new Error('Failed to load parents');
    }
  };

  const fetchChildren = async () => {
    try {
      const response = await axios.get('/api/users', { params: { role: UserRole.STUDENT } });
      setChildren(response.data);
      return response.data;
    } catch (err) {
      console.error('Error fetching children:', err);
      throw new Error('Failed to load children');
    }
  };

  const fetchRelationshipTypes = async () => {
    try {
      // This would come from your API, but for now we'll use a static list
      const types: RelationshipType[] = [
        { id: 'PARENT', name: 'Parent' },
        { id: 'GUARDIAN', name: 'Legal Guardian' },
        { id: 'GRANDPARENT', name: 'Grandparent' },
        { id: 'STEP_PARENT', name: 'Step-Parent' },
        { id: 'OTHER', name: 'Other' }
      ];
      setRelationshipTypes(types);
      return types;
    } catch (err) {
      console.error('Error fetching relationship types:', err);
      throw new Error('Failed to load relationship types');
    }
  };

  const validateForm = () => {
    if (!selectedParentId) {
      toast.error('Please select a parent');
      return false;
    }

    if (!selectedChildId) {
      toast.error('Please select a child');
      return false;
    }

    if (!selectedRelationshipType) {
      toast.error('Please select a relationship type');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      
      await axios.post('/api/relationships', {
        parentId: selectedParentId,
        childId: selectedChildId,
        relationshipType: selectedRelationshipType,
        notes: notes.trim() || undefined,
      });
      
      toast.success('Relationship created successfully');
      
      // Redirect back to the parent's profile or the relationships list
      if (selectedParentId) {
        router.push(`/users/${selectedParentId}`);
      } else {
        router.push('/relationships');
      }
    } catch (err: any) {
      console.error('Error creating relationship:', err);
      const errorMessage = err.response?.data?.error || 'Failed to create relationship';
      toast.error(errorMessage);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-6">Create New Relationship</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="parentId" className="block text-sm font-medium text-gray-700 mb-1">
              Parent/Guardian *
            </label>
            <select
              id="parentId"
              name="parentId"
              value={selectedParentId || ''}
              onChange={(e) => setSelectedParentId(e.target.value ? Number(e.target.value) : undefined)}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
              required
              disabled={!!initialParentId} // Disable if parent ID is already provided
            >
              <option value="">Select a parent</option>
              {parents.map((parent) => (
                <option key={parent.id} value={parent.id}>
                  {parent.name} ({parent.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="childId" className="block text-sm font-medium text-gray-700 mb-1">
              Child *
            </label>
            <select
              id="childId"
              name="childId"
              value={selectedChildId || ''}
              onChange={(e) => setSelectedChildId(e.target.value ? Number(e.target.value) : undefined)}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
              required
              disabled={!!initialChildId} // Disable if child ID is already provided
            >
              <option value="">Select a child</option>
              {children.map((child) => (
                <option key={child.id} value={child.id}>
                  {child.name} ({child.email})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="relationshipType" className="block text-sm font-medium text-gray-700 mb-1">
            Relationship Type *
          </label>
          <select
            id="relationshipType"
            name="relationshipType"
            value={selectedRelationshipType}
            onChange={(e) => setSelectedRelationshipType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
            required
          >
            <option value="">Select a relationship type</option>
            {relationshipTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Notes (Optional)
          </label>
          <textarea
            id="notes"
            name="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
            placeholder="Any additional information about this relationship"
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300"
          >
            {submitting ? 'Creating...' : 'Create Relationship'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RelationshipForm;
