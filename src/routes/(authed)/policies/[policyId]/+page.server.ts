import { error, fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { messageCreateFormSchema, discussionCreateFormSchema } from '$lib/schema';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async ({ params, fetch }) => {
	const res = await fetch(`/api/policies/${params.policyId}`);
	const policy = await res.json();

	if (res.ok) {
		let cases = [];
		for (const c of policy.cases) {
			const response = await fetch(`/api/cases/${c.caseId}`);
			if (response.ok) {
				const cc = await response.json();
				cc.label = c.label;
				cases.push(cc);
			} else {
				const cc = await response.json();
				console.log(cc.message);
			}
		}

		let discussions = [];
		for (const discussionId of policy.discussions) {
			const response = await fetch(`/api/discussions/${discussionId}`);
			if (response.ok) {
				const dd = await response.json();
				dd.id = discussionId;
				discussions.push(dd);
			} else {
				const dd = await response.json();
				console.log(dd.message);
			}
		}

		return {
			policy,
			cases,
			discussions,
			formMessage: await superValidate(zod(messageCreateFormSchema)),
			formDiscussion: await superValidate(zod(discussionCreateFormSchema))
		};
	}

	throw error(404, `Policy #${params.policyId} doesn't exist.`);
	// throw redirect(307, '/policy');
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
	},
	createDiscussion: async (event) => {
		const form = await superValidate(event, zod(discussionCreateFormSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const res = await event.fetch(`/api/discussions`, {
			method: 'POST',
			body: JSON.stringify({ form, entity: 'policies', entityId: event.params.policyId })
		});

		const data = await res.json();

		console.log(data.id);
		return {
			form
		};
	}
};
