import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
	const res = await fetch(`/policy/${params.policyid}`);
	const policy = await res.json();

	if (res.ok) {
		return { policy };
	}

	throw error(404, `Policy #${params.policyid} doesn't exist.`);
	// throw redirect(307, '/policy');
};
