import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import toast from 'react-hot-toast';
import { UserRole } from '../../types/UserRole';

interface Relationship {
  id: number;
  parentId: number;
  parentName: string;
  parentEmail: string;
  childId: number;
  childName: string;
  childEmail: string;
  relationshipType: string;
  notes?: string;
  createdAt: string;
}

const RelationshipList: React.FC = () => {
  const router = useRouter();
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [relationshipFilter, setRelationshipFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchRelationships();
  }, []);

  const fetchRelationships = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/relationships');
      setRelationships(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching relationships:', err);
      setError('Failed to load relationships. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (relationshipId: number) => {
    if (!window.confirm('Are you sure you want to delete this relationship?')) {
      return;
    }

    try {
      await axios.delete(`/api/relationships/${relationshipId}`);
      toast.success('Relationship deleted successfully');
      // Refresh the list
      setRelationships(relationships.filter(relationship => relationship.id !== relationshipId));
    } catch (err) {
      console.error('Error deleting relationship:', err);
      toast.error('Failed to delete relationship');
    }
  };

  // Apply filters and search
  const filteredRelationships = relationships.filter(relationship => {
    const matchesSearch = 
      relationship.parentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      relationship.childName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      relationship.parentEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      relationship.childEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRelationshipType = relationshipFilter ? 
      relationship.relationshipType === relationshipFilter : true;
    
    return matchesSearch && matchesRelationshipType;
  });

  // Get unique relationship types for the filter dropdown
  const relationshipTypes = [...new Set(relationships.map(r => r.relationshipType))];

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRelationships.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRelationships.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Parent-Child Relationships</h2>
        <Link href="/relationships/create" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
          Add New Relationship
        </Link>
      </div>
      
      {/* Filter Controls */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="flex-grow">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <div className="w-full sm:w-auto">
          <select
            value={relationshipFilter}
            onChange={(e) => setRelationshipFilter(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">All Relationship Types</option>
            {relationshipTypes.map(type => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Relationships Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-4 text-left">Parent</th>
              <th className="py-3 px-4 text-left">Child</th>
              <th className="py-3 px-4 text-left">Relationship</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600">
            {currentItems.length > 0 ? (
              currentItems.map(relationship => (
                <tr key={relationship.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <Link href={`/users/${relationship.parentId}`} className="text-blue-600 hover:text-blue-800">
                      {relationship.parentName}
                    </Link>
                    <div className="text-xs text-gray-500">{relationship.parentEmail}</div>
                  </td>
                  <td className="py-3 px-4">
                    <Link href={`/users/${relationship.childId}`} className="text-blue-600 hover:text-blue-800">
                      {relationship.childName}
                    </Link>
                    <div className="text-xs text-gray-500">{relationship.childEmail}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                      {relationship.relationshipType}
                    </span>
                    {relationship.notes && (
                      <div className="mt-1 text-xs italic text-gray-500">{relationship.notes}</div>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex justify-center items-center space-x-2">
                      <button 
                        onClick={() => handleDelete(relationship.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete Relationship"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-6 text-center text-gray-500">
                  No relationships found matching your criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <nav className="flex items-center">
            <button
              onClick={() => paginate(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-200 text-gray-600 rounded-l-md disabled:bg-gray-100 disabled:text-gray-400"
            >
              Previous
            </button>
            
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => paginate(index + 1)}
                className={`px-3 py-1 ${
                  currentPage === index + 1
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {index + 1}
              </button>
            ))}
            
            <button
              onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-200 text-gray-600 rounded-r-md disabled:bg-gray-100 disabled:text-gray-400"
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default RelationshipList;
