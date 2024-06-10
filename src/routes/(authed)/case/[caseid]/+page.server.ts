import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
	const res = await fetch(`/api/case/${params.caseId}`);
	const c = await res.json();

	if (res.ok) {
		return { c };
	}

	throw error(404, `Case #${params.caseId} doesn't exist.`);
	// throw redirect(307, '/case');
};
