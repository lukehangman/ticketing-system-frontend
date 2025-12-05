'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import api from '../../../../lib/api';
import Header from '../../../../components/Header';
import LoadingSpinner from '../../../../components/LoadingSpinner';
import StatusBadge from '../../../../components/StatusBadge';
import { formatDate } from '../../../../lib/utils';
import { FiMail, FiPhone, FiUser, FiBuilding } from 'react-icons/fi';

export default function UserDetailPage() {
  const params = useParams();
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchUser();
      fetchUserTickets();
    }
  }, [params.id]);

  const fetchUser = async () => {
    try {
      const response = await api.get(`/users/${params.id}`);
      setUser(response.data.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserTickets = async () => {
    try {
      const response = await api.get(`/users/${params.id}/tickets`);
      setTickets(response.data.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!user) return null;

  return (
    <div className="min-h-screen">
      <Header title="User Details" />
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <div className="bg-white rounded-xl shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{user.name}</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-3">
              <FiMail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FiUser className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Role</p>
                <p className="font-medium capitalize">{user.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FiBuilding className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Company</p>
                <p className="font-medium">{user.company?.name || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FiPhone className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{user.phone || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">User Tickets</h2>
            <span className="badge bg-primary-100 text-primary-800">{tickets.length} tickets</span>
          </div>
          {tickets.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {tickets.map((ticket) => (
                    <tr key={ticket._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <Link href={`/dashboard/tickets/${ticket._id}`} className="text-primary-600 hover:text-primary-700 font-medium">
                          {ticket.title}
                        </Link>
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={ticket.status} /></td>
                      <td className="px-4 py-3">
                        <span className="badge bg-blue-100 text-blue-800">{ticket.priority}</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{formatDate(ticket.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>No tickets found for this user</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
