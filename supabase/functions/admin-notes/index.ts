import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const ADMIN_CODE = "jakir03";
const BUCKET = "note-files";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json();
    const { adminCode, action, payload } = body ?? {};

    if (adminCode !== ADMIN_CODE) return json({ error: "Invalid admin code" }, 401);

    if (action === "upload-url") {
      const fileName = String(payload?.fileName ?? "").replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80);
      if (!fileName) return json({ error: "fileName required" }, 400);
      const path = `${crypto.randomUUID()}-${fileName}`;
      const { data, error } = await supabase.storage.from(BUCKET).createSignedUploadUrl(path);
      if (error) return json({ error: error.message }, 500);
      return json({ path, token: data.token, signedUrl: data.signedUrl });
    }

    if (action === "create") {
      const title = String(payload?.title ?? "").trim().slice(0, 200);
      const noteBody = String(payload?.body ?? "").slice(0, 20000);
      const tags = Array.isArray(payload?.tags) ? payload.tags.slice(0, 12).map((t: unknown) => String(t).slice(0, 40)) : [];
      const file_url = payload?.file_url ? String(payload.file_url).slice(0, 500) : null;
      const file_name = payload?.file_name ? String(payload.file_name).slice(0, 200) : null;
      const file_type = payload?.file_type ? String(payload.file_type).slice(0, 100) : null;
      if (!title) return json({ error: "Title required" }, 400);
      const { data, error } = await supabase
        .from("notes")
        .insert({ title, body: noteBody, tags, file_url, file_name, file_type })
        .select()
        .single();
      if (error) return json({ error: error.message }, 500);
      return json({ note: data });
    }

    if (action === "delete") {
      const id = String(payload?.id ?? "");
      if (!id) return json({ error: "id required" }, 400);
      const { data: note } = await supabase.from("notes").select("file_url").eq("id", id).maybeSingle();
      if (note?.file_url) {
        await supabase.storage.from(BUCKET).remove([note.file_url]);
      }
      const { error } = await supabase.from("notes").delete().eq("id", id);
      if (error) return json({ error: error.message }, 500);
      return json({ ok: true });
    }

    if (action === "delete-comment") {
      const id = String(payload?.id ?? "");
      if (!id) return json({ error: "id required" }, 400);
      const { error } = await supabase.from("note_comments").delete().eq("id", id);
      if (error) return json({ error: error.message }, 500);
      return json({ ok: true });
    }

    return json({ error: "Unknown action" }, 400);
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});
