'use client';

import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import api from '../lib/api';

export default function ChatBox({ ticketId, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  // جلب الرسائل
  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get(`/messages/${ticketId}`);
      setMessages(data.messages || []);
    } catch (error) {
      console.error('خطأ في جلب الرسائل:', error);
      if (error.response?.status === 403) {
        toast.error('غير مصرح لك بالوصول لهذه المحادثة');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // إرسال رسالة
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim()) {
      toast.error('اكتب رسالة أو ارفع ملف');
      return;
    }

    try {
      setIsSending(true);

      // رفع ملف إذا موجود
            // إرسال الرسالة
      const { data } = await api.post(`/messages/${ticketId}`, {
        message: newMessage.trim(),
      });

      const createdMessage = data.messages?.[0];
      if (createdMessage) {
        setMessages((prev) => [...prev, createdMessage]);
      }
      setNewMessage('');

      toast.success('تم إرسال الرسالة');
    } catch (error) {
      console.error('خطأ في إرسال الرسالة:', error);
      toast.error('فشل إرسال الرسالة');
    } finally {
      setIsSending(false);
    }
  };

  // تحديث الرسائل كل 5 ثواني
  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [ticketId]);

  // السكروول للأسفل تلقائي
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">المحادثة</h2>

      {/* قائمة الرسائل */}
      <div className="border rounded-lg p-4 h-96 overflow-y-auto bg-gray-50 mb-4">
        {isLoading && messages.length === 0 ? (
          <div className="text-center text-gray-500">جاري التحميل...</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500">لا توجد رسائل بعد</div>
        ) : (
          messages.map((msg) => {
            const isCurrentUser = msg.sender._id === currentUser?._id;

            return (
              <div
                key={msg._id}
                className={`mb-4 flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    isCurrentUser
                      ? 'bg-blue-500 text-white'
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  {/* اسم المرسل والوقت */}
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-sm font-semibold ${
                        isCurrentUser ? 'text-blue-100' : 'text-gray-700'
                      }`}
                    >
                      {msg.sender.name}
                    </span>
                    <span
                      className={`text-xs ${
                        isCurrentUser ? 'text-blue-200' : 'text-gray-400'
                      }`}
                    >
                      {formatDistanceToNow(new Date(msg.createdAt), {
                        addSuffix: true,
                        locale: ar,
                      })}
                    </span>
                  </div>

                  {/* نص الرسالة */}
                  <p className={`text-sm ${isCurrentUser ? 'text-white' : 'text-gray-800'}`}>
                    {msg.message}
                  </p>

                  {/* المرفقات */}
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="mt-2">
                      {msg.attachments.map((file, index) => (
                        <a
                          key={index}
                          href={`${process.env.NEXT_PUBLIC_API_URL}${file}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`text-xs underline block ${
                            isCurrentUser ? 'text-blue-100' : 'text-blue-600'
                          }`}
                        >
                          dY"Z U.U,U? U.OñU?U, {index + 1}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* الفورم */}
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <div className="flex-1">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="اكتب رسالتك هنا..."
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={2}
            disabled={isSending}
          />
        </div>

        <button
          type="submit"
          disabled={isSending || !newMessage.trim()}
          className="bg-blue-600 text-white px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors h-fit"
        >
          {isSending ? 'جاري الإرسال...' : 'إرسال'}
        </button>
      </form>
    </div>
  );
}








