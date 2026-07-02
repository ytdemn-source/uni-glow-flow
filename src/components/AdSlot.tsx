import { useEffect, useRef } from 'react';

interface AdSlotProps {
  slot?: string;
  format?: string;
  className?: string;
  style?: React.CSSProperties;
}

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/**
 * Google AdSense responsive ad unit.
 * Publisher: ca-pub-9888202155080852
 * Pass a `slot` ID once you create an ad unit in AdSense; until then
 * Auto Ads will fill approved placements.
 */
export function AdSlot({ slot, format = 'auto', className = '', style }: AdSlotProps) {
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      /* ad blocker or script not yet loaded — silently ignore */
    }
  }, []);

  return (
    <div className={`w-full flex justify-center my-6 ${className}`} aria-hidden="true">
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', ...style }}
        data-ad-client="ca-pub-9888202155080852"
        data-ad-slot={slot ?? ''}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
