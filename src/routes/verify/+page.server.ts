// import type { Actions, PageServerLoad } from './$types.js';
// import { auth } from '$lib/firebase';
// import { redirect } from '@sveltejs/kit';
// import { sendEmailVerification } from 'firebase/auth';

// export const load: PageServerLoad = async () => {
// 	if (!auth.currentUser) throw redirect(303, '/login');
// 	auth.currentUser.reload();
// 	auth.currentUser.getIdToken(true);
// 	if (auth.currentUser.emailVerified) throw redirect(303, '/');
// 	return { currentEmail: auth.currentUser.email };
// };

// export const actions: Actions = {
// 	sendLink: async () => {
// 		if (!auth.currentUser) throw redirect(303, '/login');

// 		// const actionCodeSettings = {
// 		// 	url: 'https://policycraft-dev.web.app'
// 		// };

// 		// sendEmailVerification(auth.currentUser, actionCodeSettings);
// 		sendEmailVerification(auth.currentUser);

// 		return { emailSent: true };
// 	}
// };
