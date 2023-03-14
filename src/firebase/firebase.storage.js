import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

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

export { uploadImage, getImageURL };
