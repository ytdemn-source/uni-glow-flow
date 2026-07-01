import { useState } from "react";
import { Bell, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AdminNotificationHistory } from "@/components/AdminNotificationHistory";
import { AdminSubscriptionsPanel } from "@/components/AdminSubscriptionsPanel";

export function NotificationsManager() {
  const { toast } = useToast();
  const [title, setTitle] = useState("Notice");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);

  async function send() {
    setBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-notification", {
        body: { title, body, url: "/" },
      });
      if (error) throw error;
      toast({ title: "Sent", description: `${data?.sent ?? 0} delivered, ${data?.failed ?? 0} failed` });
    } catch (err) {
      toast({ title: "Failed", description: (err as Error).message, variant: "destructive" });
    } finally { setBusy(false); }
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
      <div className="glass-card rounded-xl p-4 space-y-3">
        <h3 className="font-semibold">Send push notification</h3>
        <div>
          <Label htmlFor="nt">Title</Label>
          <Input id="nt" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="nb">Message</Label>
          <Input id="nb" value={body} onChange={(e) => setBody(e.target.value)} />
        </div>
        <Button onClick={send} disabled={busy} className="w-full">
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Send
        </Button>
        <Button onClick={checkNew} disabled={busy} variant="outline" className="w-full">
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bell className="w-4 h-4" />} Check for new notices
        </Button>
      </div>

      <div className="glass-card rounded-xl p-4">
        <h3 className="font-semibold mb-3">History</h3>
        <AdminNotificationHistory />
      </div>

      <div className="glass-card rounded-xl p-4 md:col-span-2">
        <AdminSubscriptionsPanel />
      </div>
    </div>
  );
}
