import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, Loader2, Megaphone, Send, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AdminNotificationHistory } from "@/components/AdminNotificationHistory";
import { AdminSubscriptionsPanel } from "@/components/AdminSubscriptionsPanel";
import {
  adminCreateBroadcast,
  adminDeleteBroadcast,
  listBroadcasts,
} from "@/lib/api/broadcasts";

export function NotificationsManager() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [url, setUrl] = useState("/notifications");
  const [alsoPush, setAlsoPush] = useState(true);
  const [busy, setBusy] = useState(false);

  const { data: broadcasts } = useQuery({
    queryKey: ["broadcasts", "admin"],
    queryFn: () => listBroadcasts(50),
  });

  async function broadcast() {
    if (!title.trim() || !body.trim()) {
      toast({ title: "Add a title and message", variant: "destructive" });
      return;
    }
    setBusy(true);
    try {
      await adminCreateBroadcast({ title, body, url });
      let pushSummary = "";
      if (alsoPush) {
        const { data, error } = await supabase.functions.invoke("send-notification", {
          body: { title, body, url: url || "/notifications" },
        });
        if (error) throw error;
        pushSummary = ` · ${data?.sent ?? 0} push delivered`;
      }
      toast({ title: "Announcement posted", description: `Saved to Notifications${pushSummary}` });
      setTitle(""); setBody("");
      qc.invalidateQueries({ queryKey: ["broadcasts"] });
    } catch (err) {
      toast({ title: "Failed", description: (err as Error).message, variant: "destructive" });
    } finally { setBusy(false); }
  }

  async function remove(id: string) {
    if (!confirm("Delete this announcement?")) return;
    try {
      await adminDeleteBroadcast(id);
      qc.invalidateQueries({ queryKey: ["broadcasts"] });
    } catch (err) {
      toast({ title: "Delete failed", description: (err as Error).message, variant: "destructive" });
    }
  }

  async function checkNew() {
    setBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke("check-new-notices", {
        body: { triggeredBy: "manual" },
      });
      if (error) throw error;
      toast({ title: "Check complete", description: `${data?.newNotices ?? 0} new, ${data?.notificationsSent ?? 0} sent` });
    } catch (err) {
      toast({ title: "Failed", description: (err as Error).message, variant: "destructive" });
    } finally { setBusy(false); }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="glass-card rounded-xl p-4 space-y-3 md:col-span-2">
        <div className="flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Broadcast an announcement</h3>
        </div>
        <p className="text-xs text-muted-foreground">
          Posted to the public Notifications page. Optionally sends a push to subscribed users.
        </p>
        <div>
          <Label htmlFor="bt">Title</Label>
          <Input id="bt" placeholder="e.g. Semester exam schedule updated" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="bb">Message</Label>
          <Textarea id="bb" rows={3} placeholder="Details students should see" value={body} onChange={(e) => setBody(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="bu">Link (optional)</Label>
          <Input id="bu" placeholder="/notifications or https://..." value={url} onChange={(e) => setUrl(e.target.value)} />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <Checkbox checked={alsoPush} onCheckedChange={(v) => setAlsoPush(Boolean(v))} />
          Also send push notification to subscribers
        </label>
        <div className="flex flex-wrap gap-2">
          <Button onClick={broadcast} disabled={busy}>
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Post announcement
          </Button>
          <Button onClick={checkNew} disabled={busy} variant="outline">
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bell className="w-4 h-4" />} Check for new notices
          </Button>
        </div>
      </div>

      <div className="glass-card rounded-xl p-4 md:col-span-2">
        <h3 className="font-semibold mb-3">Recent announcements</h3>
        {!broadcasts?.length ? (
          <p className="text-sm text-muted-foreground">No announcements yet.</p>
        ) : (
          <ul className="space-y-2">
            {broadcasts.map((b) => (
              <li key={b.id} className="flex items-start justify-between gap-3 rounded-lg border border-border/50 p-3">
                <div className="min-w-0">
                  <div className="font-medium truncate">{b.title}</div>
                  <div className="text-xs text-muted-foreground line-clamp-2">{b.body}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">
                    {new Date(b.created_at).toLocaleString()}
                  </div>
                </div>
                <Button size="icon" variant="ghost" onClick={() => remove(b.id)} aria-label="Delete">
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="glass-card rounded-xl p-4">
        <h3 className="font-semibold mb-3">Push history</h3>
        <AdminNotificationHistory />
      </div>

      <div className="glass-card rounded-xl p-4">
        <AdminSubscriptionsPanel />
      </div>
    </div>
  );
}
