import { Clock, Radio, Inbox, ExternalLink, Megaphone, RefreshCw, School, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useQuery } from '@tanstack/react-query';
import { listBroadcasts } from '@/lib/api/broadcasts';
import { noticesApi } from '@/lib/api/notices';
import { NotificationSubscribe } from './NotificationSubscribe';
import { NoticeCard } from './NoticeCard';
import { NoticeSearch } from './NoticeSearch';
import { NoticeCategoryFilter } from './NoticeCategoryFilter';
import { fuzzySearch } from '@/lib/fuzzySearch';

function RowSkeleton({ index }: { index: number }) {
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

type Source = 'college' | 'university' | 'admin';

export function NoticesSection() {
  const { ref, isVisible } = useScrollReveal<HTMLElement>();
  const [source, setSource] = useState<Source>('college');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string | null>(null);

  const {
    data: collegeData,
    isLoading: collegeLoading,
    refetch: refetchCollege,
    isRefetching: collegeRefetching,
  } = useQuery({
    queryKey: ['college-notices'],
    queryFn: () => noticesApi.fetchNotices(),
    staleTime: 5 * 60_000,
    enabled: source === 'college',
  });

  const collegeNotices = collegeData?.notices ?? [];

  const {
    data: buData,
    isLoading: buLoading,
    refetch: refetchBU,
    isRefetching: buRefetching,
  } = useQuery({
    queryKey: ['bu-notices'],
    queryFn: () => noticesApi.fetchBUNotices(),
    staleTime: 10 * 60_000,
    enabled: source === 'university',
  });

  const buNotices = buData?.notices ?? [];

  const { data: broadcasts = [], isLoading: adminLoading } = useQuery({
    queryKey: ['broadcasts', 'notices-section'],
    queryFn: () => listBroadcasts(50),
    staleTime: 60_000,
    enabled: source === 'admin',
  });

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const n of collegeNotices) {
      const c = n.category || 'general';
      counts[c] = (counts[c] || 0) + 1;
    }
    return counts;
  }, [collegeNotices]);

  const filteredCollege = useMemo(() => {
    const byCategory = category
      ? collegeNotices.filter((n) => (n.category || 'general') === category)
      : collegeNotices;
    if (!search.trim()) return byCategory;
    return fuzzySearch(byCategory, search, (n) => n.title).map((r) => r.item);
  }, [collegeNotices, category, search]);

  const filteredBU = useMemo(() => {
    if (!search.trim()) return buNotices;
    return fuzzySearch(buNotices, search, (n) => n.title).map((r) => r.item);
  }, [buNotices, search]);

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
                Auto-refreshed
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-1 md:mb-2">
                  Galsi College Notices, Results & Syllabus
                </h2>
                <p className="text-sm md:text-base text-muted-foreground max-w-lg">
                  Live college notices scraped straight from the official site, plus admin announcements.
                </p>
              </div>
              <div className="flex items-center gap-2 self-start md:self-auto">
                <NotificationSubscribe />
                <Button variant="outline" size="sm" asChild>
                  <Link to="/notifications" className="gap-2">
                    <Megaphone className="w-4 h-4" />
                    <span className="hidden sm:inline">Feed</span>
                  </Link>
                </Button>
              </div>
            </div>

            {/* Source toggle */}
            <div className="mt-4 md:mt-6 flex items-center gap-2">
              <div className="inline-flex p-1 rounded-full bg-muted/60 border border-border/50">
                <button
                  onClick={() => setSource('college')}
                  className={`inline-flex items-center gap-1.5 px-3 md:px-4 py-1.5 rounded-full text-xs md:text-sm font-medium transition-all ${
                    source === 'college'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <School className="w-3.5 h-3.5" />
                  College notices
                </button>
                <button
                  onClick={() => setSource('university')}
                  className={`inline-flex items-center gap-1.5 px-3 md:px-4 py-1.5 rounded-full text-xs md:text-sm font-medium transition-all ${
                    source === 'university'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  University (Arts)
                </button>
                <button
                  onClick={() => setSource('admin')}
                  className={`inline-flex items-center gap-1.5 px-3 md:px-4 py-1.5 rounded-full text-xs md:text-sm font-medium transition-all ${
                    source === 'admin'
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Megaphone className="w-3.5 h-3.5" />
                  Admin
                </button>
              </div>
              {source === 'college' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => refetchCollege()}
                  disabled={collegeRefetching}
                  className="gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${collegeRefetching ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline text-xs">Refresh</span>
                </Button>
              )}
              {source === 'university' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => refetchBU()}
                  disabled={buRefetching}
                  className="gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${buRefetching ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline text-xs">Refresh</span>
                </Button>
              )}
            </div>
          </div>

          {/* College source */}
          {source === 'college' && (
            <>
              <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
                <NoticeSearch value={search} onChange={setSearch} />
                <div className="flex-1 min-w-0">
                  <NoticeCategoryFilter
                    selectedCategory={category}
                    onCategoryChange={setCategory}
                    categoryCounts={categoryCounts}
                  />
                </div>
              </div>

              {collegeLoading && collegeNotices.length === 0 ? (
                <div className="space-y-3 md:space-y-4">
                  {[0, 1, 2, 3].map((i) => (
                    <RowSkeleton key={i} index={i} />
                  ))}
                </div>
              ) : collegeData && !collegeData.success ? (
                <div className="glass-card p-8 text-center">
                  <p className="text-sm text-muted-foreground mb-3">
                    Couldn't load college notices right now.
                  </p>
                  <Button size="sm" variant="outline" onClick={() => refetchCollege()}>
                    Try again
                  </Button>
                </div>
              ) : filteredCollege.length === 0 ? (
                <div className="glass-card p-8 md:p-12 text-center">
                  <Inbox className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No notices match
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Try clearing the search or category filter.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 md:space-y-4">
                  {filteredCollege.map((n, i) => (
                    <NoticeCard key={n.id} notice={n} index={i} />
                  ))}
                </div>
              )}
            </>
          )}

          {/* Admin source */}
          {source === 'admin' && (
            <>
              {adminLoading && broadcasts.length === 0 ? (
                <div className="space-y-3 md:space-y-4">
                  {[0, 1, 2].map((i) => (
                    <RowSkeleton key={i} index={i} />
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
            </>
          )}
        </div>
      </div>
    </section>
  );
}
