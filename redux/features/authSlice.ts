import { createSlice } from "@reduxjs/toolkit";

interface ProfileData {
  id: number;
  username: string;
  email: string;
  bio: string;
  profile_picture: string;
  gender: string;
  website: string;
  date_joined: string;
}

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  socketConnected: boolean;
  messages: null;
  profilePicture: ProfileData | null;
}

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  socketConnected: false,
  messages: null,
} as AuthState;

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state) => {
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.socketConnected = false;
    },
    finishInitialLoad: (state) => {
      state.isLoading = false;
    },
    setSocketConnected: (state) => {
      state.socketConnected = true;
    },
    setSocketDisconnected: (state) => {
      state.socketConnected = false;
    },
    setMessage: (state, action) => {
      state.messages = action.payload;
    },
    updateProfilePicture: (state, action) => {
      state.profilePicture = action.payload;
    },
  },
});

export const {
  setAuth,
  logout,
  finishInitialLoad,
  setSocketConnected,
  setSocketDisconnected,
  setMessage,
  updateProfilePicture,
} = authSlice.actions;
export default authSlice.reducer;
