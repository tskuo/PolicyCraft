import { collection, getDocs } from 'firebase/firestore';
import type { LayoutServerLoad } from './$types';
import { db } from '$lib/firebase';

export const load: LayoutServerLoad = async ({ locals }) => {
	// fetch user
	const userQuerySnapshot = await getDocs(collection(db, 'users'));
	const userDisplayNames = new Map();
	userQuerySnapshot.forEach((doc) => {
		userDisplayNames.set(doc.id, doc.data().displayName);
	});

	return {
		user: locals.user,
		userDisplayNames
	};
};
