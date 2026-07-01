import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminDeleteComment, adminListRecentComments, type NoteComment } from "@/lib/api/notes";
import { useToast } from "@/hooks/use-toast";

export function CommentsManager() {
  const { toast } = useToast();
  const [items, setItems] = useState<(NoteComment & { note_title?: string })[]>([]);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);
    try { setItems(await adminListRecentComments(100)); } finally { setLoading(false); }
  }
  useEffect(() => { refresh(); }, []);

  async function del(id: string) {
    if (!confirm("Delete this comment?")) return;
    try {
      await adminDeleteComment(id);
      setItems((prev) => prev.filter((c) => c.id !== id));
      toast({ title: "Deleted" });
    } catch (err) {
      toast({ title: "Delete failed", description: (err as Error).message, variant: "destructive" });
    }
  }

  if (loading) return <p className="text-sm text-muted-foreground">Loading…</p>;
  if (items.length === 0) return <p className="text-sm text-muted-foreground">No comments yet.</p>;

  return (
    <ul className="space-y-2">
      {items.map((c) => (
        <li key={c.id} className="glass-card rounded-lg p-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-xs text-muted-foreground mb-1">
              on <span className="text-foreground">{c.note_title || "note"}</span> ·{" "}
              {new Date(c.created_at).toLocaleString()}
            </div>
            <div className="text-sm font-medium">{c.author_name}</div>
            <p className="text-sm text-foreground/90 whitespace-pre-wrap">{c.body}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={() => del(c.id)} className="text-destructive">
            <Trash2 className="w-4 h-4" />
          </Button>
        </li>
      ))}
    </ul>
  );
}
