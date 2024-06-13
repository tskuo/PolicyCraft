import { json, error } from '@sveltejs/kit';
import {
	addDoc,
	collection,
	doc,
	getDoc,
	getDocs,
	orderBy,
	query,
	serverTimestamp
} from 'firebase/firestore';
import { db } from '$lib/firebase';

export const GET = async ({ params }) => {
	const docRef = doc(db, 'discussions', params.discussionId);
	const docSnap = await getDoc(docRef);

	const subColRef = collection(db, 'discussions', params.discussionId, 'comments');
	const querySnapshot = await getDocs(query(subColRef, orderBy('createAt')));
	const comments: any[] = [];
	querySnapshot.forEach((doc) => {
		comments.push(doc.data());
	});

	if (docSnap.exists()) {
		return json({ ...docSnap.data(), id: docSnap.id, comments: comments });
	}
	throw error(404, `Discussion #${params.discussionId} not found.`);
};

export const PATCH = async ({ request }) => {
	try {
		const { form } = await request.json();

		const docRef = await addDoc(collection(db, 'discussions', form.data.id, 'comments'), {
			createAt: serverTimestamp(),
			message: form.data.message,
			userId: 'user1'
		});

		await addDoc(collection(db, 'actionLogs'), {
			action: 'createComment',
			createAt: serverTimestamp(),
			input: {
				title: '',
				description: form.data.message
			},
			targetCollection: 'discussions',
			targetDocumentId: form.data.id,
			targetSubCollection: 'comments',
			targetSubDocumentId: docRef.id,
			userId: 'user1'
		});

		return json({ status: 201 });
	} catch (e) {
		throw error(400, 'Fail to add a message to the discussion');
	}
};
