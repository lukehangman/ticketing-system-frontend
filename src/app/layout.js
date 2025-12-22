import '../styles/globals.css';
import ClientProviders from '../components/ClientProviders';

export const metadata = {
  title: 'TicketHub - Support Ticketing System',
  description: 'Modern support ticketing and helpdesk system',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
