import {
  addDoc,
  arrayRemove,
  arrayUnion,
  doc,
  getCountFromServer,
  getDocs,
  query,
  updateDoc,
  where,
  collection,
  orderBy,
} from "firebase/firestore";
import { auth, db, getUserDoc } from "./firebase.app";
import { uploadImage, getImageURL } from "./firebase.storage";

const _communitiesRef = collection(db, "communities");
const _getCommunityID = async (name) => {
  const cSnapshot = await getDocs(
    query(_communitiesRef, where("name", "==", name))
  );
  let community;
  cSnapshot.forEach((x) => (community = x.id));
  return community;
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

const createCommunity = async (name, nsfw) => {
  const communitySnapshot = await getCountFromServer(
    query(_communitiesRef, where("name", "==", name))
  );

  // checks if comm name is available
  if (communitySnapshot.data().count > 0)
    return Promise.reject(Error("community-already-exists"));

  const newCommunity = {
    name,
    posts: [],
    moderators: [auth.currentUser.uid],
    members: [auth.currentUser.uid],
    timestamp: new Date(),
    blacklist: [],
    settings: {
      banner:
        "https://firebasestorage.googleapis.com/v0/b/coralit-media.appspot.com/o/elementor-placeholder-image.png?alt=media&token=0747eb9b-2505-4bd5-868a-482b0b2576ae",
      nsfw,
      profile:
        "https://firebasestorage.googleapis.com/v0/b/coralit-media.appspot.com/o/Cnobg.png?alt=media&token=9b94b7e9-47bc-42a8-ba0f-0c8e6bd304bd",
      title: name,
      desc: `This is ${name}. The greatest community on Coralit.`,
    },
  };
  const newCommRef = await addDoc(_communitiesRef, newCommunity).catch(
    (error) => Promise.reject(error)
  );

  // add id to document
  await updateDoc(newCommRef, { id: newCommRef.id });

  return newCommRef;
};

const updateSettings = async (name, settings) => {
  const community = await _getCommunityID(name);

  typeof settings.banner === "object" &&
    (await uploadImage(`communities/${name}/banner`, settings.banner)
      .then(
        async (snapshot) => (settings.banner = await getImageURL(snapshot.ref))
      )
      .catch((err) => console.error("Could not upload image ", err)));

  typeof settings.profile === "object" &&
    (await uploadImage(`communities/${name}/profile`, settings.profile)
      .then(
        async (snapshot) => (settings.profile = await getImageURL(snapshot.ref))
      )
      .catch((err) => console.error("Could not upload image ", err)));

  updateDoc(doc(db, "communities", community), {
    settings,
  });
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

const addPostToCommunity = async (name, postID) => {
  const commID = await _getCommunityID(name);

  updateDoc(doc(db, "communities", commID), {
    posts: arrayUnion(postID),
  });
};

const getAllCommunities = async () => {
  const commsCollection = collection(db, "communities");
  const q = query(commsCollection, orderBy("name"));
  const commsSnap = await getDocs(q);
  const list = [];
  commsSnap.forEach((doc) => list.push(doc.data().name));
  return list;
};

export {
  getCommunity,
  createCommunity,
  updateSettings,
  updateMemberOfCommunity,
  makeUserMod,
  unmakeUserMod,
  banUser,
  unbanUser,
  addPostToCommunity,
  getAllCommunities,
};
