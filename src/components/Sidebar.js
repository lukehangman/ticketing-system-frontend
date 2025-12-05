'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

import {
  FiHome,
  FiInbox,
  FiPlusCircle,
  FiUsers,
  FiBriefcase,   // ← البديل الصحيح لـ FiBuilding
  FiBarChart2,
  FiUser,
  FiLogOut,
  FiX,
} from 'react-icons/fi';

const Sidebar = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: FiHome, roles: ['admin', 'agent', 'customer'] },
    { name: 'Tickets', href: '/dashboard/tickets', icon: FiInbox, roles: ['admin', 'agent', 'customer'] },
    { name: 'New Ticket', href: '/dashboard/tickets/new', icon: FiPlusCircle, roles: ['customer'] },
    { name: 'Users', href: '/dashboard/users', icon: FiUsers, roles: ['admin', 'agent'] },
    { name: 'Companies', href: '/dashboard/companies', icon: FiBriefcase, roles: ['admin'] }, // 🔥 هنا التعديل
    { name: 'Analytics', href: '/dashboard/analytics', icon: FiBarChart2, roles: ['admin', 'agent'] },
  ];

  const filteredNav = navigation.filter(item => item.roles.includes(user?.role));

  const isActive = (href) => {
    if (href === '/dashboard') return pathname === href;
    return pathname?.startsWith(href);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 w-64 transform transition-transform duration-300 ease-in-out z-50 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-primary-600">TicketHub</h1>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {filteredNav.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    active
                      ? 'bg-primary-50 text-primary-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-gray-200">
            <div className="mb-3">
              <Link
                href="/dashboard/profile"
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive('/dashboard/profile')
                    ? 'bg-primary-50 text-primary-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FiUser className="w-5 h-5" />
                <span>Profile</span>
              </Link>
            </div>

            <div className="px-4 py-3 bg-gray-50 rounded-lg mb-3">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
              <span className="inline-block mt-2 px-2 py-1 text-xs font-medium text-primary-600 bg-primary-50 rounded-full">
                {user?.role}
              </span>
            </div>

            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all"
            >
              <FiLogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default Sidebar;
