import { Inter } from 'next/font/google';
import '@/styles/global.scss';
import Header from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';
import MainProvider from '@/components/providers/MainProvider';
import Message from '@/components/ui/Message';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: process.env.NEXT_PUBLIC_SITENAME + ' - Диалоги на любой случай жизни',
  description: 'Читай, повторяй, проверяй - побеждай!',
};

export default function RootLayout({ children }) {
  return (
    <MainProvider>
      <html lang="ru">
        <body className={inter.className}>
          <div className="container">
            <Header />
            <Message />

            {children}
          </div>

          <Footer />
        </body>
      </html>
    </MainProvider>
  );
}
