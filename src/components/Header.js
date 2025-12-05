'use client';

import { FiMenu } from 'react-icons/fi';

const Header = ({ title, onMenuClick }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <FiMenu className="w-6 h-6 text-gray-600" />
        </button>
        
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      </div>
    </header>
  );
};

export default Header;
