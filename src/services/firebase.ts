import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  deleteDoc, 
  collection, 
  onSnapshot, 
  getDocFromServer,
  getDocs
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { PeriodArchive } from '../types/jaspel';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore using the configured database ID
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Test connection on boot as mandated
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'settings', 'connection_test'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline or initializing.');
      return false;
    }
    // Connected or benign permission check
    return true;
  }
}

/**
 * Subscribe in real time to all periods stored in Firestore.
 * Every time any user on any mobile/desktop device saves, updates, or deletes a period,
 * this callback fires instantly!
 */
export function subscribeToPeriods(
  onUpdate: (periods: PeriodArchive[]) => void,
  onError?: (error: unknown) => void
): () => void {
  const periodsCollection = collection(db, 'periods');

  const unsubscribe = onSnapshot(
    periodsCollection,
    (snapshot) => {
      const archives: PeriodArchive[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as PeriodArchive;
        if (data && data.id) {
          archives.push(data);
        }
      });
      onUpdate(archives);
    },
    (error) => {
      console.error('Real-time sync listener error:', error);
      if (onError) onError(error);
    }
  );

  return unsubscribe;
}

/**
 * Save or update a specific month's data to Cloud Firestore in real time.
 */
export async function savePeriodToCloud(archive: PeriodArchive): Promise<void> {
  try {
    const cleanId = archive.id.replace(/[^a-zA-Z0-9_\-]/g, '_');
    const periodDocRef = doc(db, 'periods', cleanId);
    
    // Ensure all data fields are serializable
    await setDoc(
      periodDocRef,
      {
        ...archive,
        id: cleanId,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (err) {
    console.error('Failed to save period to cloud:', err);
    throw err;
  }
}

/**
 * Delete a period document from Firestore across all devices.
 */
export async function deletePeriodFromCloud(periodId: string): Promise<void> {
  try {
    const cleanId = periodId.replace(/[^a-zA-Z0-9_\-]/g, '_');
    await deleteDoc(doc(db, 'periods', cleanId));
  } catch (err) {
    console.error('Failed to delete period from cloud:', err);
    throw err;
  }
}

/**
 * Seeds the baseline October 2026 data to Cloud Firestore if database is initially empty.
 */
export async function seedInitialPeriodIfEmpty(initialArchive: PeriodArchive): Promise<void> {
  try {
    const snapshot = await getDocs(collection(db, 'periods'));
    if (snapshot.empty) {
      await savePeriodToCloud(initialArchive);
    }
  } catch (err) {
    console.warn('Initial seeding check:', err);
  }
}
