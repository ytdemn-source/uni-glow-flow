import { useEffect, useState } from "react";
import { Loader2, Plus, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { NOTE_TAGS } from "@/lib/noteTags";
import { adminCreateNote, adminDeleteNote, listNotes, type Note } from "@/lib/api/notes";
import { adminCreateBroadcast } from "@/lib/api/broadcasts";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function NotesManager() {
  const { toast } = useToast();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [notify, setNotify] = useState(true);
  const [alsoPush, setAlsoPush] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  async function refresh() {
    setLoading(true);
    try { setNotes(await listNotes()); } finally { setLoading(false); }
  }

  useEffect(() => { refresh(); }, []);

  function toggleTag(t: string) {
    setTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    if (file && file.size > 10 * 1024 * 1024) {
      toast({ title: "File too large", description: "Maximum 10 MB.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      await adminCreateNote({ title, body, tags, file });

      let notifySummary = "";
      if (notify) {
        const notifTitle = `New note: ${title.trim().slice(0, 140)}`;
        const notifBody = body.trim().slice(0, 300) || "A new note has been published.";
        try {
          await adminCreateBroadcast({ title: notifTitle, body: notifBody, url: "/notes" });
        } catch (err) {
          console.error("broadcast failed", err);
        }
        if (alsoPush) {
          const { data, error } = await supabase.functions.invoke("send-notification", {
            body: { title: notifTitle, body: notifBody, url: "/notes" },
          });
          if (error) throw error;
          notifySummary = ` · ${data?.sent ?? 0} push delivered`;
        } else {
          notifySummary = " · announcement posted";
        }
      }

      toast({ title: "Note published", description: notifySummary || undefined });
      setTitle(""); setBody(""); setTags([]); setFile(null);
      setOpen(false);
      refresh();
    } catch (err) {
      toast({ title: "Publish failed", description: (err as Error).message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  }

  async function del(id: string) {
    if (!confirm("Delete this note?")) return;
    try {
      await adminDeleteNote(id);
      toast({ title: "Deleted" });
      refresh();
    } catch (err) {
      toast({ title: "Delete failed", description: (err as Error).message, variant: "destructive" });
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold">Notes ({notes.length})</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="w-4 h-4" /> Upload note</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>New note</DialogTitle></DialogHeader>
            <form onSubmit={submit} className="space-y-4">
              <div>
                <Label htmlFor="t">Title</Label>
                <Input id="t" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200} required />
              </div>
              <div>
                <Label htmlFor="b">Content</Label>
                <Textarea id="b" rows={6} maxLength={20000} value={body} onChange={(e) => setBody(e.target.value)} />
              </div>
              <div>
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {NOTE_TAGS.map((t) => (
                    <button
                      type="button" key={t} onClick={() => toggleTag(t)}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                        tags.includes(t)
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >{t}</button>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="f">Attachment (PDF/image, ≤10 MB)</Label>
                <Input id="f" type="file" accept="application/pdf,image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
              </div>

              <div className="space-y-2 rounded-lg border border-border/50 p-3">
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox checked={notify} onCheckedChange={(v) => setNotify(Boolean(v))} />
                  Post announcement about this note
                </label>
                <label className={`flex items-center gap-2 text-sm ${!notify ? "opacity-50" : ""}`}>
                  <Checkbox
                    checked={notify && alsoPush}
                    disabled={!notify}
                    onCheckedChange={(v) => setAlsoPush(Boolean(v))}
                  />
                  Also send push notification to subscribers
                </label>
              </div>

              <Button type="submit" disabled={submitting} className="w-full">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                Publish
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : notes.length === 0 ? (
        <p className="text-sm text-muted-foreground">No notes yet.</p>
      ) : (
        <ul className="space-y-2">
          {notes.map((n) => (
            <li key={n.id} className="glass-card rounded-lg p-3 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="font-medium truncate">{n.title}</div>
                <div className="text-xs text-muted-foreground">
                  {new Date(n.created_at).toLocaleDateString()} · {n.tags.join(", ") || "no tags"}
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => del(n.id)} className="text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
