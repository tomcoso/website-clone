import { initializeApp } from "firebase/app";
import {
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
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

const _communitiesRef = collection(db, "communities");
const _postsRef = collection(db, "posts");
const _usersRef = collection(db, "users");

const _getUserDoc = async (uid) => {
  const userQSnapshot = await getDocs(
    query(_usersRef, where("uid", "==", uid))
  );
  let userDoc;
  userQSnapshot.forEach((doc) => (userDoc = doc));
  return userDoc;
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
      addDoc(_usersRef, { uid, username });
    })
    .catch((error) => {
      return Promise.reject(error.code);
    });
  return res;
};

// COMMUNITIES ----------------------------------------------------------------

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

// POSTS ----------------------------------------------------------------------

const createPost = async (title, content, community) => {
  const newPost = {
    title,
    content,
    community,
    upvotes: [auth.currentUser.uid],
    user: auth.currentUser.uid,
    comments: [],
  };
  const postRef = await addDoc(_postsRef, newPost);
  const userDoc = _getUserDoc(auth.currentUser.uid);
  updateDoc(userDoc, { posts: arrayUnion(postRef.id) });
};

const deletePost = async (postId) => {
  const postDocRef = doc(db, "posts", postId);
  const postDoc = await getDoc(postDocRef);
  const userDoc = await _getUserDoc(auth.currentUser.uid);
  if (userDoc.data().posts.find((x) => x.user === postDoc.data().user))
    return Promise.reject(Error("not authorised"));
  return await deleteDoc(postDocRef);
};

export {
  auth,
  login,
  logout,
  createUser,
  getCommunity,
  createCommunity,
  createPost,
  deletePost,
};
