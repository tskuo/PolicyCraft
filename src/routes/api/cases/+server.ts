import { json, error } from '@sveltejs/kit';
import { serverTimestamp, addDoc, collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '$lib/firebase';

// Get all cases from the database
export const GET = async () => {
	try {
		const querySnapshot = await getDocs(
			query(collection(db, 'cases'), orderBy('createAt', 'desc'))
		);
		const res: any[] = [];
		querySnapshot.forEach((doc) => {
			const c = { id: doc.id, ...doc.data() };
			res.push(c);
		});
		return json(res);
	} catch {
		throw error(400, 'Fail to fetch data from Firestore.');
	}
};

// Create a new case
export const POST = async ({ request, locals }) => {
	try {
		const { form } = await request.json();

		if (!locals.user) {
			throw error(400, 'User authentication error.');
		}

		const votes = { allow: [] as string[], disallow: [] as string[], unsure: [] as string[] };
		if (form.data.userVote == 'allow') {
			votes.allow = [locals.user.userId];
		} else if (form.data.userVote == 'disallow') {
			votes.disallow = [locals.user.userId];
		} else if (form.data.userVote == 'unsure') {
			votes.unsure = [locals.user.userId];
		}

		const docRef = await addDoc(collection(db, 'cases'), {
			createAt: serverTimestamp(),
			description: form.data.description,
			discussions: [],
			reasons: [],
			title: form.data.title,
			votes: votes
		});

		await addDoc(collection(db, 'actionLogs'), {
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
			userId: locals.user.userId
		});
		return json({ id: docRef.id }, { status: 201 });
	} catch {
		throw error(400, 'Fail to create a new case in the database.');
	}
};
