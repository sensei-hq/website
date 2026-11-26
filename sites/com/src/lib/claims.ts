// ─── Feature claims ──────────────────────────────────────────────────────────
//
// "Do not advertise functionality that is not currently implemented and
// verified." A claim that is still design intent is kept in the data, wrapped
// in `unverified(…)`, so the intent is recorded but never rendered. Plain
// entries are claims that have been checked against the shipped product.
// Pages render a claim list through `shown(…)` (website#2).

export interface Unverified<T> {
  claim: T;
  verified: false;
}

export type Claimed<T> = T | Unverified<T>;

export const unverified = <T>(claim: T): Unverified<T> => ({ claim, verified: false });

export function isUnverified<T>(c: Claimed<T>): c is Unverified<T> {
  return typeof c === 'object' && c !== null && 'claim' in c && (c as Unverified<T>).verified === false;
}

/** The claims a page may render: every verified one, in order. */
export function shown<T>(claims: Claimed<T>[]): T[] {
  return claims.filter((c): c is T => !isUnverified(c));
}
