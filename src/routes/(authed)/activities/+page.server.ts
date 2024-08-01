import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ fetch }) => {
	const res = await fetch('api/actionLogs');
	const userActionLogs = await res.json();

	userActionLogs
		.sort((actionA, actionB) => {
			const a = actionA.createAt;
			const b = actionB.createAt;
			if (a < b) return -1;
			else if (a > b) return 1;
			return 0;
		})
		.reverse();

	return { userActionLogs };
};
