// Channel names for the admin page (client-safe: no queries, no secrets).
export const CHANNEL_NAMES = { youtube: 'YouTube', instagram_reel: 'Instagram Reel', instagram_carousel: 'Instagram carousel', x: 'X' } as const;
export type Channel = keyof typeof CHANNEL_NAMES;
