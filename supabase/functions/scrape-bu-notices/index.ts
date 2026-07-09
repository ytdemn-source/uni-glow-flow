const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Notice {
  id: string;
  title: string;
  date: string;
  url: string;
  isNew: boolean;
  isImportant: boolean;
  category: string;
}

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  result: ['result', 'grade card', 'marksheet', 'marks'],
  routine: ['routine', 'schedule', 'time table', 'timetable'],
  syllabus: ['syllabus', 'curriculum'],
  exam: ['exam', 'examination', 'ppr', 'pps'],
  admission: ['admission', 'registration', 'enrollment', 'enrolment', 'merit'],
  scholarship: ['scholarship', 'stipend', 'tuition fees concession', 'fee concession'],
  holiday: ['holiday', 'vacation'],
  important: ['urgent', 'important', 'notification', 'notice', 'order'],
};

// Explicitly science-only markers — filter these OUT (unless title also mentions arts)
const SCIENCE_ONLY_URL = /_FCS\.pdf$/i;
const SCIENCE_ONLY_TITLE = /\b(M\.?Sc\.?|B\.?Sc\.?|M\.?Tech|B\.?Tech|BCA|BBA|Zoology|Botany|Chemistry|Physics|Mathematics|Microwaves|Engineering|E&CE)\b/i;
const ARTS_HINT = /\b(Arts|Bengali|English|History|Sanskrit|Philosophy|Political|Sociology|Commerce|Law|Music|M\.?A\.?|B\.?A\.?|B\.?Ed|M\.?Ed|LL\.?[BM]|MFA|MSW|MBA)\b/i;

function categorize(title: string): string {
  const t = title.toLowerCase();
  for (const [c, ks] of Object.entries(CATEGORY_KEYWORDS)) {
    if (ks.some((k) => t.includes(k))) return c;
  }
  return 'general';
}

function shouldInclude(title: string, url: string): boolean {
  const scienceUrl = SCIENCE_ONLY_URL.test(url);
  const scienceTitle = SCIENCE_ONLY_TITLE.test(title);
  const hasArts = ARTS_HINT.test(title);
  if ((scienceUrl || scienceTitle) && !hasArts) return false;
  return true;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const apiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'Firecrawl not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const resp = await fetch('https://api.firecrawl.dev/v2/scrape', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: 'https://www.buruniv.ac.in/Demo/index_bucc.php',
        formats: ['markdown'],
        onlyMainContent: false,
      }),
    });
    const data = await resp.json();
    if (!resp.ok) {
      return new Response(
        JSON.stringify({ success: false, error: data.error || `HTTP ${resp.status}` }),
        { status: resp.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const markdown: string = data.data?.markdown || data.markdown || '';
    const notices: Notice[] = [];
    const seenUrls = new Set<string>();

    // Match [title](https://www.buruniv.ac.in/Notices/....pdf)
    const linkRe = /\[([^\]]+?)\]\((https:\/\/(?:www\.)?buruniv\.ac\.in\/Notices\/[^)\s]+\.pdf)\)/gi;
    let m: RegExpExecArray | null;
    let idx = 0;
    while ((m = linkRe.exec(markdown)) !== null) {
      let title = m[1]
        .replace(/!\[.*?\]\(.*?\)/g, '')
        .replace(/\\+'/g, "'")
        .replace(/\s+/g, ' ')
        .trim();
      const url = m[2];
      if (!title || title.length < 5) continue;
      if (seenUrls.has(url)) continue;
      if (!shouldInclude(title, url)) continue;
      seenUrls.add(url);

      // Extract YYYYMMDD-ish serial from filename for a stable-ish date
      const fileNum = url.match(/\/(\d{8})/)?.[1];
      let date = new Date().toISOString().slice(0, 10);
      if (fileNum) {
        const y = fileNum.slice(0, 4);
        // filename is a serial, not a real date; leave date as today
        date = `${y}-01-01`;
      }

      const category = categorize(title);
      notices.push({
        id: `bu-${idx++}`,
        title,
        date,
        url,
        isNew: idx <= 6,
        isImportant: /notification|important|urgent|revised|result|admission/i.test(title),
        category,
      });
    }

    return new Response(
      JSON.stringify({ success: true, notices, scrapedAt: new Date().toISOString() }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Failed';
    return new Response(
      JSON.stringify({ success: false, error: msg }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
