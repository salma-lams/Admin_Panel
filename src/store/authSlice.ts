import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { authApi } from "../lib/api/auth";

export interface AuthUser {
    id: string;
    name: string;
    email: string;
    role: "admin" | "user";
    isActive?: boolean;
}

interface AuthState {
    user: AuthUser | null;
    isLoading: boolean;
    error: string | null;
    authChecked: boolean;
}

const initialState: AuthState = {
    user: null,
    isLoading: false,
    error: null,
    authChecked: false,
};

export const loginThunk = createAsyncThunk(
    "auth/login",
    async (payload: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const { data } = await authApi.login(payload);
            // Non-HttpOnly cookie for middleware visibility
            document.cookie = "_auth=1; path=/; max-age=604800; samesite=strict";
            return data.data;
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            return rejectWithValue(error.response?.data?.message ?? "Login failed");
        }
    }
);

export const getMeThunk = createAsyncThunk("auth/getMe", async (_, { rejectWithValue }) => {
    try {
        const { data } = await authApi.getMe();
        return data.data;
    } catch {
        // Clear marker cookie if fetch fails
        document.cookie = "_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        return rejectWithValue("Session expired");
    }
});

export const logoutThunk = createAsyncThunk("auth/logout", async () => {
    try { await authApi.logout(); } catch { /* silent */ }
    document.cookie = "_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
});

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<AuthUser>) {
            state.user = action.payload;
            state.authChecked = true;
        },
        clearAuth(state) {
            state.user = null;
            state.authChecked = true;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginThunk.pending, (state) => { state.isLoading = true; state.error = null; })
            .addCase(loginThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.authChecked = true;
            })
            .addCase(loginThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(getMeThunk.fulfilled, (state, action) => {
                state.user = action.payload;
                state.authChecked = true;
            })
            .addCase(getMeThunk.rejected, (state) => {
                state.user = null;
                state.authChecked = true;
            })
            .addCase(logoutThunk.fulfilled, (state) => {
                state.user = null;
                state.authChecked = true;
            });
    },
});

export const { setUser, clearAuth } = authSlice.actions;
export default authSlice.reducer;
