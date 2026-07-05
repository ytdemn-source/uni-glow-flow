import {
  StickyNote,
  Bell,
  Bookmark,
  Calculator,
  Timer,
  MessageCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useScrollReveal } from '@/hooks/useScrollReveal';

type Service = {
  icon: typeof StickyNote;
  title: string;
  description: string;
  href: string;
  external?: boolean;
  highlight?: boolean;
};

const services: Service[] = [
  {
    icon: StickyNote,
    title: 'Notes Library',
    description: 'Browse shared study notes',
    href: '/notes',
    highlight: true,
  },
  {
    icon: Bell,
    title: 'Announcements',
    description: 'Latest updates from admins',
    href: '#notices',
  },
  {
    icon: Bookmark,
    title: 'All Notifications',
    description: 'History of every broadcast',
    href: '/notifications',
  },
  {
    icon: Calculator,
    title: 'CGPA Calculator',
    description: 'Free online GPA / CGPA tool',
    href: 'https://gpacalculator.net/college-gpa-calculator/',
    external: true,
  },
  {
    icon: Timer,
    title: 'Pomodoro Timer',
    description: 'Focused study sessions',
    href: 'https://pomofocus.io/',
    external: true,
  },
  {
    icon: MessageCircle,
    title: 'Feedback',
    description: 'Tell us what to improve',
    href: '#contact',
  },
];

export function ServicesSection() {
  const { ref, isVisible } = useScrollReveal<HTMLElement>();

  return (
    <section id="services" className="py-12 md:py-24 lg:py-32" ref={ref}>
      <div className="container mx-auto px-4">
        <div className={`reveal ${isVisible ? 'visible' : ''}`}>
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Study Tools
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Handy shortcuts to help you stay organised and focused.
            </p>
          </div>

          <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 stagger-children ${isVisible ? 'visible' : ''}`}>
            {services.map((service) => {
              const inner = (
                <>
                  {service.highlight && (
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-wider bg-primary text-primary-foreground px-2 py-0.5 rounded-full shadow-md">
                      New
                    </span>
                  )}
                  <div className={`w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 md:mb-4 rounded-xl flex items-center justify-center transition-all duration-300 border ${
                    service.highlight
                      ? 'bg-gradient-to-br from-primary/40 to-accent/30 border-primary/40 group-hover:from-primary/60 group-hover:to-accent/50'
                      : 'bg-gradient-to-br from-primary/15 to-accent/10 border-primary/10 group-hover:from-primary/25 group-hover:to-accent/20'
                  }`}>
                    <service.icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                  <h3 className={`text-xs md:text-sm font-semibold mb-1 transition-colors duration-300 ${
                    service.highlight ? 'text-primary' : 'text-foreground group-hover:text-primary'
                  }`}>
                    {service.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed hidden md:block">
                    {service.description}
                  </p>
                </>
              );

              const className = `p-4 md:p-6 text-center hover-lift group cursor-pointer ${
                service.highlight
                  ? 'relative rounded-2xl bg-gradient-to-br from-primary/20 via-accent/15 to-primary/10 border-2 border-primary/40 shadow-lg shadow-primary/20 ring-2 ring-primary/30 ring-offset-2 ring-offset-background animate-pulse-soft'
                  : 'glass-card-elevated'
              }`;

              if (service.external) {
                return (
                  <a key={service.title} href={service.href} target="_blank" rel="noopener noreferrer" className={className}>
                    {inner}
                  </a>
                );
              }
              if (service.href.startsWith('#')) {
                return (
                  <a key={service.title} href={service.href} className={className}>
                    {inner}
                  </a>
                );
              }
              return (
                <Link key={service.title} to={service.href} className={className}>
                  {inner}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
