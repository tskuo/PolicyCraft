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

export const PATCH = async ({ request, params, locals }) => {
	if (!locals.user) {
		throw error(400, 'User authentication error.');
	}
	try {
		const { pressed, form, action, vote, addedCaseId, editedCaseId, removedCaseId } =
			await request.json();
		if (action == 'updateWatchList') {
			let actionName = '';
			if (pressed) {
				actionName = 'watchPolicy';
				await updateDoc(doc(db, 'policies', params.policyId), {
					watchList: arrayUnion(locals.user.userId)
				});
			} else {
				actionName = 'unwatchPolicy';
				await updateDoc(doc(db, 'policies', params.policyId), {
					watchList: arrayRemove(locals.user.userId)
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
				userId: locals.user.userId
			});
			return json({ status: 201 });
		} else if (action == 'editPolicy') {
			const docSnap = await getDoc(doc(db, 'policies', params.policyId));
			const originalPolicy = docSnap.data();
			const originalCases = new Map();
			if (originalPolicy) {
				originalPolicy.cases.forEach((c: { caseId: string; label: string }) => {
					originalCases.set(c.caseId, c.label);
				});
			}

			// await updateDoc(doc(db, 'policies', params.policyId), {
			// 	title: form.data.title,
			// 	description: form.data.description,
			// 	cases: form.data.cases
			// });

			if (
				originalPolicy?.title !== form.data.title ||
				originalPolicy?.description !== form.data.description
			) {
				await updateDoc(doc(db, 'policies', params.policyId), {
					title: form.data.title,
					description: form.data.description
				});

				const actionRef = await addDoc(collection(db, 'actionLogs'), {
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
					userId: locals.user.userId
				});
				// survey for the study (should be removed later)
				await addDoc(collection(db, 'survey'), {
					action: 'editPolicy',
					actionLogId: actionRef.id,
					createAt: serverTimestamp(),
					response: form.data.survey
				});
			}

			for (const c of form.data.cases) {
				if (originalCases.has(c.caseId)) {
					if (c.label !== originalCases.get(c.caseId)) {
						await updateDoc(doc(db, 'policies', params.policyId), {
							cases: arrayRemove({
								caseId: c.caseId,
								label: originalCases.get(c.caseId)
							})
						});

						await updateDoc(doc(db, 'policies', params.policyId), {
							cases: arrayUnion({
								caseId: c.caseId,
								label: c.label
							})
						});

						await addDoc(collection(db, 'actionLogs'), {
							action: 'editRelatedCaseLabelWhileEditingPolicy',
							createAt: serverTimestamp(),
							input: {
								title: c.caseId,
								description: c.label
							},
							targetCollection: 'policies',
							targetDocumentId: params.policyId,
							targetSubCollection: '',
							targetSubDocumentId: '',
							userId: locals.user.userId
						});
					}
				}
			}

			return json({ status: 201 });
		} else if (action == 'editRelatedCases') {
			const docSnap = await getDoc(doc(db, 'policies', params.policyId));
			const originalPolicy = docSnap.data();
			const originalCases = new Map();
			if (originalPolicy) {
				originalPolicy.cases.forEach((c: { caseId: string; label: string }) => {
					originalCases.set(c.caseId, c.label);
				});
			}

			for (const c of form.data.cases) {
				if (addedCaseId.includes(c.caseId) && !originalCases.has(c.caseId)) {
					await updateDoc(doc(db, 'policies', params.policyId), {
						cases: arrayUnion({
							caseId: c.caseId,
							label: c.label
						})
					});
					await addDoc(collection(db, 'actionLogs'), {
						action: 'addRelatedCase',
						createAt: serverTimestamp(),
						input: {
							title: c.caseId,
							description: c.label
						},
						targetCollection: 'policies',
						targetDocumentId: params.policyId,
						targetSubCollection: '',
						targetSubDocumentId: '',
						userId: locals.user.userId
					});
				} else if (
					(editedCaseId.includes(c.caseId) || addedCaseId.includes(c.caseId)) &&
					originalCases.has(c.caseId) &&
					originalCases.get(c.caseId) !== c.label
				) {
					await updateDoc(doc(db, 'policies', params.policyId), {
						cases: arrayRemove({
							caseId: c.caseId,
							label: originalCases.get(c.caseId)
						})
					});

					await updateDoc(doc(db, 'policies', params.policyId), {
						cases: arrayUnion({
							caseId: c.caseId,
							label: c.label
						})
					});

					await addDoc(collection(db, 'actionLogs'), {
						action: 'editRelatedCaseLabel',
						createAt: serverTimestamp(),
						input: {
							title: c.caseId,
							description: c.label
						},
						targetCollection: 'policies',
						targetDocumentId: params.policyId,
						targetSubCollection: '',
						targetSubDocumentId: '',
						userId: locals.user.userId
					});
				}
			}

			for (const caseId of removedCaseId) {
				if (originalCases.has(caseId)) {
					await updateDoc(doc(db, 'policies', params.policyId), {
						cases: arrayRemove({
							caseId: caseId,
							label: originalCases.get(caseId)
						})
					});
					await addDoc(collection(db, 'actionLogs'), {
						action: 'removeRelatedCases',
						createAt: serverTimestamp(),
						input: {
							title: caseId,
							description: ''
						},
						targetCollection: 'policies',
						targetDocumentId: params.policyId,
						targetSubCollection: '',
						targetSubDocumentId: '',
						userId: locals.user.userId
					});
				}
			}

			// await updateDoc(doc(db, 'policies', params.policyId), {
			// 	cases: form.data.cases
			// });

			// for (const c of form.data.cases) {
			// 	let actionName = '';
			// 	if (originalCases.get(c.caseId) == undefined) {
			// 		actionName = 'addRelatedCase';
			// 	} else if (originalCases.get(c.caseId) !== c.label) {
			// 		actionName = 'editRelatedCaseLabel';
			// 	}
			// 	if (actionName !== '') {
			// 		await addDoc(collection(db, 'actionLogs'), {
			// 			action: actionName,
			// 			createAt: serverTimestamp(),
			// 			input: {
			// 				title: c.caseId,
			// 				description: c.label
			// 			},
			// 			targetCollection: 'policies',
			// 			targetDocumentId: params.policyId,
			// 			targetSubCollection: '',
			// 			targetSubDocumentId: '',
			// 			userId: locals.user.userId
			// 		});
			// 	}
			// }

			// for (const caseId of originalCases.keys()) {
			// 	if (!editedCaseId.includes(caseId)) {
			// 		await addDoc(collection(db, 'actionLogs'), {
			// 			action: 'removeRelatedCases',
			// 			createAt: serverTimestamp(),
			// 			input: {
			// 				title: caseId,
			// 				description: ''
			// 			},
			// 			targetCollection: 'policies',
			// 			targetDocumentId: params.policyId,
			// 			targetSubCollection: '',
			// 			targetSubDocumentId: '',
			// 			userId: locals.user.userId
			// 		});
			// 	}
			// }

			return json({ status: 201 });
		} else if (action == 'votePolicy') {
			let actionName = 'votePolicy';
			let actionInput = vote;
			const userId = locals.user.userId;

			if (vote == 'upvote') {
				await updateDoc(doc(db, 'policies', params.policyId), {
					'votes.upvote': arrayUnion(userId),
					'votes.downvote': arrayRemove(userId)
				});
			} else if (vote == 'downvote') {
				await updateDoc(doc(db, 'policies', params.policyId), {
					'votes.upvote': arrayRemove(userId),
					'votes.downvote': arrayUnion(userId)
				});
			} else {
				await updateDoc(doc(db, 'policies', params.policyId), {
					'votes.upvote': arrayRemove(userId),
					'votes.downvote': arrayRemove(userId)
				});
				actionName = 'unvotePolicy';
				actionInput = '';
			}

			await addDoc(collection(db, 'actionLogs'), {
				action: actionName,
				createAt: serverTimestamp(),
				input: {
					title: actionInput,
					description: ''
				},
				targetCollection: 'policies',
				targetDocumentId: params.policyId,
				targetSubCollection: '',
				targetSubDocumentId: '',
				userId: userId
			});

			return json({ status: 201 });
		}
		throw error(400, 'Sorry, something went wrong.');
	} catch {
		throw error(400, 'Sorry, something went wrong.');
	}
};
