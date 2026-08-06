import { Heart, AlertTriangle } from 'lucide-react';
import logo from '@/assets/logo.png';
import { AdSlot } from '@/components/AdSlot';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 bg-primary text-primary-foreground border-t-4 border-gold">
      <div className="container mx-auto px-4">
        <AdSlot />
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src={logo} alt="A Help Deck logo" className="w-10 h-10 object-contain" />
            <div>
              <span className="font-display font-bold block">A Help Deck</span>
              <p className="text-xs opacity-75">Your study companion</p>
            </div>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            <a href="#notices" className="text-sm opacity-85 hover:text-gold transition-colors link-sweep">
              Announcements
            </a>
            <a href="#quick-links" className="text-sm opacity-85 hover:text-gold transition-colors link-sweep">
              Quick Links
            </a>
            <a href="#departments" className="text-sm opacity-85 hover:text-gold transition-colors link-sweep">
              Subjects
            </a>
            <a href="#contact" className="text-sm opacity-85 hover:text-gold transition-colors link-sweep">
              Feedback
            </a>
          </nav>

          <div className="text-center md:text-right">
            <p className="text-sm opacity-85 flex items-center gap-1.5 justify-center md:justify-end">
              Made with <Heart className="w-3.5 h-3.5 text-gold fill-gold" /> for students
            </p>
            <p className="text-xs opacity-70 mt-1">
              © {currentYear} A Help Deck
            </p>
          </div>
        </div>


        <div className="mt-8 pt-6 border-t border-primary-foreground/20">
          <div className="flex items-start gap-2 justify-center text-center">
            <AlertTriangle className="w-4 h-4 text-gold shrink-0 mt-0.5" />
            <p className="text-xs opacity-75 max-w-2xl">
              <span className="font-medium">Disclaimer:</span> A Help Deck is an
              independent, community-run student helper. It is not affiliated
              with any college, university, or government body. Always verify
              important information from official sources.
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
}
