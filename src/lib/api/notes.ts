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

async function callAdmin(adminCode: string, action: string, payload: unknown) {
  const { data, error } = await supabase.functions.invoke("admin-notes", {
    body: { adminCode, action, payload },
  });
  if (error) throw new Error(error.message);
  if (data?.error) throw new Error(data.error);
  return data;
}

export async function adminCreateNote(
  adminCode: string,
  input: {
    title: string;
    body: string;
    tags: string[];
    file?: File | null;
  },
) {
  let file_url: string | null = null;
  let file_name: string | null = null;
  let file_type: string | null = null;

  if (input.file) {
    const { path, signedUrl } = await callAdmin(adminCode, "upload-url", {
      fileName: input.file.name,
    });
    const putRes = await fetch(signedUrl, {
      method: "PUT",
      headers: { "Content-Type": input.file.type || "application/octet-stream" },
      body: input.file,
    });
    if (!putRes.ok) throw new Error("File upload failed");
    file_url = path;
    file_name = input.file.name;
    file_type = input.file.type;
  }

  return callAdmin(adminCode, "create", {
    title: input.title,
    body: input.body,
    tags: input.tags,
    file_url,
    file_name,
    file_type,
  });
}

export async function adminDeleteNote(adminCode: string, id: string) {
  return callAdmin(adminCode, "delete", { id });
}

export async function adminDeleteComment(adminCode: string, id: string) {
  return callAdmin(adminCode, "delete-comment", { id });
}
