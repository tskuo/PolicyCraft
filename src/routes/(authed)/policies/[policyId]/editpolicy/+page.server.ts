import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { message, superValidate } from 'sveltekit-superforms';
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
		const formData = await event.request.formData();
		const form = await superValidate(formData, zod(policyEditFormSchema));

		// const form = await superValidate(event, zod(policyEditFormSchema));

		// Form is invalid
		if (!form.valid) {
			return fail(400, { form });
		}

		// No policy edit during the voting stage
		if (event.locals.stage == 'vote') {
			return fail(400, { form });
		}

		// Check if anyone else edited the policy during this period
		const res = await event.fetch(`/api/policies/${event.params.policyId}`);
		const uptodatePolicy = await res.json();

		if (
			uptodatePolicy.title !== formData.get('policyTitleBeforeEdit') ||
			uptodatePolicy.description !== formData.get('policyDescriptionBeforeEdit')
		) {
			return message(
				form,
				{
					uptodateTitle: uptodatePolicy.title,
					uptodateDescription: uptodatePolicy.description
				},
				{ status: 400 }
			);
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
