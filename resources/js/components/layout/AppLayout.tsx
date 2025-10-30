import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useRTL } from '@/hooks/useRTL';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { dir } = useRTL();

  return (
    <div className="flex min-h-screen flex-col" dir={dir}>
      <header>
        <Navbar />
      </header>
      <main id="main" className="flex-1">
        {children}
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}
