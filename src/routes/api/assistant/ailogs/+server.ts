import { json, error } from '@sveltejs/kit';
import { serverTimestamp, addDoc, collection } from 'firebase/firestore';
import { db } from '$lib/firebase';

export const POST = async ({ request, locals }) => {
	if (!locals.user) {
		throw error(400, 'User authentication error.');
	}
	try {
		const { action, messageHistory, entity, entityId } = await request.json();
		const docRef = await addDoc(collection(db, 'aiLogs'), {
			action: action,
			createAt: serverTimestamp(),
			targetCollection: entity,
			targetDocumentId: entityId,
			userId: locals.user.userId
		});
		for (const m of messageHistory) {
			await addDoc(collection(db, 'aiLogs', docRef.id, 'messages'), {
				createAt: serverTimestamp(),
				person: m.person,
				message: m.message
			});
		}
		return json({ id: docRef.id }, { status: 201 });
	} catch {
		throw error(400, 'Fail to create a new ai log in the database.');
	}
};

export const PATCH = async ({ request, locals }) => {
	if (!locals.user) {
		throw error(400, 'User authentication error.');
	}
	try {
		const { aiLogsDocId, person, message } = await request.json();
		await addDoc(collection(db, 'aiLogs', aiLogsDocId, 'messages'), {
			createAt: serverTimestamp(),
			person: person,
			message: message
		});
		return json({ status: 201 });
	} catch {
		throw error(400, 'Fail to patch a new ai log in the database.');
	}
};
