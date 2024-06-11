import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const res = await fetch('/api/cases');
	const cases = await res.json();

	if (res.ok) {
		return { cases };
	}

	throw error(404, 'Fail to load cases.');
};
