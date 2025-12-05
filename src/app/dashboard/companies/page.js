'use client';
import { useEffect, useState } from 'react';
import api from '../../../lib/api';
import Header from '../../../components/Header';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { FiBuilding, FiUsers, FiInbox } from 'react-icons/fi';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await api.get('/companies');
      setCompanies(response.data.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header title="Companies" />
      <div className="p-6">
        {loading ? <LoadingSpinner /> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => (
              <div key={company._id} className="card hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-primary-100 rounded-lg">
                    <FiBuilding className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">{company.name}</h3>
                    <p className="text-sm text-gray-600">{company.email}</p>
                  </div>
                </div>
                {company.industry && (
                  <p className="text-sm text-gray-500 mb-4">{company.industry}</p>
                )}
                <div className="flex items-center gap-6 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <FiUsers className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      <span className="font-medium">{company.userCount || 0}</span> users
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiInbox className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      <span className="font-medium">{company.ticketCount || 0}</span> tickets
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
