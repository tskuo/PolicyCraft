import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { auth } from '$lib/firebase';
import { signOut } from 'firebase/auth';

export const POST: RequestHandler = async ({ cookies }) => {
	cookies.set('userAuthToken', '', {
		path: '/',
		expires: new Date(0)
	});
	await signOut(auth);
	throw redirect(303, '/login');
};
