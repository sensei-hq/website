import { beforeEach, describe, expect, it } from 'vitest';
import { allowed, resetAccessCache, verifyCaller } from './access';

const enc = (o: unknown) => Buffer.from(JSON.stringify(o)).toString('base64url');
const pair = await crypto.subtle.generateKey({ name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' }, true, ['sign', 'verify']);
const jwk = { ...(await crypto.subtle.exportKey('jwk', pair.publicKey)), kid: 'k1' };
const certs = (async () => new Response(JSON.stringify({ keys: [jwk] }))) as unknown as typeof fetch;
async function token(claims: Record<string, unknown>, kid = 'k1') {
  const h = enc({ alg: 'RS256', kid }), p = enc(claims);
  const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', pair.privateKey, new TextEncoder().encode(`${h}.${p}`));
  return `${h}.${p}.${Buffer.from(sig).toString('base64url')}`;
}
const config = { teamDomain: 'sensei.cloudflareaccess.com', aud: 'aud1', emails: 'jerry@example.com', stagers: 'mac-id.access', posters: 'gh-id.access' };
const exp = Math.floor(Date.now() / 1000) + 600;

describe('admin access', () => {
  beforeEach(() => resetAccessCache());
  it('lets in the listed person and the two service tokens, each as its role', async () => {
    expect(await verifyCaller(await token({ aud: ['aud1'], exp, email: 'Jerry@example.com', iss: 'https://sensei.cloudflareaccess.com' }), config, certs)).toEqual({ role: 'admin', id: 'jerry@example.com' });
    expect(await verifyCaller(await token({ aud: 'aud1', exp, common_name: 'mac-id.access' }), config, certs)).toEqual({ role: 'stager', id: 'mac-id.access' });
    expect(await verifyCaller(await token({ aud: 'aud1', exp, common_name: 'gh-id.access' }), config, certs)).toEqual({ role: 'poster', id: 'gh-id.access' });
  });
  it('refuses anyone else, a wrong audience or issuer, an expired or forged token, and missing config', async () => {
    expect(await verifyCaller(await token({ aud: 'aud1', exp, email: 'someone@example.com' }), config, certs)).toBeNull();
    expect(await verifyCaller(await token({ aud: 'other', exp, email: 'jerry@example.com' }), config, certs)).toBeNull();
    expect(await verifyCaller(await token({ aud: 'aud1', exp, email: 'jerry@example.com', iss: 'https://evil.cloudflareaccess.com' }), config, certs)).toBeNull();
    expect(await verifyCaller(await token({ aud: 'aud1', exp: 1, email: 'jerry@example.com' }), config, certs)).toBeNull();
    expect(await verifyCaller(await token({ aud: 'aud1', exp, email: 'jerry@example.com' }, 'nope'), config, certs)).toBeNull();
    const good = await token({ aud: 'aud1', exp, email: 'jerry@example.com' });
    const [h, , s] = good.split('.');
    expect(await verifyCaller(`${h}.${enc({ aud: 'aud1', exp, email: 'jerry@example.com', x: 1 })}.${s}`, config, certs)).toBeNull();
    expect(await verifyCaller(good, { ...config, aud: '' }, certs)).toBeNull();
    expect(await verifyCaller(null, config, certs)).toBeNull();
  });
  it('gives each machine only its own endpoints, and never approval', () => {
    expect(allowed('stager', '/api/admin/media/a/short.mp4', 'PUT')).toBe(true);
    expect(allowed('stager', '/api/admin/stage', 'POST')).toBe(true);
    expect(allowed('stager', '/api/admin/queue', 'GET')).toBe(false);
    expect(allowed('poster', '/api/admin/queue', 'GET')).toBe(true);
    expect(allowed('poster', '/api/admin/posted', 'POST')).toBe(true);
    expect(allowed('poster', '/api/admin/media/a/short.mp4', 'GET')).toBe(true);
    expect(allowed('poster', '/api/admin/stage', 'POST')).toBe(false);
    expect(allowed('poster', '/api/admin/schedule', 'GET')).toBe(true);
    expect(allowed('stager', '/api/admin/production', 'POST')).toBe(true);
    expect(allowed('stager', '/api/admin/requests', 'POST')).toBe(true);
    expect(allowed('poster', '/api/admin/requests', 'GET')).toBe(false);
    expect(allowed('stager', '/api/admin/schedule', 'GET')).toBe(false);
    for (const r of ['stager', 'poster'] as const) {
      expect(allowed(r, '/admin', 'GET')).toBe(false);
      expect(allowed(r, '/admin', 'POST')).toBe(false);
    }
    expect(allowed('admin', '/admin', 'POST')).toBe(true);
  });
});
