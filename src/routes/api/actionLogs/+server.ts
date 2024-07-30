import { json } from '@sveltejs/kit';
import { collection, getDocs, and, or, query, where } from 'firebase/firestore';
import { db } from '$lib/firebase';

export const GET = async ({ locals }) => {
	const res: any[] = [];
	const querySnapshot = await getDocs(
		query(
			collection(db, 'actionLogs'),
			and(
				where('userId', '==', locals.user?.userId),
				or(
					where('action', '==', 'createPolicy'),
					where('action', '==', 'createCase'),
					where('action', '==', 'editPolicy'),
					where('action', '==', 'editRelatedCaseLabelWhileEditingPolicy'),
					where('action', '==', 'addRelatedCase'),
					where('action', '==', 'editRelatedCaseLabel'),
					where('action', '==', 'removeRelatedCases'),
					where('action', '==', 'createReason'),
					where('action', '==', 'createDiscussion'),
					where('action', '==', 'createComment')
				)
			)
		)
	);
	querySnapshot.forEach((doc) => {
		res.push({ ...doc.data(), id: doc.id, createAt: doc.data().createAt.toDate() });
	});
	return json(res);
};
