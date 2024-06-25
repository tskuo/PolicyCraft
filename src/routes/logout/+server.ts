import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { auth } from '$lib/firebase';
import { signOut } from 'firebase/auth';

export const POST: RequestHandler = async ({ cookies }) => {
	await signOut(auth);
	cookies.set('auth', '', {
		path: '/',
		expires: new Date(0)
	});
	throw redirect(303, '/login');
};
