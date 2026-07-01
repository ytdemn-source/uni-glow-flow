import { supabase } from "@/integrations/supabase/client";

export interface Note {
  id: string;
  title: string;
  body: string;
  tags: string[];
  file_url: string | null;
  file_name: string | null;
  file_type: string | null;
  created_at: string;
}

export interface NoteComment {
  id: string;
  note_id: string;
  author_name: string;
  body: string;
  created_at: string;
}

const BUCKET = "note-files";

export async function listNotes(): Promise<Note[]> {
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getNote(id: string): Promise<Note | null> {
  const { data, error } = await supabase.from("notes").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}

export async function listComments(noteId: string): Promise<NoteComment[]> {
  const { data, error } = await supabase
    .from("note_comments")
    .select("*")
    .eq("note_id", noteId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function addComment(noteId: string, authorName: string, body: string) {
  const { error } = await supabase
    .from("note_comments")
    .insert({ note_id: noteId, author_name: authorName.trim(), body: body.trim() });
  if (error) throw error;
}

export async function getFileDownloadUrl(path: string): Promise<string | null> {
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, 3600);
  if (error) return null;
  return data.signedUrl;
}

// Admin operations — require an authenticated admin session (RLS enforces it)

export async function adminCreateNote(input: {
  title: string;
  body: string;
  tags: string[];
  file?: File | null;
}) {
  let file_url: string | null = null;
  let file_name: string | null = null;
  let file_type: string | null = null;

  if (input.file) {
    const safe = input.file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80);
    const path = `${crypto.randomUUID()}-${safe}`;
    const { error: upErr } = await supabase.storage
      .from(BUCKET)
      .upload(path, input.file, { contentType: input.file.type || undefined });
    if (upErr) throw upErr;
    file_url = path;
    file_name = input.file.name;
    file_type = input.file.type;
  }

  const { error } = await supabase.from("notes").insert({
    title: input.title.trim().slice(0, 200),
    body: input.body.slice(0, 20000),
    tags: input.tags.slice(0, 12),
    file_url,
    file_name,
    file_type,
  });
  if (error) throw error;
}

export async function adminDeleteNote(id: string) {
  const { data: note } = await supabase.from("notes").select("file_url").eq("id", id).maybeSingle();
  if (note?.file_url) {
    await supabase.storage.from(BUCKET).remove([note.file_url]);
  }
  const { error } = await supabase.from("notes").delete().eq("id", id);
  if (error) throw error;
}

export async function adminDeleteComment(id: string) {
  const { error } = await supabase.from("note_comments").delete().eq("id", id);
  if (error) throw error;
}

export async function adminListRecentComments(limit = 50): Promise<(NoteComment & { note_title?: string })[]> {
  const { data, error } = await supabase
    .from("note_comments")
    .select("*, notes(title)")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []).map((c: NoteComment & { notes?: { title?: string } }) => ({
    ...c,
    note_title: c.notes?.title,
  }));
}
