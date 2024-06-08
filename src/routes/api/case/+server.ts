import { json, error } from '@sveltejs/kit';
import { serverTimestamp, addDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '$lib/firebase';

// Get all policies from the database
// export const GET = async () => {
// 	try {
// 		const querySnapshot = await getDocs(collection(db, 'policy'));
// 		const res: any[] = [];
// 		querySnapshot.forEach((doc) => {
// 			const policy = { id: doc.id, ...doc.data() };
// 			res.push(policy);
// 		});
// 		return json(res);
// 	} catch (e) {
// 		throw error(400, 'Fail to fetch data from Firestore.');
// 	}
// };

export const GET = async () => {
	try {
		const querySnapshot = await getDocs(collection(db, 'case'));
		const res: any[] = [];
		querySnapshot.forEach((doc) => {
			const c = { id: doc.id, ...doc.data() };
			res.push(c);
		});
		return json(res);
	} catch (e) {
		throw error(400, 'Fail to fetch data from Firestore.');
	}
};
