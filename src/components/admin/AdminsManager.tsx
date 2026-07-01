import { useEffect, useState } from "react";
import { Loader2, Trash2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

interface AdminUser { user_id: string; email: string; created_at: string }

export function AdminsManager() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  async function refresh() {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-users", { body: { action: "list" } });
      if (error) throw error;
      setAdmins(data?.admins ?? []);
    } catch (err) {
      toast({ title: "Failed to load admins", description: (err as Error).message, variant: "destructive" });
    } finally { setLoading(false); }
  }

  useEffect(() => { refresh(); }, []);

  async function add() {
    if (!email.trim()) return;
    setBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-users", {
        body: { action: "grant", email: email.trim() },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setEmail("");
      toast({ title: "Admin added" });
      refresh();
    } catch (err) {
      toast({ title: "Failed", description: (err as Error).message, variant: "destructive" });
    } finally { setBusy(false); }
  }

  async function revoke(userId: string) {
    if (userId === user?.id) {
      toast({ title: "Cannot remove yourself", variant: "destructive" });
      return;
    }
    if (!confirm("Remove admin?")) return;
    try {
      const { data, error } = await supabase.functions.invoke("admin-users", {
        body: { action: "revoke", user_id: userId },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      refresh();
    } catch (err) {
      toast({ title: "Failed", description: (err as Error).message, variant: "destructive" });
    }
  }

  return (
    <div className="space-y-4">
      <div className="glass-card rounded-xl p-4">
        <h3 className="font-semibold mb-3">Add admin</h3>
        <div className="flex gap-2">
          <Input
            type="email" placeholder="user@example.com"
            value={email} onChange={(e) => setEmail(e.target.value)}
          />
          <Button onClick={add} disabled={busy}>
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />} Add
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          The user must have already signed up. Their email must match exactly.
        </p>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Current admins ({admins.length})</h3>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : (
          <ul className="space-y-2">
            {admins.map((a) => (
              <li key={a.user_id} className="glass-card rounded-lg p-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{a.email}</div>
                  <div className="text-xs text-muted-foreground">
                    added {new Date(a.created_at).toLocaleDateString()}
                    {a.user_id === user?.id && " · you"}
                  </div>
                </div>
                <Button
                  variant="ghost" size="icon" className="text-destructive"
                  onClick={() => revoke(a.user_id)} disabled={a.user_id === user?.id}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
