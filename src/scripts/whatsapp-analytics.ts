type EventParameters = Record<string, string>;
type AnalyticsWindow = Window & {
  gtag?: (command: 'event', event: string, parameters: EventParameters) => void;
};

/** A click expresses contact intent, not a confirmed enquiry or reservation. */
export function trackWhatsAppClick(event: MouseEvent, doc: Document, win: AnalyticsWindow) {
  if (event.type === 'auxclick' ? event.button !== 1 : event.button !== 0) return;
  if (!(event.target instanceof Element)) return;
  const link = event.target.closest<HTMLAnchorElement>('a[href]');
  if (!link) return;
  const url = new URL(link.href, win.location.origin);
  if (url.protocol !== 'https:' || !['wa.me', 'api.whatsapp.com'].includes(url.hostname)) return;

  // Do not send phone numbers, message text, query strings or fragment identifiers.
  const pagePath = win.location.pathname;
  const unit = link.dataset.unit || pagePath.match(/\/unidades\/(unidad-\d+)(?:\/|$)/)?.[1] || 'general';
  win.gtag?.('event', 'whatsapp_click', {
    page_path: pagePath,
    page_language: doc.documentElement.lang,
    unit,
    cta_location: link.dataset.ctaLocation || 'other',
    transport_type: 'beacon',
  });
}

if (typeof document !== 'undefined') {
  const track = (event: MouseEvent) => trackWhatsAppClick(event, document, window);
  document.addEventListener('click', track);
  document.addEventListener('auxclick', track);
}
