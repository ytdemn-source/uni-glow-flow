import {
  BookOpen,
  GraduationCap,
  Library,
  Award,
  FolderLock,
  Landmark,
} from 'lucide-react';
import { QuickActionCard } from './QuickActionCard';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const quickLinks = [
  {
    icon: GraduationCap,
    title: 'SWAYAM',
    description: 'Free online courses from Indian universities and institutes.',
    href: 'https://swayam.gov.in/',
  },
  {
    icon: BookOpen,
    title: 'NPTEL',
    description: 'Video lectures and certification courses across engineering and sciences.',
    href: 'https://nptel.ac.in/',
  },
  {
    icon: Library,
    title: 'National Digital Library',
    description: 'A huge free library of books, papers and study material.',
    href: 'https://ndl.iitkgp.ac.in/',
  },
  {
    icon: FolderLock,
    title: 'DigiLocker',
    description: 'Store and access your academic documents and certificates online.',
    href: 'https://www.digilocker.gov.in/',
  },
  {
    icon: Award,
    title: 'National Scholarship Portal',
    description: 'Apply for central and state scholarships in one place.',
    href: 'https://scholarships.gov.in/',
  },
  {
    icon: Landmark,
    title: 'e-PG Pathshala',
    description: 'Postgraduate e-content across all major subjects.',
    href: 'https://epgp.inflibnet.ac.in/',
  },
];

export function QuickLinksSection() {
  const { ref, isVisible } = useScrollReveal<HTMLElement>();

  return (
    <section id="quick-links" className="py-12 md:py-24 lg:py-32" ref={ref}>
      <div className="container mx-auto px-4">
        <div className={`reveal ${isVisible ? 'visible' : ''}`}>
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Quick Access
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Free study platforms and public education portals every student
              should have bookmarked.
            </p>
          </div>

          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children ${isVisible ? 'visible' : ''}`}>
            {quickLinks.map((link) => (
              <QuickActionCard
                key={link.title}
                icon={link.icon}
                title={link.title}
                description={link.description}
                href={link.href}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
