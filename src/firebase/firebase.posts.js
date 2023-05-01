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
import { auth, db, getUserDoc, getUserRef } from "./firebase.app";

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

  // checks for author or mod
  if (
    !userDoc.data().posts.includes(postDoc.data().id) ||
    !commData.moderators.includes(userDoc.data().uid)
  )
    return Promise.reject(Error("not authorised"));

  // post itself
  const deletedStatus = await deleteDoc(postDocRef);

  // post id on user
  const userRef = await getUserRef(postDoc.data().user.id);
  updateDoc(doc(db, "users", userRef.id), {
    posts: arrayRemove(postDoc.data().id),
  });

  // post id on community
  updateDoc(doc(db, "communities", commData.id), {
    posts: arrayRemove(postID),
  });

  return Promise.resolve(deletedStatus);
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
  const userRef = await getUserRef(uid);
  updateDoc(postRef, {
    upvotes: arrayRemove(uid),
    downvotes: arrayRemove(uid),
  });
  updateDoc(userRef, { posts: arrayRemove(postID) });
};

export { createPost, deletePost, getPost, upvote, downvote, removeVote };
