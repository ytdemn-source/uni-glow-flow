import { Link, useLocation } from 'react-router-dom';
import { Home, Bell, GraduationCap, BookOpen, LayoutGrid } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const tabs = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/notices', label: 'Notices', icon: Bell },
  { to: '/subjects', label: 'Subjects', icon: GraduationCap },
  { to: '/notes', label: 'Notes', icon: BookOpen },
  { to: '/more', label: 'More', icon: LayoutGrid },
];

export function BottomTabBar() {
  const isMobile = useIsMobile();
  const { pathname } = useLocation();

  if (!isMobile || pathname.startsWith('/admin')) return null;

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-primary text-primary-foreground border-t-4 border-gold shadow-[0_-4px_16px_rgba(0,0,0,0.25)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-label="Primary"
    >
      <div className="grid grid-cols-5 max-w-lg mx-auto">
        {tabs.map(({ to, label, icon: Icon }) => {
          const active = to === '/' ? pathname === '/' : pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              aria-current={active ? 'page' : undefined}
              className="relative flex flex-col items-center justify-center gap-0.5 py-2.5 transition-colors duration-200"
            >
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 rounded-b-full bg-gold" />
              )}
              <Icon
                className={`w-5 h-5 transition-colors duration-200 ${
                  active ? 'text-gold' : 'text-primary-foreground/70'
                }`}
                strokeWidth={active ? 2.4 : 2}
              />
              <span
                className={`text-[10px] font-semibold tracking-wide transition-colors duration-200 ${
                  active ? 'text-gold' : 'text-primary-foreground/70'
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
