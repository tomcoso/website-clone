import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import {
  addDoc,
  collection,
  getCountFromServer,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "./firebase.app";

// USERS ----------------------------------------------------------------------

const _usersRef = collection(db, "users");

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
  // checks password
  if (
    !password.match(/^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=[^0-9]*[0-9]).{8,16}$/)
  )
    return Promise.reject(Error("pass/mismatch").message);

  // check username
  if (!username.match(/^\w{6,}$/))
    return Promise.reject(Error("username/mismatch").message);
  const usernameSnapshot = await getCountFromServer(
    query(_usersRef, where("username", "==", username))
  );
  if (usernameSnapshot.data().count > 0) {
    const error = Error("auth/username-already-in-use");
    return Promise.reject(error.message);
  }

  //  creates user on firebase auth
  const res = await createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      updateProfile(userCredential.user, { displayName: username });
      sendEmailVerification(userCredential.user);
      const uid = userCredential.user.uid;
      addDoc(_usersRef, {
        uid,
        username,
        subscribed: [],
        posts: [],
        comments: [],
        timestamp: new Date(),
        settings: { theme: "light", nsfw: false },
      });
    })
    .catch((error) => {
      return Promise.reject(error.code);
    });
  console.log(res);
  return res;
};

export { login, logout, createUser };
