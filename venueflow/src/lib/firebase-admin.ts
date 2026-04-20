import admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  } catch (error) {
    // If environment variables are missing, initialize with project ID for local development mock
    admin.initializeApp({
      projectId: 'venueflow-mock',
    });
    console.warn("Firebase Admin initialized with mock project ID. Set environment variables for production.");
  }
}

const db = admin.firestore();
export { db };
