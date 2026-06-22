import { lazy, Suspense, useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { NoticesSection } from '@/components/NoticesSection';
import { NotesPromoCard } from '@/components/NotesPromoCard';

// Below-the-fold — lazy loaded so the initial bundle stays small
const BackgroundImage = lazy(() =>
  import('@/components/BackgroundImage').then(m => ({ default: m.BackgroundImage }))
);
const DepartmentsSection = lazy(() =>
  import('@/components/DepartmentsSection').then(m => ({ default: m.DepartmentsSection }))
);
const QuickLinksSection = lazy(() =>
  import('@/components/QuickLinksSection').then(m => ({ default: m.QuickLinksSection }))
);
const ServicesSection = lazy(() =>
  import('@/components/ServicesSection').then(m => ({ default: m.ServicesSection }))
);
const ContactSection = lazy(() =>
  import('@/components/ContactSection').then(m => ({ default: m.ContactSection }))
);
const Footer = lazy(() =>
  import('@/components/Footer').then(m => ({ default: m.Footer }))
);
const AdminNotificationTest = lazy(() =>
  import('@/components/AdminNotificationTest').then(m => ({ default: m.AdminNotificationTest }))
);
const PWAInstallBanner = lazy(() =>
  import('@/components/PWAInstallBanner').then(m => ({ default: m.PWAInstallBanner }))
);

/** Defer non-critical UI until the browser is idle. */
function useIdleMount(delay = 1500) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    };
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(() => setReady(true), { timeout: delay });
      return () => clearTimeout(id as unknown as number);
    }
    const t = setTimeout(() => setReady(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return ready;
}

const Index = () => {
  const idleReady = useIdleMount(1200);

  return (
    <div className="min-h-screen relative">
      <Suspense fallback={null}>
        <BackgroundImage />
      </Suspense>

      <Header />

      <main>
        <Hero />
        <NoticesSection />

        <Suspense fallback={null}>
          <DepartmentsSection />
          <QuickLinksSection />
          <section className="container mx-auto px-4 py-8 md:py-12">
            <NotesPromoCard />
          </section>
          <ServicesSection />
          <ContactSection />
        </Suspense>
      </main>

      <Suspense fallback={null}>
        <Footer />
      </Suspense>

      {idleReady && (
        <Suspense fallback={null}>
          <AdminNotificationTest />
          <PWAInstallBanner />
        </Suspense>
      )}
    </div>
  );
};

export default Index;
