import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    token: null,
    userInfo: null,
  },
  reducers: {
    setUserToken: (state, action) => {
      state.token = action.payload;
    },
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    clearUser: (state) => {
      state.token = null;
      state.userInfo = null;
    },
  }
});

export const { setUserToken, setUserInfo, clearUser } = userSlice.actions;
export default userSlice.reducer;
