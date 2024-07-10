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
		const docRef = await addDoc(collection(db, 'reasons'), {
			createAt: serverTimestamp(),
			description: form.data.description,
			label: form.data.label,
			likeList: [locals.user.userId],
			targetEntity: entity,
			targetEntityId: entityId,
			userId: locals.user.userId
		});

		await updateDoc(doc(db, entity, entityId), {
			reasons: arrayUnion(docRef.id)
		});

		await addDoc(collection(db, 'actionLogs'), {
			action: 'createReason',
			createAt: serverTimestamp(),
			input: {
				title: '',
				description: form.data.description
			},
			targetCollection: 'reasons',
			targetDocumentId: docRef.id,
			targetSubCollection: '',
			targetSubDocumentId: '',
			userId: locals.user.userId
		});

		return json({ id: docRef.id }, { status: 201 });
	} catch {
		throw error(400, 'Fail to create a new reason in the database.');
	}
};
