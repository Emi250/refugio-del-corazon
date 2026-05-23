const WA_SHORT = 'https://wa.me/message/G2SJBL3SDPAMB1';

type Lang = 'es' | 'en';

export function waLink(_message?: string, _lang: Lang = 'es'): string {
  return WA_SHORT;
}

export function waLinkForUnit(_unitName: string, _lang: Lang = 'es'): string {
  return WA_SHORT;
}
