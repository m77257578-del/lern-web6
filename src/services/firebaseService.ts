import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, getDocs, doc, setDoc, updateDoc, getDoc, onSnapshot, deleteDoc } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): void {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  };
  console.warn('Firestore notice:', errInfo.error);
}

// Generic Firestore Operations
export async function saveDocument(collectionName: string, item: any) {
  try {
    await setDoc(doc(db, collectionName, item.id), item, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${collectionName}/${item.id}`);
  }
}

export async function deleteDocument(collectionName: string, id: string) {
  try {
    await deleteDoc(doc(db, collectionName, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${collectionName}/${id}`);
  }
}

// CRUD for Projects with onSnapshot real-time listener
export async function fetchProjects() {
  try {
    const querySnapshot = await getDocs(collection(db, 'projects'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'projects');
    return [];
  }
}

export function subscribeToCollection(collectionName: string, callback: (data: any[]) => void, onError?: (error: any) => void) {
  try {
    const colRef = collection(db, collectionName);
    return onSnapshot(colRef, (querySnapshot) => {
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(data);
    }, (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.LIST, collectionName);
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, collectionName);
    return () => {};
  }
}

export async function saveProject(project: any) {
  await saveDocument('projects', project);
}

// CRUD for Modification Requests (Drafts) with onSnapshot real-time listener
export async function fetchDrafts() {
  try {
    const querySnapshot = await getDocs(collection(db, 'drafts'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'drafts');
    return [];
  }
}

export function subscribeToDrafts(callback: (drafts: any[]) => void, onError?: (error: any) => void) {
  try {
    const colRef = collection(db, 'drafts');
    return onSnapshot(colRef, (querySnapshot) => {
      const drafts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(drafts);
    }, (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.LIST, 'drafts');
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'drafts');
    return () => {};
  }
}

export async function saveDraft(draft: any) {
  await saveDocument('drafts', draft);
}

// CRUD for Support Tickets with onSnapshot real-time listener
export async function fetchTickets() {
  try {
    const querySnapshot = await getDocs(collection(db, 'support_tickets'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'support_tickets');
    return [];
  }
}

export function subscribeToTickets(callback: (tickets: any[]) => void, onError?: (error: any) => void) {
  try {
    const colRef = collection(db, 'support_tickets');
    return onSnapshot(colRef, (querySnapshot) => {
      const tickets = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(tickets);
    }, (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.LIST, 'support_tickets');
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'support_tickets');
    return () => {};
  }
}

export async function saveTicket(ticket: any) {
  await saveDocument('support_tickets', ticket);
}

// Auth functions
export async function signUpUser(email: string, password: string) {
  try {
    return await createUserWithEmailAndPassword(auth, email, password);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'auth/signup');
  }
}

export async function signInUser(email: string, password: string) {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, 'auth/signin');
  }
}

export async function signOutUser() {
  try {
    await signOut(auth);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'auth/signout');
  }
}

export function subscribeToAuthChanges(callback: (user: any) => void) {
  return onAuthStateChanged(auth, callback);
}
