import type { PageServerLoad, Actions } from './$types.js';
import { fail, redirect } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { userLoginFormSchema } from '$lib/schema.js';
import { auth, db } from '$lib/firebase.js';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(userLoginFormSchema))
	};
};

export const actions: Actions = {
	userLogin: async (event) => {
		const form = await superValidate(event, zod(userLoginFormSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			const userCredential = await signInWithEmailAndPassword(
				auth,
				form.data.email,
				form.data.password
			);

			const updateduserAuthToken = crypto.randomUUID();

			await updateDoc(doc(db, 'users', userCredential.user.uid), {
				userAuthToken: updateduserAuthToken
			});

			event.cookies.set('userAuthToken', updateduserAuthToken, {
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
				secure: process.env.NODE_ENV === 'production',
				maxAge: 60 * 60 * 24 * 7 // 1 week
			});
		} catch {
			return message(form, 'Invalid email or password. Please try again.', {
				status: 403
			});
		}

		throw redirect(303, '/');
	}
};
