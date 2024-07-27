import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, params, locals }) => {
	const res = await fetch(`/api/policies/${params.policyId}`);
	const policy = await res.json();

	if (res.ok) {
		return { policy };
	}

	throw error(404, 'Fail to load this page.');
};
