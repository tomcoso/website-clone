import {
  addDoc,
  collection,
  arrayUnion,
  updateDoc,
  getDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { auth, db, getUserDoc } from "./firebase.app";
import { uploadImage, getImageURL } from "./firebase.storage";

const _postsRef = collection(db, "posts");

const createPost = async (title, content, community, nsfw, type) => {
  const newPost = {
    title,
    content: "",
    community,
    nsfw,
    upvotes: [auth.currentUser.uid],
    user: auth.currentUser.uid,
    comments: [],
  };
  try {
    const postRef = await addDoc(_postsRef, newPost);
    const userDoc = await getUserDoc(auth.currentUser.uid);

    if (type === "image") {
      var imageURL;

      await uploadImage(`communities/${community}/posts/${postRef.id}`, content)
        .then(async (snapshot) => (imageURL = await getImageURL(snapshot.ref)))
        .catch((err) => console.error("Could not upload image ", err));

      updateDoc(postRef, { id: postRef.id, content: imageURL });
    } else {
      updateDoc(postRef, { id: postRef.id });
    }
    updateDoc(doc(db, "users", userDoc.id), { posts: arrayUnion(postRef.id) });
    return postRef.id;
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};

const deletePost = async (postId, commData) => {
  const postDocRef = doc(db, "posts", postId);
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

export { createPost, deletePost };
