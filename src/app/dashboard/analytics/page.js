'use client';
import { useEffect, useState } from 'react';
import api from '../../../lib/api';
import Header from '../../../components/Header';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line } from 'recharts';

const COLORS = ['#0ea5e9', '#f59e0b', '#10b981', '#6b7280'];

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await api.get('/dashboard/analytics');
      setData(response.data.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const statusData = data?.statusDistribution?.map(item => ({
    name: item._id,
    value: item.count
  })) || [];

  const priorityData = data?.priorityDistribution?.map(item => ({
    name: item._id,
    value: item.count
  })) || [];

  return (
    <div className="min-h-screen">
      <Header title="Analytics" />
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="text-lg font-bold mb-4">Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <h3 className="text-lg font-bold mb-4">Priority Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={priorityData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#0ea5e9" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {data?.ticketTrends && (
            <div className="card lg:col-span-2">
              <h3 className="text-lg font-bold mb-4">Ticket Trends (Last 30 Days)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.ticketTrends}>
                  <XAxis dataKey="_id" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#0ea5e9" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="card lg:col-span-2">
            <h3 className="text-lg font-bold mb-4">Performance Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-primary-50 rounded-lg">
                <p className="text-3xl font-bold text-primary-600">{data?.totalResolved || 0}</p>
                <p className="text-gray-600 mt-2">Total Resolved</p>
              </div>
              <div className="text-center p-6 bg-green-50 rounded-lg">
                <p className="text-3xl font-bold text-green-600">{data?.avgResolutionTime || 0}h</p>
                <p className="text-gray-600 mt-2">Avg Resolution Time</p>
              </div>
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <p className="text-3xl font-bold text-blue-600">
                  {data?.totalResolved > 0 ? Math.round((data?.totalResolved / (data?.totalResolved + statusData.reduce((a, b) => a + b.value, 0))) * 100) : 0}%
                </p>
                <p className="text-gray-600 mt-2">Resolution Rate</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
