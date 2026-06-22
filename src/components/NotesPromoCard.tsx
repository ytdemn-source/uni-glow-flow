import { StickyNote, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function NotesPromoCard() {
  return (
    <Link
      to="/notes"
      className="relative block rounded-2xl p-6 md:p-8 bg-gradient-to-br from-accent/20 via-primary/15 to-accent/10 border-2 border-accent/40 shadow-lg shadow-accent/20 ring-2 ring-accent/30 ring-offset-2 ring-offset-background hover-lift group"
    >
      <span className="absolute -top-2 left-6 text-[10px] font-bold uppercase tracking-wider bg-accent text-accent-foreground px-2 py-0.5 rounded-full shadow-md">
        New
      </span>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/40 to-primary/30 border border-accent/40 flex items-center justify-center flex-shrink-0">
          <StickyNote className="w-6 h-6 text-accent-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg md:text-xl font-bold text-foreground mb-1">
            Notes & Help Library
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            Browse subject notes, study materials and helpful text shared for Galsi students. Open any note to download files or join the discussion.
          </p>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
            Open library <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
