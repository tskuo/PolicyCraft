import { json, error } from '@sveltejs/kit';
import { serverTimestamp, addDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '$lib/firebase';

// Get all cases from the database
export const GET = async () => {
	try {
		const querySnapshot = await getDocs(collection(db, 'cases'));
		const res: any[] = [];
		querySnapshot.forEach((doc) => {
			const c = { id: doc.id, ...doc.data() };
			res.push(c);
		});
		return json(res);
	} catch (e) {
		throw error(400, 'Fail to fetch data from Firestore.');
	}
};

// Create a new case
export const POST = async ({ request }) => {
	try {
		const { form } = await request.json();

		const userId = 'user1';
		let votes = { allow: [] as string[], disallow: [] as string[], unsure: [] as string[] };
		if (form.data.userVote == 'allow') {
			votes.allow = [userId];
		} else if (form.data.userVote == 'disallow') {
			votes.disallow = [userId];
		} else if (form.data.userVote == 'unsure') {
			votes.unsure = [userId];
		}

		const docRef = await addDoc(collection(db, 'cases'), {
			createAt: serverTimestamp(),
			description: form.data.description,
			discussions: [],
			reasons: {
				allow: [],
				disallow: []
			},
			title: form.data.title,
			votes: votes
		});

		const logRef = await addDoc(collection(db, 'actionLogs'), {
			action: 'createCase',
			createAt: serverTimestamp(),
			input: {
				title: form.data.title,
				description: form.data.description
			},
			targetCollection: 'cases',
			targetDocumentId: docRef.id,
			targetSubCollection: '',
			targetSubDocumentId: '',
			userId: 'user1'
		});
		return json({ id: docRef.id }, { status: 201 });
	} catch (e) {
		throw error(400, 'Fail to create a new case in the database.');
	}
};
