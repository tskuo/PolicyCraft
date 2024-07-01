import type { PageServerLoad, Actions } from './$types.js';
import { fail, redirect } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { userSignUpFormSchema } from '$lib/schema.js';
import { auth, db } from '$lib/firebase';
import { serverTimestamp, setDoc, doc, getDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(userSignUpFormSchema))
	};
};

export const actions: Actions = {
	userSignUp: async (event) => {
		// check form
		const form = await superValidate(event, zod(userSignUpFormSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		// check code
		const docSnap = await getDoc(doc(db, 'meta', 'code'));
		let passcode = crypto.randomUUID();
		if (docSnap.exists()) {
			passcode = docSnap.data().passcode;
		}

		if (form.data.code !== passcode) {
			return message(form, 'The code is incorrect.', {
				status: 403
			});
		}

		// create account
		try {
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				form.data.email,
				form.data.password
			);

			const newUserAuthToken = crypto.randomUUID();

			await setDoc(doc(db, 'users', userCredential.user.uid), {
				createAt: serverTimestamp(),
				displayName: form.data.displayName,
				email: form.data.email,
				role: 'regular',
				userAuthToken: newUserAuthToken
			});

			event.cookies.set('__session', newUserAuthToken, {
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
				secure: process.env.NODE_ENV === 'production',
				maxAge: 60 * 60 * 24 * 7 // 1 week
			});
		} catch (error) {
			let errorMessage = 'Invalid email or password. Please try again.';
			if (error.code == 'auth/email-already-in-use') {
				errorMessage = 'This email is already in use.';
			} else if (error.code == 'auth/weak-password') {
				errorMessage = 'Password should be at least 6 characters.';
			}
			return message(form, errorMessage, {
				status: 403
			});
		}

		throw redirect(303, '/');
	}
};
