import { supabase } from "@/integrations/supabase/client";

export interface Broadcast {
  id: string;
  title: string;
  body: string;
  url: string | null;
  created_at: string;
}

export async function listBroadcasts(limit = 50): Promise<Broadcast[]> {
  const { data, error } = await supabase
    .from("broadcasts")
    .select("id,title,body,url,created_at")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as Broadcast[];
}

export async function adminCreateBroadcast(input: {
  title: string;
  body: string;
  url?: string | null;
}) {
  const { data, error } = await supabase
    .from("broadcasts")
    .insert({
      title: input.title.trim().slice(0, 200),
      body: input.body.trim().slice(0, 4000),
      url: input.url?.trim() || null,
    })
    .select()
    .single();
  if (error) throw error;
  return data as Broadcast;
}

export async function adminDeleteBroadcast(id: string) {
  const { error } = await supabase.from("broadcasts").delete().eq("id", id);
  if (error) throw error;
}
