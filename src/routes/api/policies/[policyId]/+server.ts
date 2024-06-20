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
	const docRef = doc(db, 'policies', params.policyId);
	const docSnap = await getDoc(docRef);
	if (docSnap.exists()) {
		return json({ ...docSnap.data(), id: docSnap.id });
	}
	throw error(404, `Policy #${params.policyId} not found.`);
};

export const PATCH = async ({ request, params }) => {
	try {
		const { pressed, form, action } = await request.json();
		if (action == 'updateWatchList') {
			let actionName = '';
			if (pressed) {
				actionName = 'watchPolicy';
				await updateDoc(doc(db, 'policies', params.policyId), {
					watchList: arrayUnion('user1')
				});
			} else {
				actionName = 'unwatchPolicy';
				await updateDoc(doc(db, 'policies', params.policyId), {
					watchList: arrayRemove('user1')
				});
			}
			await addDoc(collection(db, 'actionLogs'), {
				action: actionName,
				createAt: serverTimestamp(),
				input: {
					title: '',
					description: ''
				},
				targetCollection: 'policies',
				targetDocumentId: params.policyId,
				targetSubCollection: '',
				targetSubDocumentId: '',
				userId: 'user1'
			});
			return json({ status: 201 });
		} else if (action == 'editPolicy') {
			const docSnap = await getDoc(doc(db, 'policies', params.policyId));
			const originalPolicy = docSnap.data();
			let originalCases = new Map();
			if (originalPolicy) {
				originalPolicy.cases.forEach((c: { caseId: string; label: string }) => {
					originalCases.set(c.caseId, c.label);
				});
			}

			await updateDoc(doc(db, 'policies', params.policyId), {
				title: form.data.title,
				description: form.data.description,
				cases: form.data.cases
			});
			await addDoc(collection(db, 'actionLogs'), {
				action: 'editPolicy',
				createAt: serverTimestamp(),
				input: {
					title: form.data.title,
					description: form.data.description
				},
				targetCollection: 'policies',
				targetDocumentId: params.policyId,
				targetSubCollection: '',
				targetSubDocumentId: '',
				userId: 'user1'
			});

			for (const c of form.data.cases) {
				if (c.label !== originalCases.get(c.caseId)) {
					await addDoc(collection(db, 'actionLogs'), {
						action: 'editCaseWhileEditingPolicy',
						createAt: serverTimestamp(),
						input: {
							title: c.caseId,
							description: c.label
						},
						targetCollection: 'policies',
						targetDocumentId: params.policyId,
						targetSubCollection: '',
						targetSubDocumentId: '',
						userId: 'user1'
					});
				}
			}

			return json({ status: 201 });
		}
		throw error(400, 'Sorry, something went wrong.');
	} catch (e) {
		throw error(400, 'Sorry, something went wrong.');
	}
};
