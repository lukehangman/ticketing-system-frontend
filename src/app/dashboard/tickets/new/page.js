'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../../lib/api';
import { toast } from 'react-toastify';

export default function NewTicketPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'technical',
    priority: 'medium',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('العنوان مطلوب');
      return;
    }
    if (!formData.description.trim()) {
      toast.error('الوصف مطلوب');
      return;
    }

    try {
      setIsSubmitting(true);
      const { data } = await api.post('/tickets', {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        priority: formData.priority,
      });

      toast.success('Ticket created successfully');
      router.push(`/dashboard/tickets/${data.data._id}`);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'فشل إنشاء التذكرة');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">إنشاء تذكرة جديدة</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* العنوان */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              العنوان <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 
              focus:ring-blue-500 focus:border-transparent"
              placeholder="اكتب عنوان التذكرة"
              disabled={isSubmitting}
              required
            />
          </div>

          {/* القسم */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              القسم <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 
              focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isSubmitting}
              required
            >
              <option value="technical">دعم فني</option>
              <option value="billing">الفواتير</option>
              <option value="sales">المبيعات</option>
              <option value="general">عام</option>
            </select>
          </div>

          {/* الأولوية */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              الأولوية <span className="text-red-500">*</span>
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 
              focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isSubmitting}
              required
            >
              <option value="low">منخفضة</option>
              <option value="medium">متوسطة</option>
              <option value="high">عالية</option>
              <option value="urgent">عاجلة</option>
            </select>
          </div>

          {/* الوصف */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              الوصف <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 
              focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="اشرح المشكلة بالتفصيل"
              rows={6}
              disabled={isSubmitting}
              required
            />
          </div>


          {/* أزرار الإرسال */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 
              disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
            >
              {isSubmitting ? 'جاري الإنشاء...' : 'إنشاء التذكرة'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              disabled={isSubmitting}
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}



