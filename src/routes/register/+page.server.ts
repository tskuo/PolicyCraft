import type { PageServerLoad, Actions } from './$types.js';
import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { userSignUpFormSchema } from '$lib/schema.js';
import { auth, db } from '$lib/firebase';
import { serverTimestamp, setDoc, doc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(userSignUpFormSchema))
	};
};

export const actions: Actions = {
	userSignUp: async (event) => {
		const form = await superValidate(event, zod(userSignUpFormSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const userCredential = await createUserWithEmailAndPassword(
			auth,
			form.data.email,
			form.data.password
		);

		await setDoc(doc(db, 'users', userCredential.user.uid), {
			createAt: serverTimestamp(),
			displayName: form.data.displayName,
			email: form.data.email,
			role: 'regular'
		});

		event.cookies.set('auth', 'regularusertoken', {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			secure: process.env.NODE_ENV === 'production',
			maxAge: 60 * 60 * 24 * 7 // 1 week
		});

		throw redirect(303, '/');
	}
};
