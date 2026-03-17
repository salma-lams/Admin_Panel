import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../features/products/product.api";
import type { Product } from "../features/products/product.types";

interface ProductsState {
    products: Product[];
    total: number;
    pages: number;
    page: number;
    isLoading: boolean;
    error: string | null;
}

const initialState: ProductsState = {
    products: [],
    total: 0,
    pages: 1,
    page: 1,
    isLoading: false,
    error: null,
};

export const fetchProductsThunk = createAsyncThunk(
    "products/fetch",
    async (params: { page?: number; limit?: number; search?: string } = {}, { rejectWithValue }) => {
        try {
            // The api wrapper already extracts the array.
            // But for the dashboard we might need the full object for pagination.
            // Let's re-verify the api wrapper.
            const products = await getProducts();
            return { data: products, total: products.length, pages: 1, page: 1 };
        } catch (err: any) {
            return rejectWithValue(err.message || "Failed to fetch products");
        }
    }
);

export const createProductThunk = createAsyncThunk(
    "products/create",
    async (payload: Partial<Product>, { rejectWithValue }) => {
        try {
            return await createProduct(payload);
        } catch (err: any) {
            return rejectWithValue(err.message || "Failed to create product");
        }
    }
);

export const updateProductThunk = createAsyncThunk(
    "products/update",
    async ({ id, payload }: { id: number; payload: Partial<Product> }, { rejectWithValue }) => {
        try {
            return await updateProduct(id, payload);
        } catch (err: any) {
            return rejectWithValue(err.message || "Failed to update product");
        }
    }
);

export const deleteProductThunk = createAsyncThunk(
    "products/delete",
    async (id: number, { rejectWithValue }) => {
        try {
            await deleteProduct(id);
            return id;
        } catch (err: any) {
            return rejectWithValue(err.message || "Failed to delete product");
        }
    }
);

const productsSlice = createSlice({
    name: "products",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProductsThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchProductsThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.products = action.payload.data;
                state.total = action.payload.total;
                state.pages = action.payload.pages;
                state.page = action.payload.page;
            })
            .addCase(fetchProductsThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(createProductThunk.fulfilled, (state, action) => {
                state.products.unshift(action.payload);
                state.total++;
            })
            .addCase(updateProductThunk.fulfilled, (state, action) => {
                const index = state.products.findIndex((p) => p.id === action.payload.id);
                if (index !== -1) {
                    state.products[index] = action.payload;
                }
            })
            .addCase(deleteProductThunk.fulfilled, (state, action) => {
                state.products = state.products.filter((p) => p.id !== action.payload);
                state.total--;
            });
    },
});

export default productsSlice.reducer;
