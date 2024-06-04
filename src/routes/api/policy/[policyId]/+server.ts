import { json, error } from '@sveltejs/kit';
import { doc, getDoc, query, where } from 'firebase/firestore';
import { db } from '$lib/firebase';

export const GET = async ({ params }) => {
	const docRef = doc(db, 'policy', params.policyId);
	const docSnap = await getDoc(docRef);
	if (docSnap.exists()) {
		console.log(docSnap.data());
		console.log(docSnap.id);
		return json({ ...docSnap.data(), id: docSnap.id });
	}
	throw error(404, `Policy #${params.policyId} doesn't exist.`);
};
