import { initializeApp } from "firebase/app";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";

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
  const doc = await getUserDoc(uid);
  return doc(db, "users", doc.id);
};

// USERS ----------------------------------------------------------------------

const login = async ({ email, password }) => {
  return await signInWithEmailAndPassword(auth, email, password)
    .then(() => Promise.resolve())
    .catch((error) => Promise.reject(error.code));
};

const logout = () => {
  signOut(auth)
    .then(() => {
      console.log("logged out");
    })
    .catch((error) => {
      console.error("Sign out error", error);
    });
};

const createUser = async (email, password, username) => {
  if (
    !password.match(/^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=[^0-9]*[0-9]).{8,16}$/)
  )
    return Promise.reject(Error("pass/mismatch").message);

  if (!username.match(/^\w{6,}$/))
    return Promise.reject(Error("username/mismatch").message);

  const usernameSnapshot = await getCountFromServer(
    query(_usersRef, where("username", "==", username))
  );
  if (usernameSnapshot.data().count > 0) {
    const error = Error("auth/username-already-in-use");
    return Promise.reject(error.message);
  }

  const res = await createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      updateProfile(userCredential.user, { displayName: username });
      sendEmailVerification(userCredential.user);
      const uid = userCredential.user.uid;
      addDoc(_usersRef, { uid, username, subscribed: [] });
    })
    .catch((error) => {
      return Promise.reject(error.code);
    });
  console.log(res);
  return res;
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
  login,
  logout,
  createUser,
  getUserDoc,
  getUserRef,
  updateDraft,
  getDraft,
  addContentToDraft,
  removeContentFromDraft,
  getTenorAPIKey,
};
