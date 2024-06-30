import { error, fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import {
	messageCreateFormSchema,
	discussionCreateFormSchema,
	reasonCreateFormSchema
} from '$lib/schema';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async ({ params, fetch, locals }) => {
	// fetch policy
	const res = await fetch(`/api/policies/${params.policyId}`);
	const policy = await res.json();

	if (res.ok) {
		const cases = [];
		for (const c of policy.cases) {
			const response = await fetch(`/api/cases/${c.caseId}`);
			if (response.ok) {
				const cc = await response.json();
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
				cases.push(cc);
			} else {
				const cc = await response.json();
				console.log(cc.message);
			}
		}

		const discussions = [];
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

		const reasons = [];
		for (const reasonId of policy.reasons) {
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
			stage: locals.stage,
			policy,
			cases,
			discussions,
			reasons,
			formMessage: await superValidate(zod(messageCreateFormSchema)),
			formDiscussion: await superValidate(zod(discussionCreateFormSchema)),
			formReason: await superValidate(zod(reasonCreateFormSchema))
		};
	}

	throw error(404, `Policy #${params.policyId} doesn't exist.`);
};

export const actions: Actions = {
	createMessage: async (event) => {
		const form = await superValidate(event, zod(messageCreateFormSchema));

		if (!form.valid) {
			return fail(400, { form });
		}
		const res = await event.fetch(`/api/discussions/${form.data.id}`, {
			method: 'PATCH',
			body: JSON.stringify({ form })
		});
		const data = await res.json();

		return { form };
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

		return { form };
	},
	createReason: async (event) => {
		const form = await superValidate(event, zod(reasonCreateFormSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		if (event.locals.stage !== 'vote') {
			return fail(400, form);
		}

		await event.fetch(`/api/reasons`, {
			method: 'POST',
			body: JSON.stringify({ form, entity: 'policies', entityId: event.params.policyId })
		});

		return { form };
	}
};
