import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, params }) => {
	try {
		const resPolicy = await fetch(`/api/policies/${params.policyId}`);
		const policy = await resPolicy.json();

		const res = await fetch(`/api/policies/${params.policyId}/edithistory`);
		const edits = await res.json();

		edits
			.sort((editA, editB) => {
				const a = editA.createAt;
				const b = editB.createAt;
				if (a < b) return -1;
				else if (a > b) return 1;
				return 0;
			})
			.reverse();

		return { policy, edits };
	} catch {
		throw error(404, 'Fail to load this page.');
	}
};
