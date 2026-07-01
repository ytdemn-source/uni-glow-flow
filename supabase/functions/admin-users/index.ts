import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const admin = createClient(
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
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) return json({ error: "Unauthorized" }, 401);
    const token = authHeader.slice(7);

    const userClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: userRes, error: userErr } = await userClient.auth.getUser(token);
    if (userErr || !userRes.user) return json({ error: "Unauthorized" }, 401);

    const { data: isAdmin } = await admin.rpc("has_role", {
      _user_id: userRes.user.id, _role: "admin",
    });
    if (!isAdmin) return json({ error: "Forbidden" }, 403);

    const body = await req.json().catch(() => ({}));
    const { action } = body ?? {};

    if (action === "list") {
      const { data: roles, error } = await admin
        .from("user_roles")
        .select("user_id, created_at")
        .eq("role", "admin");
      if (error) return json({ error: error.message }, 500);
      const admins = await Promise.all((roles ?? []).map(async (r) => {
        const { data } = await admin.auth.admin.getUserById(r.user_id);
        return { user_id: r.user_id, email: data.user?.email ?? "unknown", created_at: r.created_at };
      }));
      return json({ admins });
    }

    if (action === "grant") {
      const email = String(body.email ?? "").trim().toLowerCase();
      if (!email) return json({ error: "email required" }, 400);
      // Find user
      let target: { id: string } | null = null;
      let page = 1;
      while (page < 20 && !target) {
        const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
        if (error) return json({ error: error.message }, 500);
        const found = data.users.find((u) => u.email?.toLowerCase() === email);
        if (found) target = { id: found.id };
        if (data.users.length < 200) break;
        page += 1;
      }
      if (!target) return json({ error: "No account exists for that email. Ask them to sign up first." }, 404);
      const { error } = await admin
        .from("user_roles")
        .insert({ user_id: target.id, role: "admin" });
      if (error && !String(error.message).includes("duplicate")) return json({ error: error.message }, 500);
      return json({ ok: true });
    }

    if (action === "revoke") {
      const target = String(body.user_id ?? "");
      if (!target) return json({ error: "user_id required" }, 400);
      if (target === userRes.user.id) return json({ error: "Cannot revoke yourself" }, 400);
      const { error } = await admin
        .from("user_roles")
        .delete()
        .eq("user_id", target)
        .eq("role", "admin");
      if (error) return json({ error: error.message }, 500);
      return json({ ok: true });
    }

    return json({ error: "Unknown action" }, 400);
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});
