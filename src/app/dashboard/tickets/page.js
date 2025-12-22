'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '../../../lib/api';
import Header from '../../../components/Header';
import StatusBadge from '../../../components/StatusBadge';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { FiSearch, FiPlus } from 'react-icons/fi';
import { formatDate } from '../../../lib/utils';
import { useAuth } from '../../../context/AuthContext';
import { useI18n } from '../../../context/I18nContext';

export default function TicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    search: '',
  });
  const { isCustomer } = useAuth();
  const { t } = useI18n();

  useEffect(() => {
    fetchTickets();
  }, [filters]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.priority) params.append('priority', filters.priority);

      const response = await api.get(`/tickets?${params.toString()}`);
      let ticketData = response.data.data;

      // Client-side search filtering
      if (filters.search) {
        ticketData = ticketData.filter((ticket) =>
          ticket.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          ticket.description.toLowerCase().includes(filters.search.toLowerCase())
        );
      }

      setTickets(ticketData);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header title={t('tickets.title')} />

      <div className="p-6">
        {/* Filters and actions */}
        <div className="mb-6 flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={t('tickets.searchPlaceholder')}
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="input pl-10"
              />
            </div>

            {/* Status filter */}
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="input"
            >
              <option value="">{t('tickets.allStatus')}</option>
              <option value="open">{t('tickets.open')}</option>
              <option value="in-progress">{t('tickets.inProgress')}</option>
              <option value="resolved">{t('tickets.resolved')}</option>
              <option value="closed">{t('tickets.closed')}</option>
            </select>

            {/* Priority filter */}
            <select
              value={filters.priority}
              onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
              className="input"
            >
              <option value="">{t('tickets.allPriority')}</option>
              <option value="low">{t('tickets.low')}</option>
              <option value="medium">{t('tickets.medium')}</option>
              <option value="high">{t('tickets.high')}</option>
              <option value="urgent">{t('tickets.urgent')}</option>
            </select>
          </div>

          {isCustomer && (
            <Link href="/dashboard/tickets/new" className="btn btn-primary flex items-center gap-2">
              <FiPlus />
              <span>{t('tickets.newTicket')}</span>
            </Link>
          )}
        </div>

        {/* Tickets table */}
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden dark:bg-gray-800">
            {tickets.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200 dark:bg-gray-900/40 dark:border-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {t('tickets.titleCol')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {t('tickets.status')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {t('tickets.priority')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {t('tickets.category')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {t('tickets.created')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {tickets.map((ticket) => (
                      <tr key={ticket._id} className="hover:bg-gray-50 transition-colors dark:hover:bg-gray-900/40">
                        <td className="px-6 py-4">
                          <Link
                            href={`/dashboard/tickets/${ticket._id}`}
                            className="text-primary-600 hover:text-primary-700 font-medium"
                          >
                            {ticket.title}
                          </Link>
                          {ticket.customer && (
                            <p className="text-sm text-gray-500 mt-1 dark:text-gray-400">
                              {ticket.customer.name}
                            </p>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={ticket.status} />
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`badge ${
                              ticket.priority === 'urgent'
                                ? 'bg-red-100 text-red-800'
                                : ticket.priority === 'high'
                                ? 'bg-orange-100 text-orange-800'
                                : ticket.priority === 'medium'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {ticket.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                          {ticket.category}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                          {formatDate(ticket.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center text-gray-500 dark:text-gray-300">
                <p>{t('tickets.noTickets')}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
