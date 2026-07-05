import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const PAGE_TITLE = "Page Not Found (404) | A Help Deck";
const PAGE_DESCRIPTION =
  "The page you're looking for doesn't exist. Return to the A Help Deck home page.";

const CANONICAL = "https://uni-glow-flow.lovable.app/404";

function setMeta(selector: string, attr: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement | HTMLLinkElement>(selector);
  if (!el) {
    if (selector.startsWith("link")) {
      el = document.createElement("link");
      (el as HTMLLinkElement).rel = "canonical";
    } else {
      el = document.createElement("meta");
      const nameMatch = selector.match(/\[name="([^"]+)"\]/);
      const propMatch = selector.match(/\[property="([^"]+)"\]/);
      if (nameMatch) (el as HTMLMetaElement).name = nameMatch[1];
      if (propMatch) (el as HTMLMetaElement).setAttribute("property", propMatch[1]);
    }
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);

    const prevTitle = document.title;
    const prevDesc = document.head
      .querySelector('meta[name="description"]')
      ?.getAttribute("content");
    const prevCanonical = document.head
      .querySelector('link[rel="canonical"]')
      ?.getAttribute("href");

    document.title = PAGE_TITLE;
    setMeta('meta[name="description"]', "content", PAGE_DESCRIPTION);
    setMeta('link[rel="canonical"]', "href", CANONICAL);
    setMeta('meta[name="robots"]', "content", "noindex, follow");
    setMeta('meta[property="og:title"]', "content", PAGE_TITLE);
    setMeta('meta[property="og:description"]', "content", PAGE_DESCRIPTION);

    return () => {
      if (prevTitle) document.title = prevTitle;
      if (prevDesc) setMeta('meta[name="description"]', "content", prevDesc);
      if (prevCanonical) setMeta('link[rel="canonical"]', "href", prevCanonical);
      document.head.querySelector('meta[name="robots"]')?.remove();
    };
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
        <a href="/" className="text-primary underline hover:text-primary/90">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
