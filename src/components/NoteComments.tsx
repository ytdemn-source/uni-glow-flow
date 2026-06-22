import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Trash2 } from "lucide-react";
import { addComment, adminDeleteComment, listComments, type NoteComment } from "@/lib/api/notes";
import { useToast } from "@/hooks/use-toast";

interface Props {
  noteId: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString();
}

export function NoteComments({ noteId }: Props) {
  const { toast } = useToast();
  const [comments, setComments] = useState<NoteComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState(() => localStorage.getItem("galsi_comment_name") || "");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function refresh() {
    setLoading(true);
    try {
      setComments(await listComments(noteId));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noteId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !body.trim()) return;
    setSubmitting(true);
    try {
      await addComment(noteId, name, body);
      localStorage.setItem("galsi_comment_name", name.trim());
      setBody("");
      await refresh();
    } catch (err) {
      toast({ title: "Could not post comment", description: (err as Error).message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    const code = window.prompt("Admin code to delete:");
    if (!code) return;
    try {
      await adminDeleteComment(code, id);
      await refresh();
    } catch (err) {
      toast({ title: "Delete failed", description: (err as Error).message, variant: "destructive" });
    }
  }

  return (
    <section className="mt-10">
      <h2 className="text-xl font-bold mb-4">Discussion</h2>
      <form onSubmit={handleSubmit} className="glass-card p-4 rounded-xl space-y-3 mb-6">
        <Input
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={60}
          required
        />
        <Textarea
          placeholder="Share a question or help..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={3}
          maxLength={1000}
          required
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={submitting} size="sm">
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Post comment"}
          </Button>
        </div>
      </form>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading comments…</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-muted-foreground">No comments yet. Be the first!</p>
      ) : (
        <ul className="space-y-3">
          {comments.map((c) => (
            <li key={c.id} className="glass-card p-4 rounded-xl">
              <div className="flex items-baseline justify-between gap-2 mb-1">
                <span className="font-semibold text-sm text-foreground">{c.author_name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{formatDate(c.created_at)}</span>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                    aria-label="Delete comment"
                    title="Admin delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-foreground/90 whitespace-pre-wrap">{c.body}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
