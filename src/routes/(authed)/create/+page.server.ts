// export const actions = {
// 	default: async ({ cookies, request }) => {
// 		const data = await request.formData();
// 		console.log(data.get('title'), data.get('description'));
// 	}
// };

import type { PageServerLoad, Actions } from './$types.js';
import { fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { polictCreateFormSchema } from './schema';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(polictCreateFormSchema))
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(polictCreateFormSchema));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}
		console.log(form);
		const res = await event.fetch('/api/policy', {
			method: 'POST',
			body: JSON.stringify({ form }),
			headers: {
				'Content-Type': 'appplication/json'
			}
		});
		// console.log(res);
		const test = await res.json();
		console.log(test);
		return {
			form
		};
	}
};
