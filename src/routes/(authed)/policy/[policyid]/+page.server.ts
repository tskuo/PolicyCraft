import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
	const res = await fetch(`/api/policy/${params.policyId}`);
	const policy = await res.json();

	if (res.ok) {
		let cases = [];

		for (const c of policy.cases) {
			const response = await fetch(`/api/case/${c.caseId}`);
			const cc = await response.json();
			cases.push(cc);
		}

		// const promises = policy.cases.map((c) => fetch(`/api/case/${c.caseId}`));
		// const results = await Promise.all(promises);
		// const test = results.map((r) => r.json());
		// test.forEach((r) => console.log(r));

		// console.log(results);

		// const arrayOfResponses = await Promise.all(promises);
		// arrayOfResponses.forEach((p) => console.log(p.json()));
		// const promises = policy.cases.map((c) => fetch(`/api/case/${c.caseId}`));
		// const arrayOfResponses = await Promise.all(promises);
		// arrayOfResponses.forEach((res) => {
		// 	console.log(res.json());
		// });

		return { policy, cases };
	}

	throw error(404, `Policy #${params.policyId} doesn't exist.`);
	// throw redirect(307, '/policy');
};
