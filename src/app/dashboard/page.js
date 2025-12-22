'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useI18n } from '../../context/I18nContext';
import api from '../../lib/api';
import Header from '../../components/Header';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import { FiInbox, FiClock, FiCheckCircle } from 'react-icons/fi';
import { formatDate } from '../../lib/utils';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();
  const { t } = useI18n();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await api.get('/dashboard/stats');
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen">
      <Header title={t('dashboard.title')} />

      <div className="p-6">
        {/* Welcome message */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {t('dashboard.welcome', { name: user?.name || '' })}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            {t('dashboard.overview')}
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title={t('dashboard.totalTickets')}
            value={stats?.totalTickets || 0}
            icon={FiInbox}
            color="primary"
          />
          <StatCard
            title={t('dashboard.openTickets')}
            value={stats?.openTickets || 0}
            icon={FiClock}
            color="warning"
          />
          <StatCard
            title={t('dashboard.inProgress')}
            value={stats?.inProgress || 0}
            icon={FiClock}
            color="info"
          />
          <StatCard
            title={t('dashboard.resolved')}
            value={stats?.resolved || 0}
            icon={FiCheckCircle}
            color="success"
          />
        </div>

        {/* Recent tickets */}
        <div className="bg-white rounded-xl shadow-md dark:bg-gray-800">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {t('dashboard.recentTickets')}
            </h3>
          </div>

          {stats?.recentTickets && stats.recentTickets.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200 dark:bg-gray-900/40 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      {t('dashboard.ticket')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      {t('dashboard.status')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      {t('dashboard.priority')}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      {t('dashboard.date')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {stats.recentTickets.map((ticket) => (
                    <tr key={ticket._id} className="hover:bg-gray-50 transition-colors dark:hover:bg-gray-900/40">
                      <td className="px-6 py-4">
                        <Link
                          href={`/dashboard/tickets/${ticket._id}`}
                          className="text-primary-600 hover:text-primary-700 font-medium"
                        >
                          {ticket.title}
                        </Link>
                        <p className="text-sm text-gray-500 mt-1 dark:text-gray-400">
                          {ticket.customer?.name || t('chat.unknown')}
                        </p>
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
                        {formatDate(ticket.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center text-gray-500 dark:text-gray-300">
              <FiInbox className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>{t('dashboard.noRecentTickets')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
