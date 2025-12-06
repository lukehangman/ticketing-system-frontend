'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';
import ChatBox from '@/components/ui/ChatBox'; // ← ← الحل الأساسي هنا

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const ticketId = params.id;

  const [ticket, setTicket] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          router.push('/login');
          return;
        }

        const userRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/me`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCurrentUser(userRes.data);

        const ticketRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/tickets/${ticketId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTicket(ticketRes.data);

      } catch (error) {
        console.error('خطأ في جلب البيانات:', error);
        toast.error('فشل تحميل التذكرة');
        router.push('/dashboard/tickets');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [ticketId, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">جاري التحميل...</div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-red-600">التذكرة غير موجودة</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-bold text-gray-800">{ticket.title}</h1>
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              ticket.status === 'open'
                ? 'bg-green-100 text-green-800'
                : ticket.status === 'pending'
                ? 'bg-yellow-100 text-yellow-800'
                : ticket.status === 'closed'
                ? 'bg-gray-100 text-gray-800'
                : 'bg-blue-100 text-blue-800'
            }`}
          >
            {ticket.status}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <span className="text-gray-600">الأولوية:</span>
            <span className="font-semibold mr-2">{ticket.priority}</span>
          </div>

          <div>
            <span className="text-gray-600">القسم:</span>
            <span className="font-semibold mr-2">{ticket.category}</span>
          </div>

          <div>
            <span className="text-gray-600">تاريخ الإنشاء:</span>
            <span className="font-semibold mr-2">
              {new Date(ticket.createdAt).toLocaleDateString('ar-SA')}
            </span>
          </div>

          {ticket.assignedTo && (
            <div>
              <span className="text-gray-600">مسند إلى:</span>
              <span className="font-semibold mr-2">{ticket.assignedTo.name}</span>
            </div>
          )}
        </div>

        <div className="border-t pt-4">
          <h3 className="font-semibold text-gray-700 mb-2">الوصف:</h3>
          <p className="text-gray-600 whitespace-pre-wrap">{ticket.description}</p>
        </div>

        {ticket.attachments && ticket.attachments.length > 0 && (
          <div className="border-t pt-4 mt-4">
            <h3 className="font-semibold text-gray-700 mb-2">المرفقات:</h3>
            <div className="flex flex-wrap gap-2">
              {ticket.attachments.map((file, index) => (
                <a
                  key={index}
                  href={`${process.env.NEXT_PUBLIC_API_URL}${file}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  📎 ملف {index + 1}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      <ChatBox ticketId={ticketId} currentUser={currentUser} />
    </div>
  );
}
