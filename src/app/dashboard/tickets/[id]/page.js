'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '../../../../lib/api';
import { toast } from 'react-toastify';
import { useI18n } from '../../../../context/I18nContext';

import ChatBox from '../../../../components/ChatBox';

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t, language } = useI18n();
  const ticketId = params.id;

  const [ticket, setTicket] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await api.get('/auth/me');
        setCurrentUser(userRes.data.data);

        const ticketRes = await api.get(`/tickets/${ticketId}`);
        setTicket(ticketRes.data.data);
      } catch (error) {
        console.error('Error fetching ticket:', error);
        toast.error(t('errors.fetchTicket'));
        router.push('/dashboard/tickets');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [ticketId, router, t]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">{t('chat.loading')}</div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-red-600">{t('ticketDetail.notFound')}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 dark:bg-gray-800">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{ticket?.title}</h1>

          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              ticket?.status === 'open'
                ? 'bg-green-100 text-green-800'
                : ticket?.status === 'pending'
                ? 'bg-yellow-100 text-yellow-800'
                : ticket?.status === 'closed'
                ? 'bg-gray-100 text-gray-800'
                : 'bg-blue-100 text-blue-800'
            }`}
          >
            {ticket?.status}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <span className="text-gray-600 dark:text-gray-300">{t('ticketDetail.priority')}:</span>
            <span className="font-semibold mr-2">{ticket?.priority}</span>
          </div>

          <div>
            <span className="text-gray-600 dark:text-gray-300">{t('ticketDetail.category')}:</span>
            <span className="font-semibold mr-2">{ticket?.category}</span>
          </div>

          <div>
            <span className="text-gray-600 dark:text-gray-300">{t('ticketDetail.createdAt')}:</span>
            <span className="font-semibold mr-2">
              {ticket?.createdAt
                ? new Date(ticket.createdAt).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')
                : ''}
            </span>
          </div>

          {ticket?.assignedTo && (
            <div>
              <span className="text-gray-600 dark:text-gray-300">{t('ticketDetail.assignedTo')}:</span>
              <span className="font-semibold mr-2">{ticket.assignedTo?.name}</span>
            </div>
          )}
        </div>

        <div className="border-t pt-4 dark:border-gray-700">
          <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">{t('ticketDetail.description')}:</h3>
          <p className="text-gray-600 whitespace-pre-wrap dark:text-gray-300">
            {ticket?.description}
          </p>
        </div>

        {ticket?.attachments && ticket.attachments.length > 0 && (
          <div className="border-t pt-4 mt-4 dark:border-gray-700">
            <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">{t('ticketDetail.attachments')}:</h3>
            <div className="flex flex-wrap gap-2">
              {ticket.attachments.map((file, index) => {
                const filePath = file?.path || file;
                return (
                  <a
                    key={index}
                    href={`${process.env.NEXT_PUBLIC_API_URL}${filePath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    {t('ticketDetail.attachments')} {index + 1}
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <ChatBox ticketId={ticketId} currentUser={currentUser} />
    </div>
  );
}
