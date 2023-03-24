import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  listAll,
} from "firebase/storage";

const storage = getStorage();
// const communities = ref(storage, "communities");

const uploadImage = async (folder, file) => {
  if (typeof file !== "object") return Promise.reject("Incorrect file format");
  let imageRef = "";
  const folderRef = ref(storage, folder);
  await uploadBytes(folderRef, file).then((snapshot) => {
    imageRef = snapshot;
  });
  return Promise.resolve(imageRef);
};

const getImageURL = async (ref) => {
  let url = "";
  await getDownloadURL(ref).then((result) => (url = result));
  return url;
};

const deleteDraftFiles = async (uid) => {
  const draft = ref(storage, `users/${uid}/draft`);
  await listAll(draft).then((res) => {
    res.items.forEach((x) => deleteObject(x));
  });
  // console.log("deleted all files from draft");
};

const deleteFileFromURL = async (url, uid) => {
  const draft = ref(storage, `users/${uid}/draft/`);
  try {
    let list;
    await listAll(draft).then((res) => {
      list = res.items;
    });
    list.forEach(async (x) => {
      const xurl = await getDownloadURL(x);
      if (xurl === url) deleteObject(x);
    });
    return Promise.resolve();
  } catch (err) {
    return Promise.reject(err);
  }
};

export { uploadImage, getImageURL, deleteDraftFiles, deleteFileFromURL };
