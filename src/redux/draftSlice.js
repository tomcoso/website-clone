import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getImageURL, uploadImage } from "../firebase/firebase.storage";
import uniqid from "uniqid";

const addImg = createAsyncThunk("draft/imageUpload", async (data, thunkAPI) => {
  const imgID = uniqid();
  try {
    let imgURL;
    await uploadImage(`users/${data.uid}/draft/${imgID}`, data.image).then(
      async (snapshot) => (imgURL = await getImageURL(snapshot.ref))
    );
    return Promise.resolve(imgURL);
  } catch (err) {
    return Promise.reject(err);
  }
});

const draftSlice = createSlice({
  name: "draft",
  initialState: { title: "", content: null },
  reducers: {
    updateTitle: (state, action) => {
      state.title = action.payload.title;
    },
    updateText: (state, action) => {
      state.content = action.payload.content;
    },
    removeImg: (state, action) => {
      state.content.find();
    },
    clear: (state) => {
      state.title = "";
      state.content = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addImg.fulfilled, (state, action) => {
      state.content
        ? state.content.push(action.payload)
        : (state.content = [action.payload]);
    });
    builder.addCase(addImg.rejected, (state, action) => {
      console.error("Error handling file", action.payload);
    });
  },
});

export default draftSlice.reducer;
export const { updateTitle, updateText, removeImg, clear } = draftSlice.actions;
export { addImg };
