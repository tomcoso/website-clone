import { initializeApp } from "firebase/app";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCGS_wJpw3WDKf9xH5oiG5vFzi42nmlS-A",
  authDomain: "coralit-media.firebaseapp.com",
  projectId: "coralit-media",
  storageBucket: "coralit-media.appspot.com",
  messagingSenderId: "926180378102",
  appId: "1:926180378102:web:426e1ca8aef29a690c73d7",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// UTILITY --------------------------------------------------------------------

const _usersRef = collection(db, "users");

const getUserDoc = async (uid) => {
  const userQSnapshot = await getDocs(
    query(_usersRef, where("uid", "==", uid))
  );
  let userDoc;
  userQSnapshot.forEach((doc) => (userDoc = doc));
  return userDoc;
};

const getUserRef = async (uid) => {
  const docSnap = await getUserDoc(uid);
  return doc(db, "users", docSnap.id);
};

const updateDraft = async (draft) => {
  const userDoc = await getUserDoc(auth.currentUser.uid);
  await updateDoc(doc(db, "users", userDoc.id), { draft });
};

const addContentToDraft = async (item) => {
  const userDoc = await getUserDoc(auth.currentUser.uid);
  await updateDoc(doc(db, "users", userDoc.id), {
    "draft.content": arrayUnion(item),
  });
};

const removeContentFromDraft = async (item) => {
  const userDoc = await getUserDoc(auth.currentUser.uid);
  await updateDoc(doc(db, "users", userDoc.id), {
    "draft.content": arrayRemove(item),
  });
};

const getDraft = async (uid) => {
  const userSnap = await getUserDoc(uid);
  return userSnap.data().draft;
};

const getTenorAPIKey = async () => {
  const snap = await getDoc(doc(db, "keys", "tenor"));
  return snap.data().key;
};

export {
  app,
  db,
  auth,
  getUserDoc,
  getUserRef,
  updateDraft,
  getDraft,
  addContentToDraft,
  removeContentFromDraft,
  getTenorAPIKey,
};
