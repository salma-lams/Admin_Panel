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
    accessToken: string | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    accessToken: typeof window !== "undefined" ? localStorage.getItem("accessToken") : null,
    isLoading: false,
    error: null,
};

export const loginThunk = createAsyncThunk(
    "auth/login",
    async (payload: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const { data } = await authApi.login(payload);
            localStorage.setItem("accessToken", data.data.accessToken);
            localStorage.setItem("refreshToken", data.data.refreshToken);
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
        return rejectWithValue("Session expired");
    }
});

export const logoutThunk = createAsyncThunk("auth/logout", async () => {
    try { await authApi.logout(); } catch { /* silent */ }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
});

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<AuthUser>) {
            state.user = action.payload;
        },
        clearAuth(state) {
            state.user = null;
            state.accessToken = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginThunk.pending, (state) => { state.isLoading = true; state.error = null; })
            .addCase(loginThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.accessToken = action.payload.accessToken;
                state.user = action.payload.user;
            })
            .addCase(loginThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(getMeThunk.fulfilled, (state, action) => { state.user = action.payload; })
            .addCase(getMeThunk.rejected, (state) => { state.user = null; state.accessToken = null; })
            .addCase(logoutThunk.fulfilled, (state) => { state.user = null; state.accessToken = null; });
    },
});

export const { setUser, clearAuth } = authSlice.actions;
export default authSlice.reducer;
