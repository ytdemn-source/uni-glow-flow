import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Bell, ExternalLink, Inbox, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { NotificationSubscribe } from "@/components/NotificationSubscribe";
import { listBroadcasts } from "@/lib/api/broadcasts";

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hr ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d} day${d === 1 ? "" : "s"} ago`;
  return new Date(iso).toLocaleDateString();
}

export default function NotificationsPage() {
  useEffect(() => {
    document.title = "Notifications — GS Hub";
  }, []);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["broadcasts"],
    queryFn: () => listBroadcasts(100),
    staleTime: 60_000,
  });

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-16 max-w-3xl">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-3">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>
        <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              <Bell className="w-6 h-6 text-primary" /> Notifications
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Announcements and updates broadcast by GS Hub admins.
            </p>
          </div>
          <NotificationSubscribe />
        </div>

        {isLoading && (
          <div className="glass-card rounded-2xl p-8 text-center">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
          </div>
        )}

        {isError && (
          <div className="glass-card rounded-2xl p-6 text-center text-sm text-destructive">
            Could not load notifications. Try again later.
          </div>
        )}

        {!isLoading && data && data.length === 0 && (
          <div className="glass-card rounded-2xl p-8 text-center">
            <Inbox className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
            <h3 className="font-semibold mb-1">No notifications yet</h3>
            <p className="text-sm text-muted-foreground">
              When admins post an update, it will show up here.
            </p>
          </div>
        )}

        <ul className="space-y-3">
          {data?.map((b) => (
            <li
              key={b.id}
              className="glass-card rounded-2xl p-4 md:p-5 hover-lift"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center flex-shrink-0">
                  <Bell className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-3 flex-wrap">
                    <h3 className="font-semibold text-foreground">{b.title}</h3>
                    <span className="text-xs text-muted-foreground">{timeAgo(b.created_at)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap mt-1">
                    {b.body}
                  </p>
                  {b.url && (
                    <a
                      href={b.url}
                      target={b.url.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline mt-2"
                    >
                      Open link <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
