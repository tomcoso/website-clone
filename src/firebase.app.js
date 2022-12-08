import { initializeApp } from "firebase/app";
import {
  addDoc,
  collection,
  getCountFromServer,
  getDocs,
  getFirestore,
  query,
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
  const usernameSnapshot = await getCountFromServer(
    query(collection(db, "users"), where("username", "==", username))
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
      addDoc(collection(db, "users"), { uid, username });
    })
    .catch((error) => {
      return Promise.reject(error.code);
    });
  return res;
};

const _communitiesRef = collection(db, "communities");

const getCommunity = async (name) => {
  const commSnapshot = await getDocs(
    query(_communitiesRef, where("name", "==", name))
  );
  let data;
  commSnapshot.forEach((doc) => (data = doc.data()));
  return data
    ? Promise.resolve(data)
    : Promise.reject(Error("community-does-not-exist"));
};

const createCommunity = async (name) => {
  const communitySnapshot = await getCountFromServer(
    query(_communitiesRef, where("name", "==", name))
  );
  if (communitySnapshot.data().count > 0)
    return Promise.reject(Error("community-already-exists"));
  const newCommunity = {
    name,
    posts: [],
    moderators: [auth.currentUser.uid],
    members: [auth.currentUser.uid],
  };
  await addDoc(_communitiesRef, newCommunity);
};

export { auth, login, logout, createUser, getCommunity, createCommunity };
