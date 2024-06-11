import { error, fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { messageCreateFormSchema } from '$lib/schema';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async ({ params, fetch }) => {
	const res = await fetch(`/api/cases/${params.caseId}`);
	const c = await res.json();

	if (res.ok) {
		let discussions = [];
		for (const d of c.discussions) {
			const response = await fetch(`/api/discussions/${d}`);
			if (response.ok) {
				const dd = await response.json();
				dd.id = d;
				discussions.push(dd);
			} else {
				const dd = await response.json();
				console.log(dd.message);
			}
		}
		return { c, discussions, form: await superValidate(zod(messageCreateFormSchema)) };
	}
	throw error(404, `Case #${params.caseId} doesn't exist.`);
	// throw redirect(307, '/case');
};

export const actions: Actions = {
	createMessage: async (event) => {
		const form = await superValidate(event, zod(messageCreateFormSchema));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}
		const res = await event.fetch(`/api/discussions/${form.data.id}`, {
			method: 'PATCH',
			body: JSON.stringify({ form })
			// headers: {
			// 	'Content-Type': 'appplication/json'
			// }
		});
		const data = await res.json();

		return {
			form
		};
	}
};
