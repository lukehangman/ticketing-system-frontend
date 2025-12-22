'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const I18nContext = createContext();

const translations = {
  ar: {
    sidebar: {
      dashboard: 'لوحة التحكم',
      tickets: 'التذاكر',
      newTicket: 'تذكرة جديدة',
      users: 'المستخدمون',
      companies: 'الشركات',
      analytics: 'التحليلات',
      profile: 'الملف الشخصي',
      logout: 'تسجيل الخروج',
    },
    dashboard: {
      title: 'لوحة التحكم',
      welcome: 'مرحبًا، {{name}}!',
      overview: 'نظرة عامة على تذاكرك',
      totalTickets: 'إجمالي التذاكر',
      openTickets: 'التذاكر المفتوحة',
      inProgress: 'قيد المعالجة',
      resolved: 'تم الحل',
      recentTickets: 'أحدث التذاكر',
      noRecentTickets: 'لا توجد تذاكر حديثة',
      ticket: 'تذكرة',
      status: 'الحالة',
      priority: 'الأولوية',
      date: 'التاريخ',
    },
    tickets: {
      title: 'التذاكر',
      searchPlaceholder: 'ابحث عن تذكرة...',
      allStatus: 'كل الحالات',
      allPriority: 'كل الأولويات',
      newTicket: 'تذكرة جديدة',
      noTickets: 'لا توجد تذاكر',
      status: 'الحالة',
      priority: 'الأولوية',
      category: 'التصنيف',
      created: 'تاريخ الإنشاء',
      titleCol: 'العنوان',
      open: 'مفتوحة',
      inProgress: 'قيد المعالجة',
      resolved: 'تم الحل',
      closed: 'مغلقة',
      low: 'منخفضة',
      medium: 'متوسطة',
      high: 'عالية',
      urgent: 'عاجلة',
    },
    ticketDetail: {
      title: 'تفاصيل التذكرة',
      priority: 'الأولوية',
      category: 'التصنيف',
      createdAt: 'تاريخ الإنشاء',
      assignedTo: 'مُسند إلى',
      description: 'الوصف',
      attachments: 'المرفقات',
      notFound: 'التذكرة غير موجودة',
    },
    chat: {
      title: 'المحادثة',
      placeholder: 'اكتب رسالتك...',
      send: 'إرسال',
      sending: 'جارٍ الإرسال...',
      loading: 'جارٍ التحميل...',
      noMessages: 'لا توجد رسائل بعد',
      sent: 'تم إرسال الرسالة',
      unknown: 'مستخدم',
    },
    buttons: {
      newTicket: 'تذكرة جديدة',
      logout: 'تسجيل الخروج',
    },
    errors: {
      fetchMessages: 'تعذر جلب الرسائل',
      sendMessage: 'تعذر إرسال الرسالة',
      fetchTicket: 'تعذر تحميل التذكرة',
      notAuthorized: 'غير مصرح لك بالوصول',
      apiUrl: 'عنوان الـ API غير مضبوط',
    },
    theme: {
      dark: 'الوضع الداكن',
      light: 'الوضع الفاتح',
    },
    language: {
      label: 'اللغة',
      arabic: 'العربية',
      english: 'English',
    },
  },
  en: {
    sidebar: {
      dashboard: 'Dashboard',
      tickets: 'Tickets',
      newTicket: 'New Ticket',
      users: 'Users',
      companies: 'Companies',
      analytics: 'Analytics',
      profile: 'Profile',
      logout: 'Logout',
    },
    dashboard: {
      title: 'Dashboard',
      welcome: 'Welcome back, {{name}}!',
      overview: 'Here is an overview of your support tickets',
      totalTickets: 'Total Tickets',
      openTickets: 'Open Tickets',
      inProgress: 'In Progress',
      resolved: 'Resolved',
      recentTickets: 'Recent Tickets',
      noRecentTickets: 'No recent tickets',
      ticket: 'Ticket',
      status: 'Status',
      priority: 'Priority',
      date: 'Date',
    },
    tickets: {
      title: 'Tickets',
      searchPlaceholder: 'Search tickets...',
      allStatus: 'All Status',
      allPriority: 'All Priority',
      newTicket: 'New Ticket',
      noTickets: 'No tickets found',
      status: 'Status',
      priority: 'Priority',
      category: 'Category',
      created: 'Created',
      titleCol: 'Title',
      open: 'Open',
      inProgress: 'In Progress',
      resolved: 'Resolved',
      closed: 'Closed',
      low: 'Low',
      medium: 'Medium',
      high: 'High',
      urgent: 'Urgent',
    },
    ticketDetail: {
      title: 'Ticket Details',
      priority: 'Priority',
      category: 'Category',
      createdAt: 'Created At',
      assignedTo: 'Assigned To',
      description: 'Description',
      attachments: 'Attachments',
      notFound: 'Ticket not found',
    },
    chat: {
      title: 'Chat',
      placeholder: 'Type your message...',
      send: 'Send',
      sending: 'Sending...',
      loading: 'Loading...',
      noMessages: 'No messages yet',
      sent: 'Message sent',
      unknown: 'User',
    },
    buttons: {
      newTicket: 'New Ticket',
      logout: 'Logout',
    },
    errors: {
      fetchMessages: 'Failed to fetch messages',
      sendMessage: 'Failed to send message',
      fetchTicket: 'Failed to load ticket',
      notAuthorized: 'Not authorized',
      apiUrl: 'API URL is not configured',
    },
    theme: {
      dark: 'Dark mode',
      light: 'Light mode',
    },
    language: {
      label: 'Language',
      arabic: 'Arabic',
      english: 'English',
    },
  },
};

const getTranslationValue = (obj, path) => {
  return path.split('.').reduce((acc, key) => acc?.[key], obj);
};

export const I18nProvider = ({ children }) => {
  const [language, setLanguage] = useState('ar');

  useEffect(() => {
    const storedLanguage = localStorage.getItem('language');
    if (storedLanguage === 'ar' || storedLanguage === 'en') {
      setLanguage(storedLanguage);
    }
  }, []);

  useEffect(() => {
    const direction = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    document.documentElement.dir = direction;
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key, vars = {}) => {
    const value = getTranslationValue(translations[language], key);
    if (typeof value !== 'string') return key;
    return value.replace(/\{\{(\w+)\}\}/g, (_, variable) => {
      return vars[variable] ?? '';
    });
  };

  const direction = language === 'ar' ? 'rtl' : 'ltr';

  const contextValue = useMemo(
    () => ({
      language,
      setLanguage,
      direction,
      t,
    }),
    [language, direction]
  );

  return <I18nContext.Provider value={contextValue}>{children}</I18nContext.Provider>;
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
};
