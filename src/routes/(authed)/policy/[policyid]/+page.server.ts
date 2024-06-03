import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
	console.log(params.policyid);
	console.log('here');
	const res = await fetch(`/policy/${params.policyid}`);
	const policy = await res.json();

	return { policy };
};
