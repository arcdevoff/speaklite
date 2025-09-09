import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accessToken: "",
  data: [],
  userDataRefresh: false,
};

const user = createSlice({
  name: "user",
  initialState,
  reducers: {
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    setUserData: (state, action) => {
      state.data = action.payload;
    },
    setUserDataRefresh: (state, action) => {
      state.userDataRefresh = action.payload;
    },
  },
});

export const { setAccessToken, setUserData, setUserDataRefresh } = user.actions;
export default user.reducer;
