import { createSlice } from "@reduxjs/toolkit";


const initialToken = localStorage.getItem('token');
const storedUser = localStorage.getItem('user');
const initialUser = storedUser ? JSON.parse(storedUser) : null;

const authSlice  = createSlice({
    name: 'auth',
    initialState: {
        isLoggedIn: !!initialToken,
        token: initialToken || null,
        user: initialUser || null,
    },
    reducers: {
        login: (state, action) => {
            const { token, user } = action.payload || {};
            state.token = token;
            state.user = user;
            state.isLoggedIn = true;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
        },
        logout: (state) => {
            state.isLoggedIn = false;
            state.token = null;
            state.user = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        },
        updateUser: (state, action) => {
            state.user = { ...state.user, ...action.payload };
            localStorage.setItem('user', JSON.stringify(state.user)); 
        }
    }
});

export const {login, logout, updateUser}  = authSlice.actions;
export default authSlice.reducer;
