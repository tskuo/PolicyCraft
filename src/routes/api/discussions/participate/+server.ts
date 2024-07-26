import { json, error } from '@sveltejs/kit';
import { collection, query, where, getDocs, getCountFromServer } from 'firebase/firestore';
import { db } from '$lib/firebase';

// get the discussion initiated by a user
export const GET = async ({ locals }) => {
	if (!locals.user) {
		throw error(400, 'User authentication error.');
	} else {
		try {
			// not initiated by the user
			const q = query(collection(db, 'discussions'), where('userId', '!=', locals.user.userId));
			const querySnapshot = await getDocs(q);
			const discussions: any[] = [];
			const res: any[] = [];

			querySnapshot.forEach((doc) => {
				const discussion = { id: doc.id, ...doc.data() };
				discussions.push(discussion);
			});

			for (const d of discussions) {
				const commentQuery = query(
					collection(db, 'discussions', d.id, 'comments'),
					where('userId', '==', locals.user.userId)
				);
				const commentQuerySnapShot = await getCountFromServer(commentQuery);
				if (commentQuerySnapShot.data().count !== 0) {
					res.push(d);
				}
			}

			return json(res);
		} catch {
			throw error(400, 'Fail to fetch data from Firestore.');
		}
	}
};
