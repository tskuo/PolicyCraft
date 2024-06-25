import { authenticateUser } from '$lib/auth';
import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	// Stage 1
	event.locals.user = await authenticateUser(event);

	if (event.route.id?.includes('(authed)')) {
		if (!event.locals.user) {
			throw redirect(303, '/login');
		}
	}

	// Stage 2
	const response = await resolve(event);

	// Stage 3
	return response;
};
