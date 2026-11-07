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
      const archivesMap = new Map<string, PeriodArchive>();
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as PeriodArchive;
        const docId = docSnap.id;
        if (data && (data.label || docId)) {
          archivesMap.set(docId, {
            ...data,
            id: docId,
          });
        }
      });

      // Strict deduplication by both ID and normalized label to prevent any duplicate keys or items
      const uniqueList: PeriodArchive[] = [];
      const seenIds = new Set<string>();
      const seenLabels = new Set<string>();

      // Sort by savedAt descending so latest saved version is preferred
      const allItems = Array.from(archivesMap.values()).sort(
        (a, b) => new Date(b.savedAt || 0).getTime() - new Date(a.savedAt || 0).getTime()
      );

      for (const item of allItems) {
        const idKey = (item.id || `${item.year}-${item.month}`).trim();
        const labelKey = (item.label || idKey).trim().toLowerCase();

        if (!seenIds.has(idKey) && !seenLabels.has(labelKey)) {
          seenIds.add(idKey);
          seenLabels.add(labelKey);
          uniqueList.push({
            ...item,
            id: idKey,
          });
        }
      }

      onUpdate(uniqueList);
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
    const cleanId = (archive.id || `${archive.year}-${archive.month}`).replace(/[^a-zA-Z0-9_\-]/g, '_');
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
export async function deletePeriodFromCloud(periodId: string, label?: string): Promise<void> {
  try {
    const cleanId = periodId.replace(/[^a-zA-Z0-9_\-]/g, '_');
    await deleteDoc(doc(db, 'periods', cleanId));

    // Also check and clean up any other doc that shares this cleanId or label
    const snap = await getDocs(collection(db, 'periods'));
    const deletes: Promise<void>[] = [];
    snap.forEach((d) => {
      const data = d.data();
      if (d.id === cleanId || (label && data.label === label)) {
        deletes.push(deleteDoc(doc(db, 'periods', d.id)));
      }
    });
    await Promise.all(deletes);
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
