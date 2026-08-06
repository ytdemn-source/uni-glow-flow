import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Bell,
  ArrowRight,
  BookOpen,
  Library,
  FileText,
  Megaphone,
  GraduationCap,
} from 'lucide-react';
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
  source: 'college' | 'admin';
  sourceLabel: string;
}

function NoticeRow({ item }: { item: NoticeLike }) {
  const formattedDate = new Date(item.date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group block p-3 border-l-4 transition-colors bg-secondary/40 hover:bg-secondary ${
        item.source === 'admin' ? 'border-gold' : 'border-accent'
      }`}
    >
      <div className="flex justify-between gap-2 eyebrow text-accent mb-1">
        <span>{item.sourceLabel}</span>
        <span className="text-muted-foreground">{formattedDate}</span>
      </div>
      <p className="text-sm font-semibold leading-snug text-card-foreground line-clamp-2">
        {item.title}
      </p>
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
      source: 'admin' as const,
      sourceLabel: 'Admin',
    }));
    return [...adminNotices, ...collegeNotices]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 4);
  }, [collegeData, broadcasts]);

  const isLoading = collegeLoading || adminLoading;
  const noticeCount = (collegeData?.notices?.length ?? 0) + (broadcasts?.length ?? 0);

  return (
    <section className="pt-24 md:pt-28 pb-8 md:pb-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Hero module */}
          <div className="md:col-span-8 tile-emerald p-7 md:p-10 flex flex-col justify-between animate-fade-in-up">
            <div className="relative z-10">
              <span className="eyebrow text-gold block mb-5">
                Study Desk // Everything in one place
              </span>

              <div className="flex items-start gap-4 mb-6">
                <img
                  src={logo}
                  alt="A Help Deck logo"
                  className="w-14 h-14 md:w-16 md:h-16 object-contain flex-shrink-0"
                />
                <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-[0.9] italic">
                  A Help<br />Deck.
                </h1>
              </div>

              <p className="max-w-md text-base md:text-lg leading-relaxed font-medium bg-background text-foreground p-4 rounded-2xl">
                Get all your study solutions in one deck — live notices, shared
                subject notes, and free study tools, without digging through
                scattered sites.
              </p>
            </div>

            <div className="mt-8 md:mt-12 flex flex-wrap gap-3 relative z-10">
              <a
                href="#notices"
                className="inline-flex items-center gap-2 bg-gold text-gold-foreground px-6 py-3 rounded-full font-bold hover:brightness-110 transition"
              >
                <Bell className="w-4 h-4" />
                View all notices
              </a>
              <Link
                to="/notes"
                className="inline-flex items-center gap-2 border border-primary-foreground/40 px-6 py-3 rounded-full font-bold hover:bg-primary-foreground/10 transition"
              >
                <BookOpen className="w-4 h-4" />
                Notes library
              </Link>
            </div>

            <div className="absolute top-0 right-0 opacity-10 w-64 h-64 border-r-8 border-t-8 border-gold rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Latest notices feed */}
          <div className="md:col-span-4 tile p-6 flex flex-col animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-display font-bold text-lg uppercase tracking-tight">
                Latest Notices
              </h2>
              <span className="flex items-center gap-1.5 eyebrow text-accent">
                <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                Live
              </span>
            </div>

            <div className="space-y-3 overflow-y-auto max-h-[360px] pr-1">
              {isLoading ? (
                [0, 1, 2].map((i) => (
                  <div key={i} className="p-3 space-y-2 bg-secondary/40">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))
              ) : latest.length === 0 ? (
                <div className="text-center py-10">
                  <Bell className="w-9 h-9 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-sm text-muted-foreground">
                    No notices available right now.
                  </p>
                </div>
              ) : (
                latest.map((item) => <NoticeRow key={item.id} item={item} />)
              )}
            </div>

            <a
              href="#notices"
              className="mt-auto pt-4 eyebrow text-accent text-center hover:underline"
            >
              View all updates →
            </a>
          </div>

          {/* Status tile */}
          <div className="md:col-span-3 tile-green p-6 flex flex-col justify-between animate-fade-in" style={{ animationDelay: '0.15s' }}>
            <div>
              <p className="eyebrow opacity-75 mb-1">Desk status</p>
              <h3 className="font-display text-4xl font-bold">
                {isLoading ? '—' : noticeCount}
              </h3>
              <p className="text-xs font-medium opacity-90">Notices tracked right now</p>
            </div>
            <div className="mt-6 space-y-1">
              <div className="flex justify-between items-center py-2 border-b border-current/20">
                <span className="text-sm">College feed</span>
                <span className="text-[10px] bg-gold text-gold-foreground px-2 py-0.5 rounded-full font-bold">
                  Live
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-current/20">
                <span className="text-sm">Admin posts</span>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">
                  {broadcasts?.length ?? 0} new
                </span>
              </div>
            </div>
          </div>

          {/* Library tile */}
          <div className="md:col-span-6 tile p-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-4 mb-5">
              <div className="bg-primary text-gold p-3 rounded-2xl">
                <Library className="w-6 h-6" />
              </div>
              <h3 className="font-display text-2xl font-bold">Help Library</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                to="/notes"
                className="p-4 rounded-2xl bg-secondary hover:bg-gold hover:text-gold-foreground transition-all group"
              >
                <p className="font-bold flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Shared notes
                </p>
                <p className="text-xs text-muted-foreground group-hover:text-gold-foreground/80 mt-1">
                  Subject-wise notes uploaded for students
                </p>
              </Link>
              <Link
                to="/notifications"
                className="p-4 rounded-2xl bg-secondary hover:bg-gold hover:text-gold-foreground transition-all group"
              >
                <p className="font-bold flex items-center gap-2">
                  <Megaphone className="w-4 h-4" />
                  Announcements
                </p>
                <p className="text-xs text-muted-foreground group-hover:text-gold-foreground/80 mt-1">
                  Every update posted by the admin team
                </p>
              </Link>
            </div>
          </div>

          {/* Quick jump tile */}
          <div className="md:col-span-3 tile-gold dot-grid p-6 animate-fade-in" style={{ animationDelay: '0.25s' }}>
            <div className="relative z-10">
              <h3 className="font-display text-xl font-bold mb-4 uppercase">Jump to</h3>
              <ul className="space-y-3">
                {[
                  { label: 'Subjects', href: '#departments' },
                  { label: 'Quick links', href: '#quick-links' },
                  { label: 'Student services', href: '#services' },
                ].map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="flex items-center gap-2 text-sm font-bold link-sweep"
                    >
                      <span className="w-1.5 h-1.5 bg-current rotate-45" />
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-4 border-t border-current/25">
                <p className="eyebrow flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5" />
                  Built for students
                </p>
                <a
                  href="#contact"
                  className="text-sm font-bold inline-flex items-center gap-1 mt-1 link-sweep"
                >
                  Need help? Contact us
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
