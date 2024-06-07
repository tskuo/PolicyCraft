import { json, error } from '@sveltejs/kit';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '$lib/firebase';

export const GET = async () => {
	try {
		const querySnapshot = await getDocs(collection(db, 'policy'));
		const res: any[] = [];
		querySnapshot.forEach((doc) => {
			const policy = { id: doc.id, ...doc.data() };
			res.push(policy);
		});
		return json(res);
	} catch (e) {
		throw error(400, 'Fail to fetch data from Firestore.');
	}
};

export const POST = async ({ request }) => {
	const { form } = await request.json();
	const id = 'testing';
	return json({ id }, { status: 201 });
};
