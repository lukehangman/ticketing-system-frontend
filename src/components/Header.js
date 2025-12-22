'use client';

import { FiMenu, FiMoon, FiSun } from 'react-icons/fi';
import { useI18n } from '../context/I18nContext';
import { useTheme } from '../context/ThemeContext';

const Header = ({ title, onMenuClick }) => {
  const { language, setLanguage, t } = useI18n();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 dark:bg-gray-900 dark:border-gray-800">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {onMenuClick && (
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors dark:hover:bg-gray-800"
              type="button"
            >
              <FiMenu className="w-6 h-6 text-gray-600 dark:text-gray-200" />
            </button>
          )}

          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{title}</h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-800"
            aria-label={theme === 'dark' ? t('theme.light') : t('theme.dark')}
          >
            {theme === 'dark' ? <FiSun /> : <FiMoon />}
            <span className="hidden sm:inline">
              {theme === 'dark' ? t('theme.light') : t('theme.dark')}
            </span>
          </button>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="input max-w-[140px] h-10"
            aria-label={t('language.label')}
          >
            <option value="ar">{t('language.arabic')}</option>
            <option value="en">{t('language.english')}</option>
          </select>
        </div>
      </div>
    </header>
  );
};

export default Header;
