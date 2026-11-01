import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Bell, GraduationCap, BookOpen, LayoutGrid } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import logo from '@/assets/logo.png';

const navLinks = [
  { label: 'Announcements', href: '#notices' },
  { label: 'Quick Links', href: '#quick-links' },
  { label: 'Subjects', href: '#departments' },
  { label: 'Study Tools', href: '#services' },
  { label: 'Feedback', href: '#contact' },
];

const tabs = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/notices', label: 'Notices', icon: Bell },
  { to: '/subjects', label: 'Subjects', icon: GraduationCap },
  { to: '/notes', label: 'Notes', icon: BookOpen },
  { to: '/more', label: 'More', icon: LayoutGrid },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrolled = useRef(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 20;
      if (scrolled !== lastScrolled.current) {
        lastScrolled.current = scrolled;
        setIsScrolled(scrolled);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHiddenRoute = pathname.startsWith('/admin');

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-primary text-primary-foreground border-b-4 border-gold md:bg-transparent md:text-foreground md:border-b-0 ${
        isScrolled
          ? 'md:glass-card md:rounded-none md:border-x-0 md:border-t-0'
          : ''
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <a href="#" className="flex items-center gap-3 group">
            <img
              src={logo}
              alt="A Help Deck logo"
              className="w-10 h-10 md:w-12 md:h-12 object-contain"
            />
            <div className="hidden sm:block">
              <span className="font-bold text-lg text-foreground leading-tight block">
                A Help Deck
              </span>
              <span className="text-xs text-muted-foreground">
                Your study companion
              </span>
            </div>
          </a>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 rounded-lg hover:bg-secondary/50"
              >
                {link.label}
              </a>
            ))}
            <div className="ml-2">
              <ThemeToggle />
            </div>
          </nav>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Mobile top tab navigation */}
      {!isHiddenRoute && (
        <nav
          className="md:hidden border-t border-primary-foreground/10"
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
                  className="relative flex flex-col items-center justify-center gap-0.5 py-2 transition-colors duration-200"
                >
                  {active && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-t-full bg-gold" />
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
      )}
    </header>
  );
}
