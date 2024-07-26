import { json, error } from '@sveltejs/kit';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '$lib/firebase';

// get the discussion initiated by a user
export const GET = async ({ locals }) => {
	if (!locals.user) {
		throw error(400, 'User authentication error.');
	}
	try {
		const q = query(collection(db, 'discussions'), where('userId', '==', locals.user.userId));
		const querySnapshot = await getDocs(q);
		const res: any[] = [];
		querySnapshot.forEach((doc) => {
			const discussion = { id: doc.id, ...doc.data() };
			res.push(discussion);
		});
		return json(res);
	} catch {
		throw error(400, 'Fail to fetch data from Firestore.');
	}
};
