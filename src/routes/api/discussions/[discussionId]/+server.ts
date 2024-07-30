import { json, error } from '@sveltejs/kit';
import {
	addDoc,
	collection,
	doc,
	getDoc,
	getDocs,
	orderBy,
	query,
	serverTimestamp,
	updateDoc
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

export const PATCH = async ({ request, locals, params }) => {
	if (!locals.user) {
		throw error(400, 'User authentication error.');
	}
	try {
		const { form, action, entity, entityId } = await request.json();

		if (action == 'closeDiscussion') {
			await updateDoc(doc(db, 'discussions', params.discussionId), {
				open: false
			});

			await addDoc(collection(db, 'actionLogs'), {
				action: 'closeDiscussion',
				createAt: serverTimestamp(),
				input: {
					title: '',
					description: ''
				},
				targetCollection: 'discussions',
				targetDocumentId: params.discussionId,
				targetSubCollection: '',
				targetSubDocumentId: '',
				userId: locals.user.userId
			});

			return json({ status: 201 });
		} else {
			const docRef = await addDoc(collection(db, 'discussions', form.data.id, 'comments'), {
				createAt: serverTimestamp(),
				message: form.data.message,
				userId: locals.user.userId
			});

			await addDoc(collection(db, 'actionLogs'), {
				action: 'createComment',
				createAt: serverTimestamp(),
				input: {
					title: '',
					description: form.data.message
				},
				linkedEntity: entity,
				linkedEntityId: entityId,
				targetCollection: 'discussions',
				targetDocumentId: form.data.id,
				targetSubCollection: 'comments',
				targetSubDocumentId: docRef.id,
				userId: locals.user.userId
			});
			return json({ status: 201 });
		}
	} catch {
		throw error(400, 'Fail to add a message to the discussion');
	}
};
