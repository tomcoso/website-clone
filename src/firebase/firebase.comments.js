import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db, getUserRef } from "./firebase.app";

const commentsRef = collection(db, "comments");

const createComment = async (uid, parent, content, type, commentType) => {
  const comment = {
    user: uid,
    content: content,
    type: type,
    timestamp: new Date(),
    parent: parent,
    replies: [],
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

export { createComment, getComment };
