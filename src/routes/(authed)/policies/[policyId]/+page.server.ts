import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
	const res = await fetch(`/api/policies/${params.policyId}`);
	const policy = await res.json();

	if (res.ok) {
		let cases = [];

		for (const c of policy.cases) {
			const response = await fetch(`/api/cases/${c.caseId}`);
			if (response.ok) {
				const cc = await response.json();
				cc.label = c.label;
				cases.push(cc);
			} else {
				const cc = await response.json();
				console.log(cc.message);
			}
		}

		return { policy, cases };
	}

	throw error(404, `Policy #${params.policyId} doesn't exist.`);
	// throw redirect(307, '/policy');
};
