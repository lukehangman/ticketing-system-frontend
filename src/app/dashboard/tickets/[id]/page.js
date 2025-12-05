'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import api from '../../../../lib/api';
import Header from '../../../../components/Header';
import StatusBadge from '../../../../components/StatusBadge';
import LoadingSpinner from '../../../../components/LoadingSpinner';
import { formatDateTime } from '../../../../lib/utils';
import { FiMessageCircle } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAuth } from '../../../../context/AuthContext';

export default function TicketDetailPage() {
  const params = useParams();
  const { isCustomer } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    if (params.id) fetchTicket();
  }, [params.id]);

  const fetchTicket = async () => {
    try {
      const response = await api.get(`/tickets/${params.id}`);
      setTicket(response.data.data);
      setNewStatus(response.data.data.status);
    } catch (error) {
      toast.error('Failed to fetch ticket');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    try {
      await api.put(`/tickets/${params.id}`, { status: newStatus });
      toast.success('Status updated');
      fetchTicket();
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!ticket) return null;

  return (
    <div className="min-h-screen">
      <Header title="Ticket Details" />
      <div className="p-6 max-w-5xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">{ticket.title}</h1>
              <div className="flex gap-3">
                <StatusBadge status={ticket.status} />
                <span className="badge bg-blue-100 text-blue-800">{ticket.priority}</span>
              </div>
            </div>
            <Link href={`/dashboard/tickets/${params.id}/chat`} className="btn btn-primary flex items-center gap-2">
              <FiMessageCircle /> View Chat
            </Link>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-500 mb-2">Description</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-gray-500 mb-1">Customer</h3>
                <p>{ticket.customer?.name}</p>
                <p className="text-sm text-gray-500">{ticket.customer?.email}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-500 mb-1">Created</h3>
                <p>{formatDateTime(ticket.createdAt)}</p>
              </div>
            </div>
            {!isCustomer() && (
              <div className="pt-4 border-t">
                <h3 className="font-medium mb-2">Update Status</h3>
                <div className="flex gap-4">
                  <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="input flex-1">
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                  <button onClick={handleStatusUpdate} className="btn btn-primary" disabled={newStatus === ticket.status}>
                    Update
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
