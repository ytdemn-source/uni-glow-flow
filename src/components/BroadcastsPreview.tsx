import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Bell, ArrowRight } from "lucide-react";
import { listBroadcasts } from "@/lib/api/broadcasts";

export function BroadcastsPreview() {
  const { data } = useQuery({
    queryKey: ["broadcasts", "preview"],
    queryFn: () => listBroadcasts(3),
    staleTime: 60_000,
  });

  const items = data ?? [];

  return (
    <section className="container mx-auto px-4 pt-4 md:pt-6">
      <Link
        to="/notifications"
        className="block rounded-2xl p-4 md:p-5 bg-gradient-to-br from-primary/15 via-primary/10 to-accent/10 border border-primary/30 hover-lift group"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 relative">
            <Bell className="w-5 h-5" />
            {items.length > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-background animate-pulse" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-bold text-foreground">Notifications</h3>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary group-hover:gap-2 transition-all">
                View all <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
            {items.length === 0 ? (
              <p className="text-sm text-muted-foreground mt-0.5">
                No announcements yet. Check back for admin updates.
              </p>
            ) : (
              <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">
                <span className="font-medium text-foreground">{items[0].title}</span>
                {items[0].body ? ` — ${items[0].body}` : ""}
              </p>
            )}
          </div>
        </div>
      </Link>
    </section>
  );
}
