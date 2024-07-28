import { collection, getDocs } from 'firebase/firestore';
import type { LayoutServerLoad } from './$types';
import { db } from '$lib/firebase';

export const load: LayoutServerLoad = async ({ locals }) => {
	// fetch user
	const userQuerySnapshot = await getDocs(collection(db, 'users'));
	const userDisplayNames = new Map();
	let adminCount = 0;
	userQuerySnapshot.forEach((doc) => {
		userDisplayNames.set(doc.id, doc.data().displayName);
		if (doc.data().role == 'admin') {
			adminCount += 1;
		}
	});

	return {
		user: locals.user,
		stage: locals.stage,
		userDisplayNames: userDisplayNames,
		userCounts: userDisplayNames.size - adminCount
	};
};
