import { json, error } from '@sveltejs/kit';
import {
	addDoc,
	arrayRemove,
	arrayUnion,
	collection,
	doc,
	getDoc,
	serverTimestamp,
	updateDoc
} from 'firebase/firestore';
import { db } from '$lib/firebase';

export const GET = async ({ params }) => {
	const docRef = doc(db, 'reasons', params.reasonId);
	const docSnap = await getDoc(docRef);

	if (docSnap.exists()) {
		return json({ ...docSnap.data(), id: docSnap.id });
	}
	throw error(404, `Reason #${params.reasonId} not found.`);
};

export const PATCH = async ({ request, params, locals }) => {
	if (!locals.user) {
		throw error(400, 'User authentication error.');
	}
	try {
		const { pressed } = await request.json();
		let actionName = '';
		if (pressed) {
			actionName = 'likeReason';
			await updateDoc(doc(db, 'reasons', params.reasonId), {
				likeList: arrayUnion(locals.user.userId)
			});
		} else {
			actionName = 'unlikeReason';
			await updateDoc(doc(db, 'reasons', params.reasonId), {
				likeList: arrayRemove(locals.user.userId)
			});
		}
		await addDoc(collection(db, 'actionLogs'), {
			action: actionName,
			createAt: serverTimestamp(),
			input: {
				title: '',
				description: ''
			},
			targetCollection: 'reasons',
			targetDocumentId: params.reasonId,
			targetSubCollection: '',
			targetSubDocumentId: '',
			userId: locals.user.userId
		});

		return json({ status: 201 });
	} catch {
		throw error(400, 'Fail to add a message to the discussion');
	}
};
