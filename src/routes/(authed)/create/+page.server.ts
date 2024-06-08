import type { PageServerLoad, Actions } from './$types.js';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { policyCreateFormSchema } from '$lib/schema.js';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(policyCreateFormSchema))
	};
};

export const actions: Actions = {
	createPolicy: async (event) => {
		const form = await superValidate(event, zod(policyCreateFormSchema));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}
		const res = await event.fetch('/api/policy', {
			method: 'POST',
			body: JSON.stringify({ form })
			// headers: {
			// 	'Content-Type': 'appplication/json'
			// }
		});
		const test = await res.json();
		throw redirect(303, `/policy/${test.id}`);
		// return {
		// 	form
		// };
	}
};
