import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
	const res = await fetch(`/api/cases/${params.caseId}`);
	const c = await res.json();

	if (res.ok) {
		let discussions = [];

		for (const d of c.discussions) {
			const response = await fetch(`/api/discussions/${d}`);
			if (response.ok) {
				const dd = await response.json();
				dd.id = d;
				discussions.push(dd);
			} else {
				const dd = await response.json();
				console.log(dd.message);
			}
		}

		return { c, discussions };
	}

	throw error(404, `Case #${params.caseId} doesn't exist.`);
	// throw redirect(307, '/case');
};
