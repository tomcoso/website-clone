import { initializeApp } from "firebase/app";
import {
  collection,
  doc,
  getCountFromServer,
  getFirestore,
  query,
  setDoc,
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

const login = ({ email, password }) => {
  signInWithEmailAndPassword(auth, email, password)
    .then(() => console.log("logged in succesfully"))
    .catch((error) => console.error("Couldn't sign in", error));
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
      setDoc(doc(db, "users", "data"), {
        username,
        uid: userCredential.user.uid,
      });
    })
    .catch((error) => {
      return Promise.reject(error.code);
    });
  return res;
};

export { auth, login, logout, createUser };
