import { initializeApp, getApps, deleteApp, type FirebaseApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getVertexAI, getGenerativeModel } from 'firebase/vertexai-preview';
import {
	VITE_API_KEY,
	VITE_AUTH_DOMAIN,
	VITE_PROJECT_ID,
	VITE_STORAGE_BUCKET,
	VITE_MESSAGING_SENDER_ID,
	VITE_APP_ID
} from '$env/static/private';

const firebaseConfig = {
	apiKey: VITE_API_KEY,
	authDomain: VITE_AUTH_DOMAIN,
	projectId: VITE_PROJECT_ID,
	storageBucket: VITE_STORAGE_BUCKET,
	messagingSenderId: VITE_MESSAGING_SENDER_ID,
	appId: VITE_APP_ID
};

let app: FirebaseApp;

if (!getApps().length) {
	app = initializeApp(firebaseConfig);
} else {
	app = getApps()[0];
	deleteApp(app);
	app = initializeApp(firebaseConfig);
}

const vertexAI = getVertexAI(app);

export const db = getFirestore(app, 'policycraft');
export const auth = getAuth(app);
export const model = getGenerativeModel(vertexAI, { model: 'gemini-1.5-pro' });
export const googleProvider = new GoogleAuthProvider();
