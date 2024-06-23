import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { policyEditCaseFormSchema } from '$lib/schema';

export const load: PageServerLoad = async ({ fetch, params }) => {
	try {
		const resPolicy = await fetch(`/api/policies/${params.policyId}`);
		const policy = await resPolicy.json();

		const resCases = await fetch('/api/cases');
		const allCases = await resCases.json();

		const form = await superValidate(zod(policyEditCaseFormSchema));

		form.data.cases = policy.cases;
		return { policy, form, allCases };
	} catch {
		throw error(404, 'Fail to load this page.');
	}

	// throw redirect(307, '/policy');
};

export const actions: Actions = {
	editRelatedCases: async (event) => {
		const form = await superValidate(event, zod(policyEditCaseFormSchema));

		if (!form.valid) {
			return fail(400, { form });
		} else {
			await event.fetch(`/api/policies/${event.params.policyId}`, {
				method: 'PATCH',
				body: JSON.stringify({ form, action: 'editRelatedCases' }),
				headers: {
					'Content-Type': 'appplication/json'
				}
			});
			redirect(303, `/policies/${event.params.policyId}`);
		}
	}
};
