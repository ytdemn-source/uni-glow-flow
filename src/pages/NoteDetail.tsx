import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Download, Loader2 } from "lucide-react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { NoteComments } from "@/components/NoteComments";
import { getFileDownloadUrl, getNote, type Note } from "@/lib/api/notes";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

export default function NoteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      setLoading(true);
      try {
        const n = await getNote(id);
        setNote(n);
        document.title = n ? `${n.title} — A Help Deck` : "Note — A Help Deck";
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  async function handleDownload() {
    if (!note?.file_url) return;
    setDownloading(true);
    try {
      const url = await getFileDownloadUrl(note.file_url);
      if (url) window.open(url, "_blank", "noopener,noreferrer");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-16 max-w-3xl">
        <Link to="/notes" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="w-4 h-4" /> All notes
        </Link>

        {loading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : !note ? (
          <p className="text-muted-foreground">Note not found.</p>
        ) : (
          <>
            <article className="glass-card rounded-2xl p-6 md:p-8">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{note.title}</h1>
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mb-4">
                <span>{formatDate(note.created_at)}</span>
                {note.tags.map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded-full bg-secondary/60 text-foreground/80">
                    {t}
                  </span>
                ))}
              </div>

              {note.body && (
                <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap text-foreground/90 leading-relaxed mb-6">
                  {note.body}
                </div>
              )}

              {note.file_url && (
                <Button onClick={handleDownload} disabled={downloading}>
                  {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  {note.file_name || "Download attachment"}
                </Button>
              )}
            </article>

            <NoteComments noteId={note.id} />
          </>
        )}
      </main>
    </div>
  );
}
