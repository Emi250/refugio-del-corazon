type Lang = 'es' | 'en';

export const WHATSAPP_NUMBER = (import.meta.env.PUBLIC_WHATSAPP_NUMBER ?? '').replace(/\D/g, '');

export function inquiryMessage(unitName?: string, lang: Lang = 'es'): string {
  return lang === 'es'
    ? `Hola, quisiera consultar ${unitName ? `por el ${unitName}` : 'por un departamento'} en El Refugio del Corazón.\nFechas de entrada y salida: \nCantidad de personas: `
    : `Hi, I'd like to enquire about ${unitName ?? 'an apartment'} at El Refugio del Corazón.\nCheck-in and check-out dates: \nNumber of guests: `;
}

export function waLink(message?: string, lang: Lang = 'es'): string {
  if (!/^[1-9]\d{7,14}$/.test(WHATSAPP_NUMBER) || /0{5}/.test(WHATSAPP_NUMBER)) {
    throw new Error('Configure PUBLIC_WHATSAPP_NUMBER with the verified business number before building.');
  }
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message ?? inquiryMessage(undefined, lang))}`;
}

export function waLinkForUnit(unitName: string, lang: Lang = 'es'): string {
  return waLink(inquiryMessage(unitName, lang), lang);
}
