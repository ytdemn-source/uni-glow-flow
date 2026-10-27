import { useEffect } from 'react';
import { Header } from '@/components/Header';
import { NoticesSection } from '@/components/NoticesSection';

export default function NoticesPage() {
  useEffect(() => {
    document.title = 'Notices — A Help Deck';
  }, []);

  return (
    <div className="min-h-screen pb-24 md:pb-0">
      <Header />
      <main className="pt-20 md:pt-24">
        <NoticesSection />
      </main>
    </div>
  );
}
