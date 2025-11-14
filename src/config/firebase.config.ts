import admin from 'firebase-admin';
import path from 'path';

const serviceAccount = path.join(
    (process.cwd(), 'public/firebase-auth-secret.json'),
);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

export const FirebaseAdmin = admin;
