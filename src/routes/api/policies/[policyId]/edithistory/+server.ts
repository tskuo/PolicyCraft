import { json } from '@sveltejs/kit';
import { and, collection, getDocs, or, orderBy, query, where } from 'firebase/firestore';
import { db } from '$lib/firebase';

export const GET = async ({ params }) => {
	const res: any[] = [];
	// const q1 = query(collection(db, 'actionLogs'),where('targetDocumentId', '==', params.policyId))
	// const q2 = query(collection(db, 'actionLogs'),where('action', '!=', 'votePolicy'))
	const querySnapshot = await getDocs(
		query(
			collection(db, 'actionLogs'),
			and(
				where('targetDocumentId', '==', params.policyId),
				or(
					where('action', '==', 'createPolicy'),
					where('action', '==', 'editPolicy'),
					where('action', '==', 'addRelatedCase'),
					where('action', '==', 'editRelatedCaseLabel'),
					where('action', '==', 'editRelatedCaseLabelWhileEditingPolicy'),
					where('action', '==', 'removeRelatedCases')
				)
			)
			// orderBy('createAt')
		)
	);
	querySnapshot.forEach((doc) => {
		res.push({ ...doc.data(), id: doc.id, createAt: doc.data().createAt.toDate() });
	});
	return json(res);
};
