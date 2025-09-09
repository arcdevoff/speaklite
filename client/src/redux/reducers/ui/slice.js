import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  message: {
    text: null,
    status: null,
  },
};

const ui = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setMessage: (state, action) => {
      state.message = action.payload;
    },
  },
});

export const { setMessage } = ui.actions;
export default ui.reducer;
