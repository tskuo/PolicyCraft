import { json, error } from '@sveltejs/kit';
import {
	serverTimestamp,
	addDoc,
	collection,
	getDocs,
	doc,
	Timestamp,
	runTransaction,
	updateDoc,
	arrayUnion
} from 'firebase/firestore';
import { db } from '$lib/firebase';

export const POST = async ({ request }) => {
	try {
		const { form, entity, entityId } = await request.json();
		const docRef = await addDoc(collection(db, 'discussions'), {
			createAt: serverTimestamp(),
			open: true,
			title: form.data.title,
			userId: 'user1'
		});
		await addDoc(collection(db, 'discussions', docRef.id, 'comments'), {
			createAt: serverTimestamp(),
			message: form.data.message,
			userId: 'user1'
		});
		await updateDoc(doc(db, entity, entityId), {
			discussions: arrayUnion(docRef.id)
		});

		return json({ id: docRef.id }, { status: 201 });
	} catch (e) {
		throw error(400, 'Fail to create a new policy in the database.');
	}
};
