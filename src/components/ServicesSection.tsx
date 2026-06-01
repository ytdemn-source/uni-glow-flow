import { 
  LogIn,
  FileCheck, 
  Users,
  Award,
  Landmark,
  BookMarked
} from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const services: Array<{
  icon: typeof LogIn;
  title: string;
  description: string;
  href: string;
  highlight?: boolean;
}> = [
  {
    icon: LogIn,
    title: 'Student Login',
    description: 'Sign in to the official student portal',
    href: 'https://galsimahavidyalaya.in/student_login.aspx#!',
    highlight: true,
  },
  {
    icon: FileCheck,
    title: 'Registration',
    description: 'B.U. Registration & Enrollment',
    href: 'https://galsimahavidyalaya.ac.in/b-u-registration/',
  },
  {
    icon: BookMarked,
    title: 'IQAC',
    description: 'Internal Quality Assurance Cell',
    href: 'https://galsimahavidyalaya.ac.in/iqac-2/',
  },
  {
    icon: Users,
    title: 'NSS',
    description: 'National Service Scheme',
    href: 'https://galsimahavidyalaya.ac.in/nss-2/',
  },
  {
    icon: Award,
    title: 'Scholarships',
    description: 'Kanyashree, OASIS, Aikyashree',
    href: 'https://oasis.gov.in/',
  },
  {
    icon: Landmark,
    title: 'NIRF',
    description: 'National Institutional Ranking',
    href: 'https://galsimahavidyalaya.ac.in/nirf-2/',
  },
];

export function ServicesSection() {
  const { ref, isVisible } = useScrollReveal<HTMLElement>();

  return (
    <section id="services" className="py-12 md:py-24 lg:py-32" ref={ref}>
      <div className="container mx-auto px-4">
        <div className={`reveal ${isVisible ? 'visible' : ''}`}>
          {/* Section Header */}
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Student Services
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Quick access to essential services designed to support your academic journey.
            </p>
          </div>

          {/* Services Grid */}
          <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 stagger-children ${isVisible ? 'visible' : ''}`}>
            {services.map((service) => (
              <a
                key={service.title}
                href={service.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-4 md:p-6 text-center hover-lift group cursor-pointer ${
                  service.highlight
                    ? 'relative rounded-2xl bg-gradient-to-br from-primary/20 via-accent/15 to-primary/10 border-2 border-primary/40 shadow-lg shadow-primary/20 ring-2 ring-primary/30 ring-offset-2 ring-offset-background animate-pulse-glow'
                    : 'glass-card-elevated'
                }`}
              >
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
                  <service.icon className={`w-5 h-5 md:w-6 md:h-6 ${service.highlight ? 'text-primary' : 'text-primary'}`} />
                </div>
                <h3 className={`text-xs md:text-sm font-semibold mb-1 transition-colors duration-300 ${
                  service.highlight ? 'text-primary' : 'text-foreground group-hover:text-primary'
                }`}>
                  {service.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed hidden md:block">
                  {service.description}
                </p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
