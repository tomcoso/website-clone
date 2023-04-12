import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  deleteFileFromURL,
  getImageURL,
  uploadImage,
} from "../firebase/firebase.storage";
import uniqid from "uniqid";
import {
  addContentToDraft,
  removeContentFromDraft,
} from "../firebase/firebase.app";

const addImg = createAsyncThunk("draft/imageUpload", async (data, thunkAPI) => {
  const imgID = uniqid();
  try {
    let imgURL;
    await uploadImage(
      `communities/${data.commName}/posts/${data.uid}/${imgID}`,
      data.image
    ).then(async (snapshot) => (imgURL = await getImageURL(snapshot.ref)));
    addContentToDraft(imgURL);
    return Promise.resolve({
      url: imgURL,
      uid: data.uid,
      commName: data.commName,
    });
  } catch (err) {
    return Promise.reject(err);
  }
});

const removeImg = createAsyncThunk(
  "draft/imageRemove",
  async (data, thunkAPI) => {
    try {
      await deleteFileFromURL(data.url, data.uid, data.commName);
      removeContentFromDraft(data.url);
      return Promise.resolve(data.url);
    } catch (err) {
      return Promise.reject(err);
    }
  }
);

const draftSlice = createSlice({
  name: "draft",
  initialState: { title: "", content: null, type: "post", nsfw: false },
  reducers: {
    updateTitle: (state, action) => {
      state.title = action.payload;
    },
    updateContent: (state, action) => {
      state.content = action.payload;
    },
    updateType: (state, action) => {
      state.type = action.payload;
      state.content = action.payload === "post" ? "" : [];
    },
    updateNSFW: (state, action) => {
      state.nsfw = action.payload;
    },
    clear: (state) => {
      state.title = "";
      state.content = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addImg.fulfilled, (state, action) => {
      state.content.length > 0
        ? (state.content = state.content.concat(action.payload.url))
        : (state.content = [action.payload.url]);
    });
    builder.addCase(addImg.rejected, (state, action) => {
      console.error("Error handling file", action.payload);
    });
    builder.addCase(removeImg.fulfilled, (state, action) => {
      let index;
      state.content.forEach((x, i) => {
        if (x === action.payload) index = i;
      });
      state.content.splice(index, 1);
    });
    builder.addCase(removeImg.pending, () => {});
    builder.addCase(removeImg.rejected, (state, action) => {
      console.error("Error removing file", action.payload);
    });
  },
});

export default draftSlice.reducer;
export const { updateTitle, updateContent, clear, updateNSFW, updateType } =
  draftSlice.actions;
export { addImg, removeImg };
