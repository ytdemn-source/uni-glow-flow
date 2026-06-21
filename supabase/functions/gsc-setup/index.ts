// Public helper to setup Google Search Console verification + site add
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GATEWAY = "https://connector-gateway.lovable.dev/google_search_console";
const SITE = "https://uni-glow-flow.lovable.app/";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  const GSC = Deno.env.get("GOOGLE_SEARCH_CONSOLE_API_KEY");
  if (!LOVABLE_API_KEY || !GSC) {
    return new Response(JSON.stringify({ error: "missing keys" }), { status: 500, headers: corsHeaders });
  }
  const headers = {
    Authorization: `Bearer ${LOVABLE_API_KEY}`,
    "X-Connection-Api-Key": GSC,
    "Content-Type": "application/json",
  };

  const url = new URL(req.url);
  const action = url.searchParams.get("action") || "token";

  if (action === "token") {
    const r = await fetch(`${GATEWAY}/siteVerification/v1/token`, {
      method: "POST",
      headers,
      body: JSON.stringify({ site: { identifier: SITE, type: "SITE" }, verificationMethod: "META" }),
    });
    return new Response(await r.text(), { status: r.status, headers: corsHeaders });
  }

  if (action === "verify") {
    const r = await fetch(`${GATEWAY}/siteVerification/v1/webResource?verificationMethod=META`, {
      method: "POST",
      headers,
      body: JSON.stringify({ site: { identifier: SITE, type: "SITE" } }),
    });
    const verifyText = await r.text();
    if (!r.ok) return new Response(verifyText, { status: r.status, headers: corsHeaders });

    const enc = encodeURIComponent(SITE);
    const addR = await fetch(`${GATEWAY}/webmasters/v3/sites/${enc}`, { method: "PUT", headers });
    const addText = await addR.text();

    // Submit sitemap
    const sm = encodeURIComponent(`${SITE}sitemap.xml`);
    const smR = await fetch(`${GATEWAY}/webmasters/v3/sites/${enc}/sitemaps/${sm}`, { method: "PUT", headers });

    return new Response(JSON.stringify({ verify: verifyText, add: { status: addR.status, body: addText }, sitemap: { status: smR.status } }), { status: 200, headers: corsHeaders });
  }

  if (action === "indexnow") {
    // IndexNow: notify Bing/Yandex/etc. Google ignores it but it's free Bing traffic.
    const key = "a7f3e9c2b8d54f6a91e0c7b4d2f8a516"; // static key string
    const keyUrl = `${SITE}${key}.txt`;
    const r = await fetch("https://api.indexnow.org/IndexNow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: "uni-glow-flow.lovable.app",
        key,
        keyLocation: keyUrl,
        urlList: [SITE, `${SITE}sitemap.xml`],
      }),
    });
    return new Response(JSON.stringify({ status: r.status, body: await r.text() }), {
      status: 200,
      headers: corsHeaders,
    });
  }

  if (action === "resubmit-sitemap") {
    const enc = encodeURIComponent(SITE);
    const sm = encodeURIComponent(`${SITE}sitemap.xml`);
    const r = await fetch(`${GATEWAY}/webmasters/v3/sites/${enc}/sitemaps/${sm}`, { method: "PUT", headers });
    return new Response(JSON.stringify({ status: r.status, body: await r.text() }), { status: 200, headers: corsHeaders });
  }

  return new Response("unknown action", { status: 400, headers: corsHeaders });
});
