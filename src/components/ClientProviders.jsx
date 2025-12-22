'use client';

import { ToastContainer } from 'react-toastify';
import { AuthProvider } from '../context/AuthContext';
import { I18nProvider, useI18n } from '../context/I18nContext';
import { ThemeProvider } from '../context/ThemeContext';

const ToastBridge = ({ children }) => {
  const { direction } = useI18n();

  return (
    <>
      {children}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={direction === 'rtl'}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};

export default function ClientProviders({ children }) {
  return (
    <ThemeProvider>
      <I18nProvider>
        <AuthProvider>
          <ToastBridge>{children}</ToastBridge>
        </AuthProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
