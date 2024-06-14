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

export const PATCH = async ({ request, params }) => {
	try {
		const { pressed } = await request.json();
		let actionName = '';
		if (pressed) {
			actionName = 'likeReason';
			await updateDoc(doc(db, 'reasons', params.reasonId), {
				likeList: arrayUnion('user1')
			});
		} else {
			actionName = 'unlikeReason';
			await updateDoc(doc(db, 'reasons', params.reasonId), {
				likeList: arrayRemove('user1')
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
			userId: 'user1'
		});

		return json({ status: 201 });
	} catch (e) {
		throw error(400, 'Fail to add a message to the discussion');
	}
};
