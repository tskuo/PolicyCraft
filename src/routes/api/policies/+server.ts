import { json, error } from '@sveltejs/kit';
import { serverTimestamp, addDoc, collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '$lib/firebase';

// Get all policies from the database
export const GET = async ({ locals }) => {
	try {
		const querySnapshot = await getDocs(
			query(collection(db, 'policies'), orderBy('createAt', 'desc'))
		);
		const res: any[] = [];
		querySnapshot.forEach((doc) => {
			const policy = { id: doc.id, ...doc.data() };
			if (locals.stage !== 'vote' || (locals.stage == 'vote' && doc.data().cases.length > 0)) {
				res.push(policy);
			}
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
		const actionRef = await addDoc(collection(db, 'actionLogs'), {
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
		// survey for the study (should be removed later)
		await addDoc(collection(db, 'survey'), {
			action: 'createPolicy',
			actionLogId: actionRef.id,
			createAt: serverTimestamp(),
			response: form.data.survey
		});
		return json({ id: docRef.id }, { status: 201 });
	} catch {
		throw error(400, 'Fail to create a new policy in the database.');
	}
};
