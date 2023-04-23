import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db, getUserRef } from "./firebase.app";

const commentsRef = collection(db, "comments");

const createComment = async (
  uid,
  username,
  parent,
  content,
  type,
  commentType,
  upvotes
) => {
  const comment = {
    user: uid,
    username: username,
    content: content,
    type: type,
    timestamp: new Date(),
    parent: parent,
    replies: [],
    upvotes: [upvotes],
    downvotes: [],
  };

  try {
    const commentRef = await addDoc(commentsRef, comment);
    if (commentType === "comment") {
      updateDoc(doc(db, "posts", parent), {
        comments: arrayUnion(commentRef.id),
      });
    } else if (commentType === "reply") {
      updateDoc(doc(db, "comments", parent), {
        replies: arrayUnion(commentRef.id),
      });
    }

    const userRef = await getUserRef(uid);
    updateDoc(userRef, {
      comments: arrayUnion(commentRef.id),
    });

    return Promise.resolve(commentRef);
  } catch (error) {
    console.error("Unexpected error while trying to create comment", error);
    return Promise.reject(error);
  }
};

const getComment = async (commentID) => {
  const docSnap = await getDoc(doc(db, "comments", commentID));
  return docSnap.data();
};

const upvoteComment = async (commentID, uid) => {
  await updateDoc(doc(db, "comments", commentID), {
    upvotes: arrayUnion(uid),
    downvotes: arrayRemove(uid),
  });
};

const downvoteComment = async (commentID, uid) => {
  await updateDoc(doc(db, "comments", commentID), {
    downvotes: arrayUnion(uid),
    upvotes: arrayRemove(uid),
  });
};

export { createComment, getComment, downvoteComment, upvoteComment };
