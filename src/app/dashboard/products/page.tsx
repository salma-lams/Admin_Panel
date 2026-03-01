"use client";
import { useEffect, useState } from "react";
import { api } from "../../../lib/axios";
import { Package, Search, Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface Product {
    _id: string;
    id: number;
    name: string;
    price: number;
    stock: number;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/products")
            .then(({ data }) => setProducts(Array.isArray(data) ? data : data.data ?? []))
            .catch(() => toast.error("Failed to load products"))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="space-y-5 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Products</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{products.length} total products</p>
                </div>
            </div>

            <div className="card overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                            <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                            <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i}><td colSpan={3} className="px-5 py-4"><div className="h-5 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" /></td></tr>
                            ))
                        ) : products.length === 0 ? (
                            <tr><td colSpan={3} className="px-5 py-12 text-center text-gray-400">No products found</td></tr>
                        ) : (
                            products.map((p) => (
                                <tr key={p._id ?? p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
                                                <Package size={16} className="text-amber-600 dark:text-amber-400" />
                                            </div>
                                            <span className="font-medium text-gray-900 dark:text-gray-100">{p.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-gray-600 dark:text-gray-300 font-semibold">${p.price.toLocaleString()}</td>
                                    <td className="px-5 py-4">
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${p.stock > 20 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"}`}>
                                            {p.stock} in stock
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
