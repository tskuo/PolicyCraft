import type { PageServerLoad, Actions } from './$types.js';
import { fail, redirect } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { policyCreateFormSchema, caseCreateFormSchema } from '$lib/schema.js';

export const load: PageServerLoad = async ({ fetch, locals }) => {
	if (locals.stage == 'vote') {
		throw redirect(303, '/');
	}

	const resCases = await fetch('/api/cases');
	const cases = await resCases.json();

	const resPolicies = await fetch('/api/policies');
	const policies = await resPolicies.json();

	return {
		form1: await superValidate(zod(policyCreateFormSchema)),
		form2: await superValidate(zod(caseCreateFormSchema)),
		cases,
		policies
	};
};

export const actions: Actions = {
	createPolicy: async (event) => {
		const form = await superValidate(event, zod(policyCreateFormSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		if (event.locals.stage == 'vote') {
			return fail(400, { form });
		}

		const res = await event.fetch('/api/policies', {
			method: 'POST',
			body: JSON.stringify({ form }),
			headers: {
				'Content-Type': 'appplication/json'
			}
		});
		const data = await res.json();
		throw redirect(303, `/policies/${data.id}`);
	},
	createCase: async (event) => {
		const form = await superValidate(event, zod(caseCreateFormSchema));
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

		if (createReason && res.ok) {
			const formReason = {
				data: {
					label: form.data.userVote,
					description: form.data.reason
				}
			};
			await event.fetch(`/api/reasons`, {
				method: 'POST',
				body: JSON.stringify({ form: formReason, entity: 'cases', entityId: data.id }),
				headers: {
					'Content-Type': 'appplication/json'
				}
			});
		}
		throw redirect(303, `/cases/${data.id}`);
	}
};
