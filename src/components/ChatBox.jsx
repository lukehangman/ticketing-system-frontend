'use client';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { formatDistanceToNow } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import { useI18n } from '../context/I18nContext';

export default function ChatBox({ ticketId, currentUser }) {
  const { language, t } = useI18n();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '');
  const currentUserId = currentUser?._id || currentUser?.id;
  const locale = language === 'ar' ? ar : enUS;

  const getAuthHeaders = () => {
    if (typeof window === 'undefined') return {};
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Fetch messages
  const fetchMessages = async () => {
    if (!apiBaseUrl) {
      toast.error(t('errors.apiUrl'));
      return;
    }

    try {
      setIsLoading(true);
      const { data } = await axios.get(`${apiBaseUrl}/messages/${ticketId}`, {
        headers: getAuthHeaders(),
      });
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      if (error.response?.status === 403) {
        toast.error(t('errors.notAuthorized'));
      } else {
        toast.error(t('errors.fetchMessages'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Send message
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim()) {
      return;
    }

    if (!apiBaseUrl) {
      toast.error(t('errors.apiUrl'));
      return;
    }

    try {
      setIsSending(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

      const { data } = await axios.post(
        `${apiBaseUrl}/messages/${ticketId}`,
        { message: newMessage.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const createdMessage = data.messages?.[0];
      if (createdMessage) {
        setMessages((prev) => [...prev, createdMessage]);
      }
      setNewMessage('');

      toast.success(t('chat.sent'));
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(t('errors.sendMessage'));
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    if (ticketId) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [ticketId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6 dark:bg-gray-800">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">{t('chat.title')}</h2>

      <div className="border rounded-lg p-4 h-96 overflow-y-auto bg-gray-50 mb-4 dark:bg-gray-900/40 dark:border-gray-700">
        {isLoading && messages.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-300">{t('chat.loading')}</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-300">{t('chat.noMessages')}</div>
        ) : (
          messages.map((msg) => {
            const isCurrentUser = msg.sender?._id === currentUserId;

            return (
              <div
                key={msg._id}
                className={`mb-4 flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    isCurrentUser
                      ? 'bg-blue-500 text-white'
                      : 'bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-sm font-semibold ${
                        isCurrentUser ? 'text-blue-100' : 'text-gray-700 dark:text-gray-200'
                      }`}
                    >
                      {msg.sender?.name || t('chat.unknown')}
                    </span>
                    <span
                      className={`text-xs ${
                        isCurrentUser ? 'text-blue-200' : 'text-gray-400'
                      }`}
                    >
                      {formatDistanceToNow(new Date(msg.createdAt), {
                        addSuffix: true,
                        locale,
                      })}
                    </span>
                  </div>

                  <p className={`text-sm ${isCurrentUser ? 'text-white' : 'text-gray-800 dark:text-gray-100'}`}>
                    {msg.message}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="flex gap-2">
        <div className="flex-1">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={t('chat.placeholder')}
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
            rows={2}
            disabled={isSending}
          />
        </div>

        <button
          type="submit"
          disabled={isSending || !newMessage.trim()}
          className="bg-blue-600 text-white px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors h-fit"
        >
          {isSending ? t('chat.sending') : t('chat.send')}
        </button>
      </form>
    </div>
  );
}
