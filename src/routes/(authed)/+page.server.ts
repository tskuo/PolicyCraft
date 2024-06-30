import type { PageServerLoad } from './$types.js';
import { error, fail, type Actions } from '@sveltejs/kit';
import { db } from '$lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { messageCreateFormSchema, discussionCreateFormSchema } from '$lib/schema';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async ({ fetch }) => {
	const docSnap = await getDoc(doc(db, 'meta', 'about'));
	if (docSnap.exists()) {
		const discussions = [];
		for (const discussionId of docSnap.data().discussions) {
			const response = await fetch(`/api/discussions/${discussionId}`);
			if (response.ok) {
				const dd = await response.json();
				dd.id = discussionId;
				discussions.push(dd);
			}
		}
		return {
			about: docSnap.data(),
			discussions,
			formMessage: await superValidate(zod(messageCreateFormSchema)),
			formDiscussion: await superValidate(zod(discussionCreateFormSchema))
		};
	}
	throw error(404);
};

export const actions: Actions = {
	createMessage: async (event) => {
		const form = await superValidate(event, zod(messageCreateFormSchema));

		if (!form.valid) {
			return fail(400, { form });
		}
		await event.fetch(`/api/discussions/${form.data.id}`, {
			method: 'PATCH',
			body: JSON.stringify({ form })
		});

		return { form };
	},
	createDiscussion: async (event) => {
		const form = await superValidate(event, zod(discussionCreateFormSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		await event.fetch(`/api/discussions`, {
			method: 'POST',
			body: JSON.stringify({ form, entity: 'meta', entityId: 'about' })
		});

		return { form };
	}
};
