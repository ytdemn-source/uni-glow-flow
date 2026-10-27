import { useEffect } from 'react';
import { Header } from '@/components/Header';
import { DepartmentsSection } from '@/components/DepartmentsSection';

export default function SubjectsPage() {
  useEffect(() => {
    document.title = 'Subjects — A Help Deck';
  }, []);

  return (
    <div className="min-h-screen pb-24 md:pb-0">
      <Header />
      <main className="pt-20 md:pt-24">
        <DepartmentsSection />
      </main>
    </div>
  );
}
