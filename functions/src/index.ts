/**
 * Import function triggers from their respective submodules:
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
// import * as logger from 'firebase-functions/logger';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { defineString } from 'firebase-functions/params';

initializeApp();
const databaseName = defineString('FIRESTORE_DATABASE_NAME');
const db = getFirestore('policycraft');

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// exports.policycraftTriggerEditPolicy = onDocumentUpdated(
// 	{
// 		document: 'policies/{policyId}',
// 		database: databaseName
// 	},
// 	(event) => {
// 		const snapshot = event.data;
// 		if (!snapshot) {
// 			console.log('No data associated with the event');
// 			return;
// 		}
// 		// Get an object with the current document values.
// 		// If the document does not exist, it was deleted
// 		const newValues = snapshot.after.data();

// 		// Get an object with the previous document values
// 		const previousValues = snapshot.before.data();

// 		if (
// 			newValues.title !== previousValues.title ||
// 			newValues.description !== previousValues.description
// 		) {
// 			// perform more operations ...
// 			// logger.info('Policy Title Update!', { newTitle: newValues.title });
// 			for (const userId of newValues.watchList) {
// 				db.collection(`users/${userId}/notifications`).add({
// 					action: 'editPolicy',
// 					createAt: Timestamp.now(),
// 					read: false,
// 					targetCollection: 'policies',
// 					targetDocumentId: event.params.policyId
// 				});
// 			}
// 		}
// 	}
// );

exports.policycraftNotificationTrigger = onDocumentCreated(
	{
		document: 'actionLogs/{actionLogId}',
		database: databaseName
	},
	(event) => {
		const snapshot = event.data;
		if (!snapshot) {
			console.log('No data associated with the event');
			return;
		}

		const data = snapshot.data();

		if (
			data.action == 'editPolicy' ||
			data.action == 'editRelatedCaseLabelWhileEditingPolicy' ||
			data.action == 'addRelatedCase' ||
			data.action == 'editRelatedCaseLabel' ||
			data.action == 'removeRelatedCases'
		) {
			db.collection('policies')
				.doc(data.targetDocumentId)
				.get()
				.then((doc) => {
					if (doc.exists) {
						for (const userId of doc.data()!.watchList) {
							db.collection(`users/${userId}/notifications`).add({
								action: data.action,
								createAt: data.createAt,
								read: false,
								targetCollection: 'policies',
								targetDocumentId: data.targetDocumentId
							});
						}
					} else {
						// doc.data() will be undefined in this case
						console.log('No such document!');
					}
				})
				.catch((error) => {
					console.log('Error getting document:', error);
				});
			return;
		} else if (data.action == 'createComment') {
			const discusssionThreadUserIds = new Set();
			db.collection(`discussions/${data.targetDocumentId}/comments`)
				.get()
				.then((querySnapshot) => {
					querySnapshot.forEach((doc) => {
						// doc.data() is never undefined for query doc snapshots
						discusssionThreadUserIds.add(doc.data().userId);
					});
					for (const userId of discusssionThreadUserIds) {
						db.collection(`users/${userId}/notifications`).add({
							action: data.action,
							createAt: data.createAt,
							read: false,
							targetCollection: data.linkedEntity,
							targetDocumentId: data.linkedEntityId
						});
					}
				});
		} else {
			return;
		}
	}
);
