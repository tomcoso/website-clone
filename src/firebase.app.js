import { initializeApp } from "firebase/app";
import {
  addDoc,
  arrayRemove,
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

const getUserDoc = async (uid) => {
  const userQSnapshot = await getDocs(
    query(_usersRef, where("uid", "==", uid))
  );
  let userDoc;
  userQSnapshot.forEach((doc) => (userDoc = doc));
  return userDoc;
};

const _getCommunityID = async (name) => {
  const cSnapshot = await getDocs(
    query(_communitiesRef, where("name", "==", name))
  );
  let community;
  cSnapshot.forEach((x) => (community = x.id));
  return community;
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
    timestamp: new Date(),
    blacklist: [],
  };
  return await addDoc(_communitiesRef, newCommunity).catch((error) =>
    Promise.reject(error)
  );
};

const updateMemberOfCommunity = async (name, action) => {
  const community = await _getCommunityID(name);

  const userDoc = await getUserDoc(auth.currentUser.uid);

  updateDoc(doc(db, "users", userDoc.id), {
    subscribed:
      action === "join" ? arrayUnion(community) : arrayRemove(community),
  });
  await updateDoc(doc(db, "communities", community), {
    members:
      action === "join"
        ? arrayUnion(auth.currentUser.uid)
        : arrayRemove(auth.currentUser.uid),
  });
};

const makeUserMod = async (name, uid) => {
  const commID = await _getCommunityID(name);
  await updateDoc(doc(db, "communities", commID), {
    moderators: arrayUnion(uid),
  });
};

const unmakeUserMod = async (name, uid) => {
  const commID = await _getCommunityID(name);
  await updateDoc(doc(db, "communities", commID), {
    moderators: arrayRemove(uid),
  });
};

const banUser = async (name, uid) => {
  const commID = await _getCommunityID(name);
  await updateDoc(doc(db, "communities", commID), {
    blacklist: arrayUnion(uid),
    members: arrayRemove(uid),
  });
};

const unbanUser = async (name, uid) => {
  const commID = await _getCommunityID(name);
  await updateDoc(doc(db, "communities", commID), {
    blacklist: arrayRemove(uid),
  });
};

// TODO : make user moderator OK
// TODO : unmake user moderator OK
// TODO : ban user (mod) OK
// TODO : unban user (mod) OK
// TODO : join community OK
// TODO : leave community OK
// TODO : remove post (mod)
// TODO : remove comment (mod)

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
  const userDoc = getUserDoc(auth.currentUser.uid);
  updateDoc(userDoc, { posts: arrayUnion(postRef.id) });
};

const deletePost = async (postId) => {
  const postDocRef = doc(db, "posts", postId);
  const postDoc = await getDoc(postDocRef);
  const userDoc = await getUserDoc(auth.currentUser.uid);
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
  updateMemberOfCommunity,
  makeUserMod,
  unmakeUserMod,
  banUser,
  unbanUser,
  getUserDoc,
  // getMembersArray,
};
