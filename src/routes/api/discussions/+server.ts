import { json, error } from '@sveltejs/kit';
import {
	serverTimestamp,
	addDoc,
	collection,
	doc,
	updateDoc,
	arrayUnion
} from 'firebase/firestore';
import { db } from '$lib/firebase';

export const POST = async ({ request, locals }) => {
	if (!locals.user) {
		throw error(400, 'User authentication error.');
	}
	try {
		const { form, entity, entityId } = await request.json();
		const docRef = await addDoc(collection(db, 'discussions'), {
			createAt: serverTimestamp(),
			open: true,
			targetEntity: entity,
			targetEntityId: entityId,
			title: form.data.title,
			userId: locals.user.userId
		});
		await addDoc(collection(db, 'discussions', docRef.id, 'comments'), {
			createAt: serverTimestamp(),
			message: form.data.message,
			userId: locals.user.userId
		});
		await updateDoc(doc(db, entity, entityId), {
			discussions: arrayUnion(docRef.id)
		});

		await addDoc(collection(db, 'actionLogs'), {
			action: 'createDiscussion',
			createAt: serverTimestamp(),
			input: {
				title: form.data.title,
				description: form.data.message
			},
			linkedEntity: entity,
			linkedEntityId: entityId,
			targetCollection: 'discussions',
			targetDocumentId: docRef.id,
			targetSubCollection: '',
			targetSubDocumentId: '',
			userId: locals.user.userId
		});

		return json({ id: docRef.id }, { status: 201 });
	} catch {
		throw error(400, 'Fail to create a new discussion in the database.');
	}
};
