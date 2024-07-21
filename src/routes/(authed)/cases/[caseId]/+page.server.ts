import { error, fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import {
	messageCreateFormSchema,
	discussionCreateFormSchema,
	reasonCreateFormSchema
} from '$lib/schema';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async ({ params, fetch }) => {
	// fetch case
	const res = await fetch(`/api/cases/${params.caseId}`);
	const c = await res.json();

	const resPolicy = await fetch(`/api/policies`);
	const policies = await resPolicy.json();
	const relatedPolicies = policies.filter((p) => p.cases.some((e) => e.caseId == params.caseId));

	if (res.ok) {
		const discussions = [];
		for (const discussionId of c.discussions) {
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

		const reasons = [];
		for (const reasonId of c.reasons) {
			const response = await fetch(`/api/reasons/${reasonId}`);
			if (response.ok) {
				const rr = await response.json();
				rr.id = reasonId;
				reasons.push(rr);
			} else {
				const rr = await response.json();
				console.log(rr.message);
			}
		}

		return {
			c,
			relatedPolicies,
			discussions,
			reasons,
			formMessage: await superValidate(zod(messageCreateFormSchema)),
			formDiscussion: await superValidate(zod(discussionCreateFormSchema)),
			formReason: await superValidate(zod(reasonCreateFormSchema))
		};
	}
	throw error(404, `Case #${params.caseId} doesn't exist.`);
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
			body: JSON.stringify({ form }),
			headers: {
				'Content-Type': 'appplication/json'
			}
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
			body: JSON.stringify({ form, entity: 'cases', entityId: event.params.caseId }),
			headers: {
				'Content-Type': 'appplication/json'
			}
		});

		const data = await res.json();

		return {
			form
		};
	},
	createReason: async (event) => {
		const form = await superValidate(event, zod(reasonCreateFormSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const res = await event.fetch(`/api/reasons`, {
			method: 'POST',
			body: JSON.stringify({ form, entity: 'cases', entityId: event.params.caseId }),
			headers: {
				'Content-Type': 'appplication/json'
			}
		});

		return {
			form
		};
	}
};
