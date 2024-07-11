import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { policyEditCaseFormSchema, relatedCaseCreateFormSchema } from '$lib/schema';

export const load: PageServerLoad = async ({ fetch, params, locals }) => {
	if (locals.stage == 'vote') {
		throw redirect(303, `/policies/${params.policyId}`);
	}

	try {
		const resPolicy = await fetch(`/api/policies/${params.policyId}`);
		const policy = await resPolicy.json();

		const resCases = await fetch('/api/cases');
		const allCases = await resCases.json();

		for (const c of allCases) {
			const reasons = [];
			for (const reasonId of c.reasons) {
				const response = await fetch(`/api/reasons/${reasonId}`);
				if (response.ok) {
					const r = await response.json();
					reasons.push(r);
				}
			}
			c.reasons = reasons;
		}

		const form = await superValidate(zod(policyEditCaseFormSchema));
		const formNewCase = await superValidate(zod(relatedCaseCreateFormSchema));

		form.data.cases = policy.cases;

		return { policy, form, formNewCase, allCases };
	} catch {
		throw error(404, 'Fail to load this page.');
	}
};

export const actions: Actions = {
	editRelatedCases: async (event) => {
		const form = await superValidate(event, zod(policyEditCaseFormSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		if (event.locals.stage == 'vote') {
			return fail(400, { form });
		}

		await event.fetch(`/api/policies/${event.params.policyId}`, {
			method: 'PATCH',
			body: JSON.stringify({ form, action: 'editRelatedCases' }),
			headers: {
				'Content-Type': 'appplication/json'
			}
		});

		redirect(303, `/policies/${event.params.policyId}`);
	},
	createCase: async (event) => {
		const form = await superValidate(event, zod(relatedCaseCreateFormSchema));
		let createReason = false;

		if (!form.valid) {
			return fail(400, { form });
		}

		if (event.locals.stage == 'vote') {
			return fail(400, { form });
		}

		if (form.data.userVote == 'allow' || form.data.userVote == 'disallow') {
			if (!form.data.reason) {
				return setError(form, 'reason', 'Reason required when your vote is allow or disallow');
			}
			createReason = true;
		}

		const res = await event.fetch('/api/cases', {
			method: 'POST',
			body: JSON.stringify({ form }),
			headers: {
				'Content-Type': 'appplication/json'
			}
		});
		const data = await res.json();
		const resNewCase = await event.fetch(`/api/cases/${data.id}`);
		const newCase = await resNewCase.json();

		if (createReason && res.ok) {
			const formReason = {
				data: {
					label: form.data.userVote,
					description: form.data.reason
				}
			};
			const resReason = await event.fetch(`/api/reasons`, {
				method: 'POST',
				body: JSON.stringify({ form: formReason, entity: 'cases', entityId: data.id }),
				headers: {
					'Content-Type': 'appplication/json'
				}
			});
			const reasonData = await resReason.json();
			newCase.reasons = [
				{
					id: reasonData.id,
					label: form.data.userVote,
					description: form.data.reason
				}
			];
		}

		return { form, caseId: data.id, label: form.data.label, newCase: newCase };
	}
};
