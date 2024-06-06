import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const res = await fetch('/api/policy');
	const policies = await res.json();

	if (res.ok) {
		return { policies };
	}

	throw error(404, 'fetching error');
	// throw redirect(307, '/policy');
};
