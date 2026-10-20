/** Numéro au format international pour les liens tel: (« 03 29 41 03 74 » → « tel:+33329410374 »). */
export function telHref(phone: string): string {
  return `tel:+33${phone.replace(/\D/g, "").replace(/^0/, "")}`;
}
