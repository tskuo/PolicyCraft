import { redirect, type RequestEvent } from '@sveltejs/kit';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from './firebase';
import { signOut } from 'firebase/auth';

export const authenticateUser = async (event: RequestEvent) => {
	// get the cookies from the request
	const { cookies } = event;

	// get the user token from the cookie
	const userAuthToken = cookies.get('__session');

	// if the user token is not valid, return null
	// this is where you would check the user token against your database
	// to see if it is valid and return the user object
	if (userAuthToken) {
		const q = query(collection(db, 'users'), where('userAuthToken', '==', userAuthToken));
		try {
			const querySnapshot = await getDocs(q);
			if (querySnapshot.docs.length == 1) {
				const doc = querySnapshot.docs[0];
				const user = {
					userId: doc.id,
					displayName: doc.data().displayName,
					email: doc.data().email,
					role: doc.data().role
				};
				return user;
			} else {
				cookies.set('__session', '', {
					path: '/',
					expires: new Date(0)
				});
				await signOut(auth);
				throw redirect(303, '/login');
			}
		} catch {
			cookies.set('__session', '', {
				path: '/',
				expires: new Date(0)
			});
			await signOut(auth);
			throw redirect(303, '/login');
		}
	}

	return null;
};
