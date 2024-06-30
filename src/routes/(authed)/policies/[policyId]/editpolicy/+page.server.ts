import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { policyEditFormSchema } from '$lib/schema';

export const load: PageServerLoad = async ({ fetch, params, locals }) => {
	if (locals.stage == 'vote') {
		throw redirect(303, `/policies/${params.policyId}`);
	}

	const res = await fetch(`/api/policies/${params.policyId}`);
	const policy = await res.json();

	const form = await superValidate(zod(policyEditFormSchema));

	if (res.ok) {
		const cases = new Map();
		for (const c of policy.cases) {
			const resCase = await fetch(`/api/cases/${c.caseId}`);
			if (resCase.ok) {
				const cc = await resCase.json();
				cc.label = c.label;

				const reasons = [];
				for (const reasonId of cc.reasons) {
					const resReason = await fetch(`/api/reasons/${reasonId}`);
					if (resReason.ok) {
						const rr = await resReason.json();
						rr.id = reasonId;
						reasons.push(rr);
					}
				}
				cc.reasons = reasons;
				cases.set(cc.id, cc);
			}
		}

		form.data.title = policy.title;
		form.data.description = policy.description;
		form.data.cases = policy.cases;
		return { policy, form, cases };
	}

	throw error(404, 'Fail to load this page.');

	// throw redirect(307, '/policy');
};

export const actions: Actions = {
	editPolicy: async (event) => {
		const form = await superValidate(event, zod(policyEditFormSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		if (event.locals.stage == 'vote') {
			return fail(400, { form });
		}

		await event.fetch(`/api/policies/${event.params.policyId}`, {
			method: 'PATCH',
			body: JSON.stringify({ form, action: 'editPolicy' }),
			headers: {
				'Content-Type': 'appplication/json'
			}
		});

		redirect(303, `/policies/${event.params.policyId}`);
	}
};
