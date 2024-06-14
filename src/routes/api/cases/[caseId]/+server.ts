import { json, error } from '@sveltejs/kit';
import {
	addDoc,
	arrayRemove,
	arrayUnion,
	collection,
	doc,
	getDoc,
	getDocs,
	query,
	serverTimestamp,
	updateDoc,
	where
} from 'firebase/firestore';
import { db } from '$lib/firebase';

export const GET = async ({ params }) => {
	const docRef = doc(db, 'cases', params.caseId);
	const docSnap = await getDoc(docRef);
	if (docSnap.exists()) {
		return json({ ...docSnap.data(), id: docSnap.id });
	}
	throw error(404, `Policy #${params.caseId} not found.`);
};

export const PATCH = async ({ request, params }) => {
	try {
		const { value } = await request.json();
		let actionName = 'voteCase';
		let actionInput = value;

		if (value == 'allow') {
			await updateDoc(doc(db, 'cases', params.caseId), {
				'votes.allow': arrayUnion('user1'),
				'votes.disallow': arrayRemove('user1'),
				'votes.unsure': arrayRemove('user1')
			});
		} else if (value == 'disallow') {
			await updateDoc(doc(db, 'cases', params.caseId), {
				'votes.disallow': arrayUnion('user1'),
				'votes.allow': arrayRemove('user1'),
				'votes.unsure': arrayRemove('user1')
			});
		} else if (value == 'unsure') {
			await updateDoc(doc(db, 'cases', params.caseId), {
				'votes.unsure': arrayUnion('user1'),
				'votes.allow': arrayRemove('user1'),
				'votes.disallow': arrayRemove('user1')
			});
		} else {
			await updateDoc(doc(db, 'cases', params.caseId), {
				'votes.allow': arrayRemove('user1'),
				'votes.disallow': arrayRemove('user1'),
				'votes.unsure': arrayRemove('user1')
			});
			actionName = 'unvoteCase';
			actionInput = '';
		}

		await addDoc(collection(db, 'actionLogs'), {
			action: actionName,
			createAt: serverTimestamp(),
			input: {
				title: actionInput,
				description: ''
			},
			targetCollection: 'cases',
			targetDocumentId: params.caseId,
			targetSubCollection: '',
			targetSubDocumentId: '',
			userId: 'user1'
		});

		return json({ status: 201 });
	} catch (e) {
		throw error(400, 'Fail to update user vote.');
	}
};
