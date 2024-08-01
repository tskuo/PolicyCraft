import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ fetch }) => {
	const res = await fetch('api/users/notifications');
	const userNotifications = await res.json();

	return { userNotifications };
};
