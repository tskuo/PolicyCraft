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
	const docRef = doc(db, 'cases', params.caseId);
	const docSnap = await getDoc(docRef);
	if (docSnap.exists()) {
		return json({ ...docSnap.data(), id: docSnap.id });
	}
	throw error(404, `Case #${params.caseId} not found.`);
};

export const PATCH = async ({ request, params, locals }) => {
	if (!locals.user) {
		throw error(400, 'User authentication error.');
	}
	try {
		const { value } = await request.json();
		let actionName = 'voteCase';
		let actionInput = value;
		const userId = locals.user.userId;

		if (value == 'allow') {
			await updateDoc(doc(db, 'cases', params.caseId), {
				'votes.allow': arrayUnion(userId),
				'votes.disallow': arrayRemove(userId),
				'votes.unsure': arrayRemove(userId)
			});
		} else if (value == 'disallow') {
			await updateDoc(doc(db, 'cases', params.caseId), {
				'votes.disallow': arrayUnion(userId),
				'votes.allow': arrayRemove(userId),
				'votes.unsure': arrayRemove(userId)
			});
		} else if (value == 'unsure') {
			await updateDoc(doc(db, 'cases', params.caseId), {
				'votes.unsure': arrayUnion(userId),
				'votes.allow': arrayRemove(userId),
				'votes.disallow': arrayRemove(userId)
			});
		} else {
			await updateDoc(doc(db, 'cases', params.caseId), {
				'votes.allow': arrayRemove(userId),
				'votes.disallow': arrayRemove(userId),
				'votes.unsure': arrayRemove(userId)
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
			userId: userId
		});

		return json({ status: 201 });
	} catch {
		throw error(400, 'Fail to update user vote.');
	}
};
