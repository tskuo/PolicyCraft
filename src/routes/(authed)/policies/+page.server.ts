import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	try {
		const resPolicies = await fetch('/api/policies');
		const policies = await resPolicies.json();

		for (const policy of policies) {
			let cases = [];
			for (const c of policy.cases) {
				const resCase = await fetch(`/api/cases/${c.caseId}`);
				if (resCase.ok) {
					const cc = await resCase.json();
					cc.label = c.label;
					let reasons = [];
					for (const reasonId of cc.reasons) {
						const resReason = await fetch(`/api/reasons/${reasonId}`);
						if (resReason.ok) {
							const rr = await resReason.json();
							rr.id = reasonId;
							reasons.push(rr);
						}
					}
					cc.reasons = reasons;
					cases.push(cc);
				}
			}
			policy.cases = cases;
		}

		return { policies };
	} catch {
		throw error(404, 'Fail to load policies.');
		// throw redirect(307, '/policy');
	}
};
