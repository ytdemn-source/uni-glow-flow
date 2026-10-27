import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { Header } from '@/components/Header';
import { ServicesSection } from '@/components/ServicesSection';
import { QuickLinksSection } from '@/components/QuickLinksSection';
import { ContactSection } from '@/components/ContactSection';

export default function MorePage() {
  useEffect(() => {
    document.title = 'Study Tools & More — A Help Deck';
  }, []);

  return (
    <div className="min-h-screen pb-24 md:pb-0">
      <Header />
      <main className="pt-20 md:pt-24">
        <ServicesSection />
        <QuickLinksSection />
        <ContactSection />

        <div className="container mx-auto px-4 pb-12">
          <Link
            to="/admin/login"
            className="tile mx-auto flex items-center justify-center gap-2 py-3 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ShieldCheck className="w-4 h-4" />
            Admin panel
          </Link>
        </div>
      </main>
    </div>
  );
}
