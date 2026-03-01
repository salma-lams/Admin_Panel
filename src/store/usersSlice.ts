import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { usersApi, type UserFilters } from "../lib/api/users";

export interface User {
    _id: string;
    name: string;
    email: string;
    role: "admin" | "user";
    isActive: boolean;
    createdAt: string;
}

interface UsersState {
    users: User[];
    total: number;
    pages: number;
    page: number;
    isLoading: boolean;
    error: string | null;
}

const initialState: UsersState = {
    users: [],
    total: 0,
    pages: 1,
    page: 1,
    isLoading: false,
    error: null,
};

export const fetchUsers = createAsyncThunk(
    "users/fetch",
    async (filters: UserFilters, { rejectWithValue }) => {
        try {
            const { data } = await usersApi.list(filters);
            return data.data;
        } catch (err: unknown) {
            const e = err as { response?: { data?: { message?: string } } };
            return rejectWithValue(e.response?.data?.message ?? "Failed to fetch users");
        }
    }
);

export const createUser = createAsyncThunk(
    "users/create",
    async (payload: { name: string; email: string; password: string; role?: string; isActive?: boolean }, { rejectWithValue }) => {
        try {
            const { data } = await usersApi.create(payload);
            return data.data;
        } catch (err: unknown) {
            const e = err as { response?: { data?: { message?: string } } };
            return rejectWithValue(e.response?.data?.message ?? "Failed to create user");
        }
    }
);

export const updateUser = createAsyncThunk(
    "users/update",
    async ({ id, payload }: { id: string; payload: Partial<{ name: string; email: string; role: string; isActive: boolean; password: string }> }, { rejectWithValue }) => {
        try {
            const { data } = await usersApi.update(id, payload);
            return data.data;
        } catch (err: unknown) {
            const e = err as { response?: { data?: { message?: string } } };
            return rejectWithValue(e.response?.data?.message ?? "Failed to update user");
        }
    }
);

export const deleteUser = createAsyncThunk(
    "users/delete",
    async (id: string, { rejectWithValue }) => {
        try {
            await usersApi.delete(id);
            return id;
        } catch (err: unknown) {
            const e = err as { response?: { data?: { message?: string } } };
            return rejectWithValue(e.response?.data?.message ?? "Failed to delete user");
        }
    }
);

const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (s) => { s.isLoading = true; s.error = null; })
            .addCase(fetchUsers.fulfilled, (s, a) => {
                s.isLoading = false;
                s.users = a.payload.users;
                s.total = a.payload.total;
                s.pages = a.payload.pages;
                s.page = a.payload.page;
            })
            .addCase(fetchUsers.rejected, (s, a) => { s.isLoading = false; s.error = a.payload as string; })
            .addCase(createUser.fulfilled, (s, a) => { s.users.unshift(a.payload); s.total++; })
            .addCase(updateUser.fulfilled, (s, a) => {
                const idx = s.users.findIndex((u) => u._id === a.payload._id);
                if (idx !== -1) s.users[idx] = a.payload;
            })
            .addCase(deleteUser.fulfilled, (s, a) => {
                s.users = s.users.filter((u) => u._id !== a.payload);
                s.total--;
            });
    },
});

export default usersSlice.reducer;
