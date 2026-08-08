const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DocItem {
  title: string;
  url: string;
  type: 'pdf' | 'doc' | 'link';
}

const ALLOWED_HOSTS = ['galsimahavidyalaya.ac.in', 'www.galsimahavidyalaya.ac.in', 'buruniv.ac.in', 'www.buruniv.ac.in'];

function prettify(raw: string): string {
  return decodeURIComponent(raw)
    .replace(/\.[a-z]+$/i, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function classify(text: string): 'syllabus' | 'routine' | 'results' | 'notices' {
  const t = text.toLowerCase();
  if (/(syllabus|curriculum|course structure|cbcs|nep)/.test(t)) return 'syllabus';
  if (/(routine|lesson plan|time ?table|schedule|academic calendar)/.test(t)) return 'routine';
  if (/(result|marks|grade|question|co[- ]po|pso|outcome)/.test(t)) return 'results';
  return 'notices';
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!apiKey) {
      return new Response(JSON.stringify({ success: false, error: 'Firecrawl not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json().catch(() => ({}));
    const target = typeof body?.url === 'string' ? body.url : '';
    let parsed: URL;
    try {
      parsed = new URL(target);
    } catch {
      return new Response(JSON.stringify({ success: false, error: 'Invalid url' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (!ALLOWED_HOSTS.includes(parsed.hostname)) {
      return new Response(JSON.stringify({ success: false, error: 'Host not allowed' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Scraping department page:', parsed.toString());

    const res = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: parsed.toString(),
        formats: ['markdown', 'links'],
        onlyMainContent: false,
      }),
    });

    const data = await res.json();
    if (!res.ok || !data?.success) {
      console.error('Firecrawl error', res.status, JSON.stringify(data).slice(0, 500));
      return new Response(
        JSON.stringify({ success: false, error: data?.error || `Scrape failed (${res.status})` }),
        { status: res.status === 402 ? 402 : 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const markdown: string = data.data?.markdown ?? '';
    const links: string[] = data.data?.links ?? [];

    const titleByUrl = new Map<string, string>();
    for (const m of markdown.matchAll(/\[([^\]]{2,180})\]\((https?:\/\/[^\s)]+)\)/g)) {
      const label = m[1].replace(/[*_`#]/g, '').trim();
      if (label && !titleByUrl.has(m[2])) titleByUrl.set(m[2], label);
    }

    const seen = new Set<string>();
    const buckets: Record<string, DocItem[]> = { syllabus: [], routine: [], results: [], notices: [] };

    const candidates = new Set<string>([...links, ...titleByUrl.keys()]);
    for (const href of candidates) {
      if (!/\.(pdf|docx?|xlsx?)(\?.*)?$/i.test(href)) continue;
      if (seen.has(href)) continue;
      seen.add(href);

      const fileName = href.split('/').pop() ?? href;
      const label = titleByUrl.get(href) || prettify(fileName);
      const type: DocItem['type'] = /\.pdf/i.test(href) ? 'pdf' : /\.docx?/i.test(href) ? 'doc' : 'link';
      buckets[classify(`${label} ${fileName}`)].push({ title: label, url: href, type });
    }

    const total = Object.values(buckets).reduce((n, arr) => n + arr.length, 0);
    console.log('Extracted documents:', total);

    return new Response(
      JSON.stringify({ success: true, ...buckets, total, fetchedAt: new Date().toISOString() }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    console.error('scrape-department-docs failed:', err);
    return new Response(JSON.stringify({ success: false, error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
