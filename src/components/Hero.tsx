import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Bell, ArrowRight, Radio, Clock, Sparkles, Megaphone } from 'lucide-react';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { noticesApi } from '@/lib/api/notices';
import { listBroadcasts } from '@/lib/api/broadcasts';
import logo from '@/assets/logo.png';

interface NoticeLike {
  id: string;
  title: string;
  date: string;
  url: string;
  isNew?: boolean;
  isImportant?: boolean;
  source: 'college' | 'admin';
  sourceLabel: string;
}

function LatestNoticeRow({ item, index }: { item: NoticeLike; index: number }) {
  const formattedDate = new Date(item.date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  });

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-start gap-3 p-3 rounded-xl bg-background/40 hover:bg-background/80 border border-transparent hover:border-border/60 transition-all duration-300 animate-fade-in"
      style={{ animationDelay: `${0.25 + index * 0.1}s` }}
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
        <Bell className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-primary bg-primary/10 px-1.5 py-0.5 rounded">
            {item.sourceLabel}
          </span>
          {item.isNew && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">
              New
            </span>
          )}
          <span className="text-[10px] text-muted-foreground ml-auto">
            {formattedDate}
          </span>
        </div>
        <p className="text-sm font-medium text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {item.title}
        </p>
      </div>
    </a>
  );
}

export function Hero() {
  const { data: collegeData, isLoading: collegeLoading } = useQuery({
    queryKey: ['college-notices', 'hero-preview'],
    queryFn: () => noticesApi.fetchNotices(),
    staleTime: 5 * 60_000,
  });

  const { data: broadcasts, isLoading: adminLoading } = useQuery({
    queryKey: ['broadcasts', 'hero-preview'],
    queryFn: () => listBroadcasts(5),
    staleTime: 60_000,
  });

  const latest = useMemo<NoticeLike[]>(() => {
    const collegeNotices = (collegeData?.notices ?? []).slice(0, 4).map((n) => ({
      ...n,
      source: 'college' as const,
      sourceLabel: 'College',
    }));
    const adminNotices = (broadcasts ?? []).slice(0, 4).map((b) => ({
      id: b.id,
      title: b.title,
      date: b.created_at,
      url: b.url || '#notices',
      isNew: true,
      isImportant: false,
      source: 'admin' as const,
      sourceLabel: 'Admin',
    }));
    return [...adminNotices, ...collegeNotices]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3);
  }, [collegeData, broadcasts]);

  const isLoading = collegeLoading || adminLoading;

  return (
    <section className="relative min-h-[92vh] md:min-h-[85vh] flex items-center overflow-hidden pt-20 md:pt-24 pb-12 md:pb-16">
      {/* Ambient background glow */}
      <div className="absolute inset-0 -z-20 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[60vw] h-[60vw] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-accent/10 blur-[100px]" />
        <div className="absolute inset-0 bg-pattern opacity-20" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left: branding + CTA */}
          <div className="max-w-xl animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6 md:mb-8">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">
                Student announcements, updated live
              </span>
            </div>

            <div className="flex items-center gap-4 mb-5 md:mb-6">
              <img
                src={logo}
                alt="A Help Deck logo"
                className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-lg"
              />
              <div>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                  <span className="gradient-text">A Help Deck</span>
                </h1>
                <p className="text-base md:text-lg text-muted-foreground mt-1">
                  Your study companion
                </p>
              </div>
            </div>

            <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-6 md:mb-8">
              Stay ahead with the latest college and university notices, results, and
              announcements — all in one place. No more digging through scattered sites.
            </p>

            <div className="flex flex-wrap items-center gap-3 mb-8 md:mb-10">
              <Button variant="hero" size="xl" className="gap-2" asChild>
                <a href="#notices">
                  <Bell className="w-5 h-5" />
                  View All Notices
                </a>
              </Button>
              <Button variant="hero-secondary" size="xl" className="gap-2" asChild>
                <Link to="/notifications">
                  <Megaphone className="w-5 h-5" />
                  Notifications Feed
                </Link>
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <div className="inline-flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                <span>Live updates</span>
              </div>
              <div className="inline-flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Auto-refreshed</span>
              </div>
              <div className="inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span>Important notices highlighted</span>
              </div>
            </div>
          </div>

          {/* Right: latest notices preview */}
          <div className="relative animate-fade-in" style={{ animationDelay: '0.15s' }}>
            <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 via-accent/10 to-primary/5 rounded-[2rem] blur-2xl -z-10" />
            <div className="glass-card-elevated rounded-3xl p-5 md:p-7 shadow-2xl">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Bell className="w-4 h-4 text-primary" />
                  </div>
                  <h2 className="text-lg md:text-xl font-bold text-foreground">Latest Notices</h2>
                </div>
                <Button variant="ghost" size="sm" className="gap-1.5 text-primary" asChild>
                  <a href="#notices">
                    View all
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </Button>
              </div>

              <div className="space-y-2">
                {isLoading ? (
                  <>
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-background/40">
                        <Skeleton className="w-10 h-10 rounded-lg flex-shrink-0" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-3 w-24" />
                          <Skeleton className="h-4 w-full" />
                        </div>
                      </div>
                    ))}
                  </>
                ) : latest.length === 0 ? (
                  <div className="text-center py-8 md:py-10">
                    <Bell className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-50" />
                    <p className="text-sm text-muted-foreground">No notices available right now.</p>
                  </div>
                ) : (
                  latest.map((item, i) => <LatestNoticeRow key={item.id} item={item} index={i} />)
                )}
              </div>

              {!isLoading && latest.length > 0 && (
                <div className="mt-5 pt-4 border-t border-border/50">
                  <a
                    href="#notices"
                    className="block w-full text-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    Browse the full notices board
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
