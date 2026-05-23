import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
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

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function formatRfc822Date(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00+05:30");
  return date.toUTCString();
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const firecrawlApiKey = Deno.env.get("FIRECRAWL_API_KEY");
    if (!firecrawlApiKey) {
      return new Response(
        "RSS feed unavailable - scraper not configured",
        { status: 500, headers: { ...corsHeaders, "Content-Type": "text/plain" } }
      );
    }

    // Scrape the notices page
    const scrapeResponse = await fetch("https://api.firecrawl.dev/v1/scrape", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${firecrawlApiKey}`,
      },
      body: JSON.stringify({
        url: "https://galsimahavidyalaya.ac.in/category/notice/",
        formats: ["html", "links"],
        onlyMainContent: false,
      }),
    });

    if (!scrapeResponse.ok) {
      return new Response(
        "RSS feed unavailable - failed to fetch notices",
        { status: 500, headers: { ...corsHeaders, "Content-Type": "text/plain" } }
      );
    }

    const scrapeData = await scrapeResponse.json();
    const html = scrapeData.data?.html || scrapeData.html || "";
    const links = scrapeData.data?.links || scrapeData.links || [];

    const notices: Notice[] = [];
    const currentDate = new Date();

    // Parse HTML table rows
    const tableRowRegex = /<tr>\s*<td[^>]*>(\d+)<\/td>\s*<td[^>]*>(\d{1,2}-\d{1,2}-\d{4})<\/td>\s*<td[^>]*>([^<]+)<\/td>\s*<td[^>]*>\s*<a\s+href="([^"]+)"[^>]*>/gi;

    let match;
    while ((match = tableRowRegex.exec(html)) !== null && notices.length < 50) {
      const slNo = match[1].trim();
      const dateStr = match[2].trim();
      const title = match[3].trim().replace(/&amp;/g, "&").replace(/&#8217;/g, "'").replace(/&#8211;/g, "-");
      const pdfUrl = match[4].trim();

      if (!pdfUrl || pdfUrl === "#") continue;

      const [day, month, year] = dateStr.split("-").map(Number);
      const parsedDate = new Date(year, month - 1, day);
      const daysDiff = Math.floor((currentDate.getTime() - parsedDate.getTime()) / (1000 * 60 * 60 * 24));
      const isNew = daysDiff <= 3 && daysDiff >= 0;

      notices.push({
        id: `notice-${slNo}`,
        title,
        date: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
        url: pdfUrl,
        isNew,
        isImportant: false,
        category: "general",
      });
    }

    // Sort by date descending
    notices.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const now = new Date().toUTCString();
    const siteUrl = "https://uni-glow-flow.lovable.app";

    const items = notices.slice(0, 30).map((notice) => {
      const pubDate = formatRfc822Date(notice.date);
      const category = notice.category.charAt(0).toUpperCase() + notice.category.slice(1);
      const badge = notice.isNew ? " [NEW]" : "";
      const description = notice.url.includes(".pdf")
        ? `PDF notice from Galsi Mahavidyalaya. Published on ${notice.date}.`
        : `Notice from Galsi Mahavidyalaya. Published on ${notice.date}.`;

      return `
    <item>
      <title>${escapeXml(notice.title + badge)}</title>
      <link>${escapeXml(notice.url)}</link>
      <guid>${escapeXml(siteUrl + "/#notice-" + notice.id)}</guid>
      <pubDate>${pubDate}</pubDate>
      <category>${escapeXml(category)}</category>
      <description>${escapeXml(description)}</description>
    </item>`;
    }).join("\n");

    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Galsi College Notices - GS Hub</title>
    <link>${siteUrl}</link>
    <description>Latest notices, results, and announcements from Galsi Mahavidyalaya (Galsi College), Purba Bardhaman. Automatically updated from the official college website.</description>
    <language>en-us</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${siteUrl}/functions/v1/rss-feed" rel="self" type="application/rss+xml" />
    <image>
      <url>${siteUrl}/favicon.ico</url>
      <title>Galsi College Notices - GS Hub</title>
      <link>${siteUrl}</link>
    </image>
${items}
  </channel>
</rss>`;

    return new Response(rssXml, {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "public, max-age=300",
      },
    });
  } catch (err) {
    const error = err as Error;
    console.error("RSS feed error:", error);
    return new Response(
      "RSS feed unavailable - internal error",
      { status: 500, headers: { ...corsHeaders, "Content-Type": "text/plain" } }
    );
  }
});
