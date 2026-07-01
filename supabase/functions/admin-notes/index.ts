// Legacy admin-notes function — kept only for backwards compatibility.
// New admin flows use direct Supabase calls with the authenticated user session
// (RLS enforces admin role). This function is a no-op stub.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve((req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  return new Response(
    JSON.stringify({ error: "This endpoint has been removed. Use the /admin dashboard." }),
    { status: 410, headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
