import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { policyEditCaseFormSchema } from '$lib/schema';

export const load: PageServerLoad = async ({ fetch, params }) => {
	const res = await fetch(`/api/policies/${params.policyId}`);
	const policy = await res.json();

	const res2 = await fetch('/api/cases');
	const allCases = await res2.json();

	const form = await superValidate(zod(policyEditCaseFormSchema));

	if (res.ok) {
		let relatedCases = new Map();
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
				relatedCases.set(cc.id, cc);
			}
		}

		form.data.cases = policy.cases;
		return { policy, form, relatedCases, allCases };
	}

	throw error(404, 'Fail to load this page.');

	// throw redirect(307, '/policy');
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(policyEditCaseFormSchema));

		if (!form.valid) {
			return fail(400, { form });
		} else {
			console.log(form.data);
		}
	}
};
