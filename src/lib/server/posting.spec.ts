import { describe, expect, it } from 'vitest';
import { canonical, channelState, checkSignature, contentSha, due, signMedia, validKey, type ApprovalRow, type PostRow, type StagedRow } from './posting';

const staged = (sha: string, channel: StagedRow['channel'] = 'youtube'): StagedRow =>
  ({ slug: 'a', channel, post: { media: [] }, content_sha: sha, staged_by: 'mac', staged_at: '' });
const approval = (sha: string, revoked = false): ApprovalRow =>
  ({ id: 1, slug: 'a', channel: 'youtube', content_sha: sha, approved_by: 'jerry', approved_at: '', revoked_at: revoked ? 'x' : null });
const post = (sha: string, status: PostRow['status']): PostRow =>
  ({ id: 1, slug: 'a', channel: 'youtube', content_sha: sha, status, url: null, external_id: null, detail: null, run: null, at: '' });

describe('posting rules', () => {
  it('fingerprints content the same whatever the key order', async () => {
    expect(canonical({ b: 1, a: [2, { d: 3, c: 4 }] })).toBe('{"a":[2,{"c":4,"d":3}],"b":1}');
    expect(await contentSha('x', { text: 'hi', media: [] })).toBe(await contentSha('x', { media: [], text: 'hi' }));
    expect(await contentSha('x', { text: 'hi', media: [] })).not.toBe(await contentSha('x', { text: 'hi!', media: [] }));
  });
  it('counts an approval only for the content it was given for', () => {
    expect(channelState(undefined, [], [])).toBe('not-staged');
    expect(channelState(staged('s1'), [], [])).toBe('awaiting');
    expect(channelState(staged('s1'), [approval('s1')], [])).toBe('approved');
    expect(channelState(staged('s2'), [approval('s1')], [])).toBe('changed');
    expect(channelState(staged('s1'), [approval('s1', true)], [])).toBe('awaiting');
    expect(channelState(staged('s1'), [approval('s1')], [post('s1', 'failed')])).toBe('failed');
    expect(channelState(staged('s1'), [approval('s1')], [post('s1', 'dry-run')])).toBe('approved');
    expect(channelState(staged('s1'), [approval('s1')], [post('s1', 'posted')])).toBe('posted');
  });
  it('queues only approved, unposted pieces whose date has come, and nothing while paused', () => {
    const rows = [
      { slug: 'a', date: '2026-11-16', staged: [staged('s1')], approvals: [approval('s1')], posts: [] },
      { slug: 'b', date: '2026-11-17', staged: [{ ...staged('t1'), slug: 'b' }], approvals: [{ ...approval('t1'), slug: 'b' }], posts: [] },
    ];
    expect(due(rows, '2026-11-16', false).map((s) => s.slug)).toEqual(['a']);
    expect(due(rows, '2026-11-17', false).map((s) => s.slug)).toEqual(['a', 'b']);
    expect(due(rows, '2026-11-17', true)).toEqual([]);
    expect(due([{ ...rows[0], posts: [post('s1', 'posted')] }], '2026-11-17', false)).toEqual([]);
  });
  it('signs media URLs that expire and cannot be altered', async () => {
    const now = Date.UTC(2026, 10, 16);
    const url = new URL(await signMedia('a/short.mp4', 'secret', 'https://sensei-hq.com', 3600, now));
    const [exp, sig] = [url.searchParams.get('exp')!, url.searchParams.get('sig')!];
    expect(await checkSignature('a/short.mp4', exp, sig, 'secret', now)).toBe(true);
    expect(await checkSignature('a/other.mp4', exp, sig, 'secret', now)).toBe(false);
    expect(await checkSignature('a/short.mp4', exp, sig, 'other', now)).toBe(false);
    expect(await checkSignature('a/short.mp4', exp, sig, 'secret', now + 2 * 3600 * 1000)).toBe(false);
  });
  it('accepts only plain media keys', () => {
    expect(validKey('schema-as-code/short.mp4')).toBe(true);
    for (const k of ['../x', 'a/../b', 'a/b/c', 'A/b.mp4', '/a.mp4']) expect(validKey(k)).toBe(false);
  });
});

describe('posting order', () => {
  const dates = () => new Map([['past', '2026-11-10'], ['a', '2026-11-16'], ['b', '2026-11-17'], ['c', '2026-11-18'], ['d', '2026-11-19']]);
  it('pulls a piece into the next slot and moves the rest down one', async () => {
    const { makeNext } = await import('./posting');
    expect([...makeNext(dates(), 'c', '2026-11-14')]).toEqual([['c', '2026-11-16'], ['a', '2026-11-17'], ['b', '2026-11-18']]);
    expect([...makeNext(dates(), 'a', '2026-11-14')]).toEqual([]);           // already next
    expect([...makeNext(dates(), 'past', '2026-11-14')]).toEqual([]);        // published: not movable
  });
  it('never queues a post before the site has published the article', () => {
    const row = { slug: 'a', staged: [staged('s1')], approvals: [approval('s1')], posts: [] };
    expect(due([{ ...row, date: '2026-11-20', planned: '2026-11-14' }], '2026-11-14', false)).toEqual([]);   // moved up, not rebuilt yet
    expect(due([{ ...row, date: '2026-11-14', planned: '2026-11-20' }], '2026-11-14', false)).toEqual([]);   // moved back
    expect(due([{ ...row, date: '2026-11-14', planned: '2026-11-14' }], '2026-11-14', false).length).toBe(1);
  });
});
