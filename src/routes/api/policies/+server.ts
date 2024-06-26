import { json, error } from '@sveltejs/kit';
import { serverTimestamp, addDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '$lib/firebase';

// Get all policies from the database
export const GET = async () => {
	try {
		const querySnapshot = await getDocs(collection(db, 'policies'));
		const res: any[] = [];
		querySnapshot.forEach((doc) => {
			const policy = { id: doc.id, ...doc.data() };
			res.push(policy);
		});
		return json(res);
	} catch {
		throw error(400, 'Fail to fetch data from Firestore.');
	}
};

// Create a new policy
export const POST = async ({ request, locals }) => {
	try {
		if (!locals.user) {
			throw error(400, 'User authentication error.');
		}

		const { form } = await request.json();
		const docRef = await addDoc(collection(db, 'policies'), {
			cases: [],
			createAt: serverTimestamp(),
			description: form.data.description,
			discussions: [],
			reasons: [],
			title: form.data.title,
			votes: {
				upvote: [],
				downvote: []
			},
			watchList: [locals.user?.userId]
		});
		await addDoc(collection(db, 'actionLogs'), {
			action: 'createPolicy',
			createAt: serverTimestamp(),
			input: {
				title: form.data.title,
				description: form.data.description
			},
			targetCollection: 'policies',
			targetDocumentId: docRef.id,
			targetSubCollection: '',
			targetSubDocumentId: '',
			userId: locals.user?.userId
		});
		return json({ id: docRef.id }, { status: 201 });
	} catch {
		throw error(400, 'Fail to create a new policy in the database.');
	}
};
