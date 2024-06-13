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

export const POST = async ({ request }) => {
	try {
		const { form, entity, entityId } = await request.json();
		const docRef = await addDoc(collection(db, 'reasons'), {
			createAt: serverTimestamp(),
			description: form.data.description,
			label: form.data.label,
			likeList: ['user1'],
			targetEntity: entity,
			targetEntityId: entityId,
			title: form.data.title,
			userId: 'user1'
		});

		await updateDoc(doc(db, entity, entityId), {
			reasons: arrayUnion(docRef.id)
		});

		await addDoc(collection(db, 'actionLogs'), {
			action: 'createReason',
			createAt: serverTimestamp(),
			input: {
				title: form.data.title,
				description: form.data.description
			},
			targetCollection: 'reasons',
			targetDocumentId: docRef.id,
			targetSubCollection: '',
			targetSubDocumentId: '',
			userId: 'user1'
		});

		return json({ id: docRef.id }, { status: 201 });
	} catch (e) {
		throw error(400, 'Fail to create a new reason in the database.');
	}
};
