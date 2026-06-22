import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, FileText, Paperclip, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { NoteUploadDialog } from "@/components/NoteUploadDialog";
import { adminDeleteNote, listNotes, type Note } from "@/lib/api/notes";
import { NOTE_TAGS } from "@/lib/noteTags";
import { useToast } from "@/hooks/use-toast";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

export default function NotesPage() {
  const { toast } = useToast();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    try {
      setNotes(await listNotes());
    } catch (err) {
      toast({ title: "Failed to load notes", description: (err as Error).message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    document.title = "Notes & Help — GS Hub";
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return notes.filter((n) => {
      if (activeTag && !n.tags.includes(activeTag)) return false;
      if (q && !n.title.toLowerCase().includes(q) && !n.body.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [notes, search, activeTag]);

  const availableTags = useMemo(() => {
    const used = new Set<string>();
    notes.forEach((n) => n.tags.forEach((t) => used.add(t)));
    return NOTE_TAGS.filter((t) => used.has(t));
  }, [notes]);

  async function handleDelete(id: string) {
    const code = window.prompt("Admin code to delete this note:");
    if (!code) return;
    try {
      await adminDeleteNote(code, id);
      toast({ title: "Note deleted" });
      await refresh();
    } catch (err) {
      toast({ title: "Delete failed", description: (err as Error).message, variant: "destructive" });
    }
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-16 max-w-4xl">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>

        <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Notes & Help</h1>
            <p className="text-muted-foreground">
              Study notes, materials and helpful text shared for Galsi Mahavidyalaya students.
            </p>
          </div>
          <NoteUploadDialog onCreated={refresh} />
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {availableTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6 sticky top-16 md:top-20 z-10 bg-background/80 backdrop-blur-sm py-2 -mx-1 px-1">
            <button
              onClick={() => setActiveTag(null)}
              className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                activeTag === null
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              All
            </button>
            {availableTags.map((t) => (
              <button
                key={t}
                onClick={() => setActiveTag(t === activeTag ? null : t)}
                className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                  activeTag === t
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <p className="text-muted-foreground">Loading notes…</p>
        ) : filtered.length === 0 ? (
          <div className="glass-card p-8 rounded-xl text-center">
            <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">
              {notes.length === 0 ? "No notes have been shared yet." : "No notes match your filters."}
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {filtered.map((n) => (
              <li key={n.id} className="glass-card rounded-xl hover-lift">
                <div className="p-4 md:p-5 flex items-start gap-3">
                  <Link to={`/notes/${n.id}`} className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h2 className="font-semibold text-foreground">{n.title}</h2>
                      {n.file_url && (
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <Paperclip className="w-3 h-3" /> attachment
                        </span>
                      )}
                    </div>
                    {n.body && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{n.body}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatDate(n.created_at)}</span>
                      {n.tags.map((t) => (
                        <span key={t} className="px-2 py-0.5 rounded-full bg-secondary/60 text-foreground/80">
                          {t}
                        </span>
                      ))}
                    </div>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive flex-shrink-0"
                    onClick={() => handleDelete(n.id)}
                    aria-label="Admin delete note"
                    title="Admin delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
