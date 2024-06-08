import { json, error } from '@sveltejs/kit';
import { serverTimestamp, addDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '$lib/firebase';

// Get all policies from the database
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

// Create a new policy
export const POST = async ({ request }) => {
	try {
		const { form } = await request.json();
		const docRef = await addDoc(collection(db, 'policy'), {
			cases: [],
			createAt: serverTimestamp(),
			description: form.data.description,
			openDiscussions: [],
			title: form.data.title,
			watchList: []
		});
		return json({ id: docRef.id }, { status: 201 });
	} catch (e) {
		throw error(400, 'Fail to create a new policy in the database.');
	}

	// const { form } = await request.json();
	// console.log(form.data.title);
	// const id = 'testing';
	// return json({ id }, { status: 201 });
};
