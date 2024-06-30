import { authenticateUser } from '$lib/auth';
import { db } from '$lib/firebase';
import { redirect, type Handle } from '@sveltejs/kit';
import { doc, getDoc } from 'firebase/firestore';

export const handle: Handle = async ({ event, resolve }) => {
	// Stage 1
	event.locals.user = await authenticateUser(event);

	if (event.route.id?.includes('(authed)')) {
		if (!event.locals.user) {
			throw redirect(303, '/login');
		}
	}

	const docSnap = await getDoc(doc(db, 'meta', 'code'));
	if (docSnap.exists()) {
		event.locals.stage = docSnap.data().stage;
	} else {
		event.locals.stage = null;
	}

	// Stage 2
	const response = await resolve(event);

	// Stage 3
	return response;
};
