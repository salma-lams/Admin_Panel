"use client";
import { useEffect, useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { fetchProductsThunk, createProductThunk, updateProductThunk, deleteProductThunk } from "../../../store/productsSlice";
import { Package, Search, Plus, Pencil, Trash2, Activity, TrendingUp, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import type { Product } from "../../../features/products/product.types";
import ProductModal from "../../../features/products/ProductModal";

export default function ProductsPage() {
    const dispatch = useAppDispatch();
    const { products, isLoading, total } = useAppSelector((state) => state.products);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [productToDelete, setProductToDelete] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const loadProducts = useCallback(() => {
        dispatch(fetchProductsThunk({ search }));
    }, [dispatch, search]);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleAdd = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleSave = async (payload: Product) => {
        try {
            if (editingProduct) {
                await dispatch(updateProductThunk({ id: editingProduct.id, payload })).unwrap();
                toast.success("Product updated successfully");
            } else {
                await dispatch(createProductThunk(payload)).unwrap();
                toast.success("Product added successfully");
            }
            setIsModalOpen(false);
        } catch (err: any) {
            toast.error(err || "Failed to save product");
        }
    };

    const handleDelete = async () => {
        if (productToDelete === null) return;
        setIsDeleting(true);
        try {
            await dispatch(deleteProductThunk(productToDelete)).unwrap();
            toast.success("Product deleted successfully");
            setProductToDelete(null);
        } catch (err: any) {
            toast.error(err || "Failed to delete product");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in px-2">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                        Product <span className="text-brand-600">Inventory</span>
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium italic">
                        Real-time tracking of your global catalog performance.
                    </p>
                </div>
                <button
                    onClick={handleAdd}
                    className="btn-primary group !px-6 !py-3"
                >
                    <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                    <span className="text-base">Add New Product</span>
                </button>
            </div>

            {/* Premium Info Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-2">
                <div className="card p-4 flex items-center gap-4 bg-gradient-to-br from-brand-50 to-white dark:from-brand-950/20 dark:to-gray-900 border border-gray-100 dark:border-gray-800">
                    <div className="w-12 h-12 rounded-2xl bg-brand-600/10 flex items-center justify-center text-brand-600">
                        <Package size={24} />
                    </div>
                    <div>
                        <p className="text-2xl font-black text-gray-900 dark:text-white leading-none">{total}</p>
                        <p className="text-xs font-bold text-gray-500 uppercase mt-1 tracking-widest">Gross SKU Count</p>
                    </div>
                </div>
                {/* Visual Filler */}
                <div className="md:col-span-2 card p-4 flex items-center bg-gray-900 text-white overflow-hidden relative border border-gray-800">
                    <div className="relative z-10 flex items-center gap-6">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-gray-900 bg-gray-800 flex items-center justify-center text-[10px] font-bold">P{i}</div>
                            ))}
                        </div>
                        <p className="text-sm font-medium text-gray-300 italic">"Global inventory synchronization active. All nodes healthy."</p>
                    </div>
                    <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-brand-600/20 to-transparent" />
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col lg:flex-row gap-4 mb-2">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-500 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Filter by product name, ID or description..."
                        className="input pl-12 w-full !bg-white dark:!bg-gray-900 !border-gray-200 dark:!border-gray-800 !py-4 shadow-sm focus:shadow-xl focus:shadow-brand-500/5"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <select className="input !py-4 !bg-white dark:!bg-gray-900 lg:w-48 shadow-sm font-bold text-xs uppercase tracking-widest" value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option>All Categories</option>
                        <option>Electronics</option>
                        <option>Premium Gear</option>
                        <option>Office Tech</option>
                    </select>
                </div>
            </div>

            {/* Senior Table */}
            <div className="card-premium border-none !bg-transparent shadow-none">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-separate border-spacing-y-3">
                        <thead>
                            <tr className="text-gray-400">
                                <th className="px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Listing</th>
                                <th className="px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Financials</th>
                                <th className="px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Availability</th>
                                <th className="px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em] opacity-60 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={4} className="px-6 py-10 bg-gray-100/50 dark:bg-gray-800/20 rounded-3xl" />
                                    </tr>
                                ))
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan={4} className="px-6 py-20 text-center glass rounded-3xl border-dashed border-2 border-gray-200 dark:border-gray-800"><p className="text-gray-500 font-bold uppercase tracking-widest text-sm text-center">Deployment Empty — No assets found</p></td></tr>
                            ) : (
                                filtered.map((p) => (
                                    <tr key={p.id} className="group transition-all duration-300">
                                        <td className="px-6 py-6 bg-white dark:bg-gray-900 first:rounded-l-3xl border-y border-l border-gray-100 dark:border-gray-800 group-hover:border-brand-500/30">
                                            <div className="flex items-center gap-5">
                                                <div className="relative group/img">
                                                    <div className="w-16 h-16 rounded-[2rem] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500 shadow-inner group-hover/img:scale-110 transition-transform duration-500">
                                                        <Package size={28} />
                                                    </div>
                                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-brand-600 border-2 border-white dark:border-gray-900 flex items-center justify-center shadow-lg shadow-brand-600/30">
                                                        <Activity size={10} className="text-white" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="font-black text-gray-900 dark:text-white text-lg tracking-tight group-hover:text-brand-600 transition-colors uppercase">{p.name}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-[10px] font-black bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded tracking-tighter">ID: {p.id}</span>
                                                        <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase italic">Enterprise Listed</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800 group-hover:border-brand-500/30">
                                            <div className="flex flex-col">
                                                <span className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">${p.price.toLocaleString()}</span>
                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                    <TrendingUp size={12} className="text-emerald-500" />
                                                    <span className="text-[10px] text-emerald-500 font-black">+12.4%</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800 group-hover:border-brand-500/30">
                                            <div className="flex flex-col gap-3 max-w-[140px]">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-black text-gray-900 dark:text-white tracking-widest">{p.stock}</span>
                                                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${p.stock > 15 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                                        {p.stock > 15 ? 'NOMINAL' : 'LIMIT'}
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-lg p-[2px]">
                                                    <div
                                                        className={`h-full rounded-md transition-all duration-1000 shadow-[0_0_8px_rgba(0,0,0,0.1)] ${p.stock > 15 ? 'bg-emerald-500' : 'bg-gradient-to-r from-amber-500 to-orange-500'}`}
                                                        style={{ width: `${Math.min((p.stock / 50) * 100, 100)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 bg-white dark:bg-gray-900 last:rounded-r-3xl border-y border-r border-gray-100 dark:border-gray-800 group-hover:border-brand-500/30 text-right">
                                            <div className="flex items-center justify-end gap-3 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                                                <button
                                                    onClick={() => handleEdit(p)}
                                                    className="w-10 h-10 rounded-2xl bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/40 flex items-center justify-center transition-all shadow-sm active:scale-90 border border-transparent hover:border-brand-500/20"
                                                >
                                                    <Pencil size={18} />
                                                </button>
                                                <button
                                                    onClick={() => setProductToDelete(p.id)}
                                                    className="w-10 h-10 rounded-2xl bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/40 flex items-center justify-center transition-all shadow-sm active:scale-90 border border-transparent hover:border-red-500/20"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            <ProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                initialData={editingProduct}
            />

            {/* Delete Confirmation */}
            {productToDelete !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-sm animate-scale-in p-8 text-center border border-gray-100 dark:border-gray-800">
                        <div className="w-20 h-20 rounded-[2.5rem] bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-red-500/10">
                            <Trash2 size={32} className="text-red-500" />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2 tracking-tight uppercase">Delete Asset?</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 font-medium italic">
                            "This procedure is irreversible. The asset data will be purged from the global inventory."
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setProductToDelete(null)}
                                className="btn-secondary flex-1 justify-center !py-4"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="btn-danger flex-1 justify-center !py-4 shadow-lg shadow-red-500/20"
                            >
                                {isDeleting ? <><Loader2 size={16} className="animate-spin mr-2" /> Working…</> : "Confirm Purge"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
