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

// FETCH COMMENTS and organise in queue with indentation data
const getRecursiveComments = async (commentID, indent) => {
  const list = [];
  const docSnap = await getDoc(doc(db, "comments", commentID));
  const data = docSnap.data();
  list.push({ id: docSnap.id, indent });

  if (data.replies.length === 0) return list;

  for (let comment of data.replies) {
    const sublist = await getRecursiveComments(comment, indent + 1);
    list.push(...sublist);
  }
  return list;
};

const fetchPostComments = async (postID) => {
  const queue = [];
  const postSnap = await getDoc(doc(db, "posts", postID));
  const postData = postSnap.data();

  if (postData.comments.length === 0) return [];

  for (let comment of postData.comments) {
    const list = await getRecursiveComments(comment, 0);
    queue.push(...list);
  }

  return queue;
};

export {
  createComment,
  getComment,
  downvoteComment,
  upvoteComment,
  fetchPostComments,
};
