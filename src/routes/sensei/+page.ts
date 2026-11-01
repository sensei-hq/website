import type { PageLoad } from './$types';
import { senseiVersion } from '$lib/sensei-version';

export const load: PageLoad = async ({ fetch }) => ({ version: await senseiVersion(fetch) });
