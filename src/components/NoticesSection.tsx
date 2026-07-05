import { Clock, Radio, Inbox, ExternalLink, Megaphone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useQuery } from '@tanstack/react-query';
import { listBroadcasts } from '@/lib/api/broadcasts';
import { NotificationSubscribe } from './NotificationSubscribe';

function BroadcastSkeleton({ index }: { index: number }) {
  return (
    <div
      className="glass-card-elevated p-5 md:p-6 animate-fade-in"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <Skeleton className="h-4 w-24 mb-3" />
      <Skeleton className="h-5 w-3/4 mb-2" />
      <Skeleton className="h-4 w-full mb-1" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}

export function NoticesSection() {
  const { ref, isVisible } = useScrollReveal<HTMLElement>();

  const { data: broadcasts = [], isLoading } = useQuery({
    queryKey: ['broadcasts', 'notices-section'],
    queryFn: () => listBroadcasts(50),
    staleTime: 60_000,
  });

  return (
    <section id="notices" className="pt-4 pb-16 md:py-24 relative" ref={ref}>
      <div className="container mx-auto px-4 relative z-10">
        <div className={`reveal ${isVisible ? 'visible' : ''}`}>
          {/* Header */}
          <div className="mb-6 md:mb-10">
            <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-3 md:mb-4">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-emerald-500/15 to-teal-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                <Radio className="w-3 h-3 animate-pulse" />
                Live updates
              </div>
              <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                Updated automatically
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-1 md:mb-2">
                  Announcements
                </h2>
                <p className="text-sm md:text-base text-muted-foreground max-w-lg">
                  Updates and notices posted by A Help Deck admins.
                </p>
              </div>
              <div className="flex items-center gap-2 self-start md:self-auto">
                <NotificationSubscribe />
                <Button variant="outline" size="sm" asChild>
                  <Link to="/notifications" className="gap-2">
                    <Megaphone className="w-4 h-4" />
                    <span className="hidden sm:inline">All</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* List */}
          {isLoading && broadcasts.length === 0 ? (
            <div className="space-y-3 md:space-y-4">
              {[0, 1, 2].map((i) => (
                <BroadcastSkeleton key={i} index={i} />
              ))}
            </div>
          ) : broadcasts.length === 0 ? (
            <div className="glass-card p-8 md:p-12 text-center">
              <Inbox className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No announcements yet
              </h3>
              <p className="text-sm text-muted-foreground">
                New updates from admins will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3 md:space-y-4">
              {broadcasts.map((b) => (
                <article key={b.id} className="glass-card-elevated p-5 md:p-6">
                  <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
                    <Megaphone className="w-3.5 h-3.5 text-primary" />
                    <span className="font-semibold text-primary uppercase tracking-wide">
                      Admin
                    </span>
                    <span>·</span>
                    <time dateTime={b.created_at}>
                      {new Date(b.created_at).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </time>
                  </div>
                  <h3 className="text-base md:text-lg font-semibold text-foreground mb-1.5">
                    {b.title}
                  </h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                    {b.body}
                  </p>
                  {b.url && (
                    <a
                      href={b.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                    >
                      Open link <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
