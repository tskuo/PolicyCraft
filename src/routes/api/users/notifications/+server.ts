import { error, json } from '@sveltejs/kit';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '$lib/firebase';

export const GET = async ({ locals }) => {
	if (!locals.user) {
		throw error(400, 'User authentication error.');
	}
	const res: any[] = [];

	const q = query(
		collection(db, 'users', locals.user?.userId, 'notifications'),
		orderBy('createAt', 'desc')
	);

	const querySnapshot = await getDocs(q);
	querySnapshot.forEach((doc) => {
		res.push({ ...doc.data(), id: doc.id, createAt: doc.data().createAt.toDate() });
	});
	return json(res);
};
