import {
  addDoc,
  collection,
  arrayUnion,
  updateDoc,
  getDoc,
  doc,
  deleteDoc,
  arrayRemove,
} from "firebase/firestore";
import { auth, db, getUserDoc } from "./firebase.app";

const _postsRef = collection(db, "posts");

const createPost = async (title, content, community, nsfw, type) => {
  const newPost = {
    title,
    content,
    community,
    nsfw,
    upvotes: [auth.currentUser.uid],
    downvotes: [],
    user: { id: auth.currentUser.uid, username: auth.currentUser.displayName },
    comments: [],
    type,
  };
  try {
    const postRef = await addDoc(_postsRef, newPost);
    const userDoc = await getUserDoc(auth.currentUser.uid);
    updateDoc(postRef, { id: postRef.id });
    updateDoc(doc(db, "users", userDoc.id), { posts: arrayUnion(postRef.id) });
    return postRef.id;
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

const deletePost = async (postID, commData) => {
  const postDocRef = doc(db, "posts", postID);
  const postDoc = await getDoc(postDocRef);
  const userDoc = await getUserDoc(auth.currentUser.uid);
  if (
    userDoc.data().posts.find((x) => x.user !== postDoc.data().user) ||
    commData.moderators.includes(userDoc.data().uid)
  )
    // untested
    return Promise.reject(Error("not authorised"));
  return await deleteDoc(postDocRef);
};

const getPost = async (postID) => {
  const postDocRef = doc(db, "posts", postID);
  const postDoc = await getDoc(postDocRef);
  return postDoc.data();
};

const upvote = async (postID, uid) => {
  const postRef = doc(db, "posts", postID);
  updateDoc(postRef, { upvotes: arrayUnion(uid), downvotes: arrayRemove(uid) });
  return Promise.resolve();
};

const downvote = async (postID, uid) => {
  const postRef = doc(db, "posts", postID);
  updateDoc(postRef, { upvotes: arrayRemove(uid), downvotes: arrayUnion(uid) });
  return Promise.resolve();
};

const removeVote = async (postID, uid) => {
  const postRef = doc(db, "posts", postID);
  updateDoc(postRef, {
    upvotes: arrayRemove(uid),
    downvotes: arrayRemove(uid),
  });
};

export { createPost, deletePost, getPost, upvote, downvote, removeVote };