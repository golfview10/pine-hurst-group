/**
 * Live Sync Module (Firebase Firestore)
 * Automatically syncs live room data and pricing from Firebase to the active DOM,
 * falling back gracefully to static data if offline or not yet configured.
 */

import { firebaseConfig } from './firebase-config.js';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getFirestore, doc, onSnapshot } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

export function initLiveSync(dormId, onUpdate) {
    if (!dormId || typeof onUpdate !== 'function') return;

    try {
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);

        // Listen for realtime updates from Firestore
        onSnapshot(doc(db, 'dorms', dormId), (docSnap) => {
            if (docSnap.exists()) {
                const liveData = docSnap.data();
                onUpdate(liveData);
            }
        }, (err) => {
            // Quiet fallback: keep using local data without disturbing the user
            console.log('Firebase sync status: using local data fallback');
        });
    } catch (err) {
        console.warn('Firebase init:', err.message);
    }
}
