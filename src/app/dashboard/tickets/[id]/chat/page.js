'use client';
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import api from '../../../../../lib/api';
import Header from '../../../../../components/Header';
import LoadingSpinner from '../../../../../components/LoadingSpinner';
import { formatDateTime } from '../../../../../lib/utils';
import { FiSend } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAuth } from '../../../../../context/AuthContext';

export default function TicketChatPage() {
  const params = useParams();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (params.id) fetchMessages();
  }, [params.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await api.get(`/tickets/${params.id}/messages`);
      setMessages(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSending(true);
    try {
      await api.post(`/tickets/${params.id}/messages`, { message: newMessage });
      setNewMessage('');
      fetchMessages();
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen flex flex-col">
      <Header title="Ticket Chat" />
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto h-[calc(100vh-200px)] flex flex-col bg-white rounded-xl shadow-md">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg) => (
              <div key={msg._id} className={`flex ${msg.sender._id === user.id ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] ${msg.sender._id === user.id ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-900'} rounded-lg p-4`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-sm">{msg.sender.name}</span>
                    <span className="text-xs opacity-70">{formatDateTime(msg.createdAt)}</span>
                  </div>
                  <p className="whitespace-pre-wrap">{msg.message}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={sendMessage} className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="input flex-1"
              />
              <button type="submit" disabled={sending || !newMessage.trim()} className="btn btn-primary">
                <FiSend />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
