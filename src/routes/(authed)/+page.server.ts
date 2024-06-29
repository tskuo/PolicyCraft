import type { PageServerLoad } from './$types.js';
import { error } from '@sveltejs/kit';
import { db } from '$lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export const load: PageServerLoad = async () => {
	const docSnap = await getDoc(doc(db, 'meta', 'about'));
	if (docSnap.exists()) {
		return {
			about: docSnap.data()
		};
	}
	throw error(404);
};
