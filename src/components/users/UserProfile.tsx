import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import toast from 'react-hot-toast';
import { UserRole } from '../../types/UserRole';
import Link from 'next/link';

interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  dateOfBirth?: string;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface UserProfileProps {
  userId: number;
}

const UserProfile: React.FC<UserProfileProps> = ({ userId }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // For children/parent relationships
  const [relatedUsers, setRelatedUsers] = useState<{ id: number; name: string; role: string; relationType: string }[]>([]);
  const [loadingRelationships, setLoadingRelationships] = useState(false);

  useEffect(() => {
    fetchUserData();
    fetchUserRelationships();
  }, [userId]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/users/${userId}`);
      setUser(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to load user data.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRelationships = async () => {
    try {
      setLoadingRelationships(true);
      const response = await axios.get(`/api/relationships/user/${userId}`);
      setRelatedUsers(response.data);
    } catch (err) {
      console.error('Error fetching user relationships:', err);
      // Not setting an error here as it's not critical
    } finally {
      setLoadingRelationships(false);
    }
  };

  const handleDeleteRelationship = async (relatedUserId: number) => {
    if (!window.confirm('Are you sure you want to delete this relationship?')) {
      return;
    }

    try {
      await axios.delete(`/api/relationships/${userId}/${relatedUserId}`);
      toast.success('Relationship removed successfully');
      // Refresh relationships list
      fetchUserRelationships();
    } catch (err) {
      console.error('Error deleting relationship:', err);
      toast.error('Failed to delete relationship');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
        {error || 'User not found'}
      </div>
    );
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-indigo-600 text-white p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-indigo-100">{user.email}</p>
            <div className="mt-2">
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                user.role === UserRole.ADMIN 
                  ? 'bg-purple-200 text-purple-800'
                  : user.role === UserRole.TEACHER
                  ? 'bg-blue-200 text-blue-800'
                  : user.role === UserRole.PARENT
                  ? 'bg-green-200 text-green-800'
                  : 'bg-yellow-200 text-yellow-800'
              }`}>
                {user.role.charAt(0) + user.role.slice(1).toLowerCase()}
              </span>
              <span className={`inline-block ml-2 px-2 py-1 rounded-full text-xs font-semibold ${
                user.isActive
                  ? 'bg-green-200 text-green-800'
                  : 'bg-red-200 text-red-800'
              }`}>
                {user.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
          <div>
            <Link href={`/users/${userId}/edit`} className="inline-block px-4 py-2 bg-white text-indigo-600 rounded-md hover:bg-indigo-50">
              Edit User
            </Link>
          </div>
        </div>
      </div>

      {/* User Details */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium border-b pb-2 mb-4">Personal Information</h3>
            <dl>
              <div className="grid grid-cols-3 py-2">
                <dt className="text-gray-500">Date of Birth:</dt>
                <dd className="col-span-2">{formatDate(user.dateOfBirth)}</dd>
              </div>
              <div className="grid grid-cols-3 py-2">
                <dt className="text-gray-500">Phone:</dt>
                <dd className="col-span-2">{user.phone || 'N/A'}</dd>
              </div>
              <div className="grid grid-cols-3 py-2">
                <dt className="text-gray-500">Address:</dt>
                <dd className="col-span-2">
                  {user.address ? (
                    <>
                      {user.address}<br />
                      {user.city && user.city}{user.state && `, ${user.state}`} {user.zipCode && user.zipCode}
                    </>
                  ) : (
                    'N/A'
                  )}
                </dd>
              </div>
            </dl>
          </div>

          <div>
            <h3 className="text-lg font-medium border-b pb-2 mb-4">Account Information</h3>
            <dl>
              <div className="grid grid-cols-3 py-2">
                <dt className="text-gray-500">Account Created:</dt>
                <dd className="col-span-2">{formatDate(user.createdAt)}</dd>
              </div>
              <div className="grid grid-cols-3 py-2">
                <dt className="text-gray-500">Last Updated:</dt>
                <dd className="col-span-2">{formatDate(user.updatedAt)}</dd>
              </div>
              <div className="grid grid-cols-3 py-2">
                <dt className="text-gray-500">Last Login:</dt>
                <dd className="col-span-2">{formatDate(user.lastLoginAt)}</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Family Relationships Section */}
        <div className="mt-8">
          <div className="flex justify-between items-center border-b pb-2 mb-4">
            <h3 className="text-lg font-medium">Relationships</h3>
            <Link href={`/relationships/create?userId=${userId}`} className="text-sm bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700">
              Add Relationship
            </Link>
          </div>
          
          {loadingRelationships ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : relatedUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left text-gray-500 text-xs font-medium uppercase tracking-wider">Name</th>
                    <th className="px-4 py-2 text-left text-gray-500 text-xs font-medium uppercase tracking-wider">Role</th>
                    <th className="px-4 py-2 text-left text-gray-500 text-xs font-medium uppercase tracking-wider">Relationship</th>
                    <th className="px-4 py-2 text-center text-gray-500 text-xs font-medium uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {relatedUsers.map(relatedUser => (
                    <tr key={relatedUser.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2">
                        <Link href={`/users/${relatedUser.id}`} className="text-blue-600 hover:text-blue-800">
                          {relatedUser.name}
                        </Link>
                      </td>
                      <td className="px-4 py-2">{relatedUser.role}</td>
                      <td className="px-4 py-2">{relatedUser.relationType}</td>
                      <td className="px-4 py-2 text-center">
                        <button
                          onClick={() => handleDeleteRelationship(relatedUser.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Remove Relationship"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center py-4 text-gray-500">No relationships found for this user</p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-6 py-4">
        <div className="flex justify-end">
          <button
            onClick={() => router.push('/users')}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 mr-2"
          >
            Back to Users
          </button>
          {user.isActive ? (
            <button
              onClick={async () => {
                try {
                  await axios.patch(`/api/users/${userId}/status`, { isActive: false });
                  toast.success('User deactivated successfully');
                  setUser({ ...user, isActive: false });
                } catch (err) {
                  toast.error('Failed to deactivate user');
                }
              }}
              className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
            >
              Deactivate User
            </button>
          ) : (
            <button
              onClick={async () => {
                try {
                  await axios.patch(`/api/users/${userId}/status`, { isActive: true });
                  toast.success('User activated successfully');
                  setUser({ ...user, isActive: true });
                } catch (err) {
                  toast.error('Failed to activate user');
                }
              }}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Activate User
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
