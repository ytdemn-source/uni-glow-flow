import { createClient } from "@supabase/supabase-js";
import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "search_notes",
  title: "Search notes",
  description: "Search study notes by title or body text.",
  inputSchema: {
    query: z.string().trim().min(1).describe("Text to search for in note titles and bodies."),
    limit: z.number().int().min(1).max(50).optional(),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ query, limit }) => {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.SUPABASE_ANON_KEY!,
      { auth: { persistSession: false } },
    );
    const escaped = query.replace(/[%_,]/g, (m) => `\\${m}`);
    const { data, error } = await supabase
      .from("notes")
      .select("id,title,body,tags,file_url,created_at")
      .or(`title.ilike.%${escaped}%,body.ilike.%${escaped}%`)
      .order("created_at", { ascending: false })
      .limit(limit ?? 20);
    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? [], null, 2) }],
      structuredContent: { notes: data ?? [] },
    };
  },
});
