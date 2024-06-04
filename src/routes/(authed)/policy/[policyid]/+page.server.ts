import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
	const res = await fetch(`/api/policy/${params.policyId}`);
	const policy = await res.json();

	if (res.ok) {
		return { policy };
	}

	throw error(404, `Policy #${params.policyId} doesn't exist.`);
	// throw redirect(307, '/policy');
};
