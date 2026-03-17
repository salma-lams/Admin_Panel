"use client";
import { useEffect, useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { fetchUsers, createUser, updateUser, deleteUser, type User } from "../../../store/usersSlice";
import { 
    Search, Plus, Pencil, Trash2, ChevronLeft, ChevronRight, 
    X, Loader2, Users, Shield, Mail, Zap, Calendar, 
    MoreVertical, Info, Filter, Activity
} from "lucide-react";
import toast from "react-hot-toast";
import UserModal from "../../../features/users/UserModal";

export default function UsersPage() {
    const dispatch = useAppDispatch();
    const { users, total, pages, isLoading } = useAppSelector((s) => s.users);
    const currentUser = useAppSelector((s) => s.auth.user);

    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState<"" | "admin" | "user">("");
    const [page, setPage] = useState(1);

    const [modal, setModal] = useState<"form" | "delete" | null>(null);
    const [selected, setSelected] = useState<User | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const load = useCallback(() => {
        dispatch(fetchUsers({ page, search, role: roleFilter }));
    }, [dispatch, page, search, roleFilter]);

    useEffect(() => { load(); }, [load]);

    // Reset page on filter change
    useEffect(() => { setPage(1); }, [search, roleFilter]);

    const handleSave = async (payload: any) => {
        setSubmitting(true);
        try {
            if (selected) {
                const res = await dispatch(updateUser({ id: selected._id, payload })).unwrap();
                toast.success(`Personnel ${res.name} updated`);
            } else {
                const res = await dispatch(createUser(payload)).unwrap();
                toast.success(`Personnel ${res.name} onboarded`);
            }
            setModal(null);
            load();
        } catch (err: any) {
            toast.error(err as string);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!selected) return;
        setSubmitting(true);
        try {
            await dispatch(deleteUser(selected._id)).unwrap();
            toast.success("Security clearance revoked");
            setModal(null);
            load();
        } catch (err: any) {
            toast.error(err as string);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in p-2">
            {/* Header */}
            <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase italic">
                        Personnel <span className="text-brand-600">Database</span>
                    </h1>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest text-[10px]">Access Level: Elevated</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => { setSelected(null); setModal("form"); }}
                        className="btn-primary !py-2.5 !px-6 !rounded-2xl shadow-brand-600/30 group"
                    >
                        <Plus size={18} className="group-hover:rotate-90 transition-transform" />
                        <span className="uppercase tracking-tighter font-black">Onboard Personnel</span>
                    </button>
                </div>
            </header>

            {/* Tactical Filtering */}
            <div className="card p-2 flex flex-col md:flex-row gap-2 bg-gray-50/50 dark:bg-gray-800/20 border-none">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-600 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search Identity Matrix..."
                        className="w-full bg-white dark:bg-gray-900 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold tracking-tight shadow-sm focus:ring-2 focus:ring-brand-500/20 transition-all"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="relative md:w-64 group">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-600 transition-colors" size={18} />
                    <select
                        className="w-full bg-white dark:bg-gray-900 border-none rounded-2xl py-4 pl-12 pr-10 text-[10px] font-black uppercase tracking-widest shadow-sm focus:ring-2 focus:ring-brand-500/20 transition-all appearance-none cursor-pointer"
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value as any)}
                    >
                        <option value="">All Clearances</option>
                        <option value="admin">Level 2 (Admin)</option>
                        <option value="user">Level 1 (User)</option>
                    </select>
                </div>
            </div>

            {/* Table Container */}
            <div className="card border-none bg-white dark:bg-gray-900 shadow-xl rounded-[2.5rem] overflow-hidden">
                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50/50 dark:bg-gray-800/30">
                                <th className="text-left px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Personnel</th>
                                <th className="text-left px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] hidden sm:table-cell">Clearance</th>
                                <th className="text-left px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] hidden md:table-cell">Status</th>
                                <th className="text-left px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] hidden lg:table-cell">Onboarded</th>
                                <th className="text-right px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800" />
                                                <div className="space-y-2 flex-1">
                                                    <div className="h-4 w-32 bg-gray-100 dark:bg-gray-800 rounded" />
                                                    <div className="h-3 w-48 bg-gray-50 dark:bg-gray-800/50 rounded" />
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center">
                                        <Users className="mx-auto text-gray-200 dark:text-gray-800 mb-4" size={48} />
                                        <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No matching personnel records</p>
                                    </td>
                                </tr>
                            ) : (
                                users.map((u) => (
                                    <tr key={u._id} className="group hover:bg-gray-50/50 dark:hover:bg-brand-900/5 transition-all">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-brand-600/10 flex items-center justify-center font-black text-brand-600 dark:text-brand-400 shadow-sm border border-brand-500/10 group-hover:scale-110 transition-transform duration-500">
                                                    {u.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <h3 className="text-sm font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
                                                        {u.name}
                                                        {u._id === currentUser?.id && (
                                                            <span className="px-1.5 py-0.5 rounded bg-brand-600 text-[8px] text-white uppercase font-black tracking-tighter shadow-lg shadow-brand-600/20">ROOT</span>
                                                        )}
                                                    </h3>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter flex items-center gap-1 mt-0.5">
                                                        <Mail size={10} /> {u.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 hidden sm:table-cell">
                                            <div className="flex items-center gap-2">
                                                <Shield size={14} className={u.role === "admin" ? "text-brand-500" : "text-emerald-500"} />
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${u.role === "admin" ? "text-brand-500" : "text-emerald-500"}`}>
                                                    {u.role === "admin" ? "Level 2" : "Level 1"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 hidden md:table-cell">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-1.5 h-1.5 rounded-full ${u.isActive ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-gray-400"}`} />
                                                <span className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                                                    {u.isActive ? "Operational" : "Suspended"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 hidden lg:table-cell text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} />
                                                {new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                                <button
                                                    onClick={() => { setSelected(u); setModal("form"); }}
                                                    className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center text-gray-400 hover:text-brand-500 hover:border-brand-500/30 transition-all shadow-sm"
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                                <button
                                                    onClick={() => { setSelected(u); setModal("delete"); }}
                                                    disabled={u._id === currentUser?.id}
                                                    className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-500/30 transition-all shadow-sm disabled:opacity-20 disabled:cursor-not-allowed"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Matrix */}
                {pages > 1 && (
                    <div className="px-8 py-6 bg-gray-50/50 dark:bg-gray-800/30 flex items-center justify-between">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                            Matrix Stream: <span className="text-gray-900 dark:text-white">{page}</span> of <span className="text-gray-900 dark:text-white">{pages}</span>
                        </p>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => setPage(p => Math.max(1, p - 1))} 
                                disabled={page === 1} 
                                className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center text-gray-900 dark:text-white disabled:opacity-30 border border-gray-100 dark:border-gray-700 shadow-sm"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <button 
                                onClick={() => setPage(p => Math.min(pages, p + 1))} 
                                disabled={page === pages} 
                                className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center text-gray-900 dark:text-white disabled:opacity-30 border border-gray-100 dark:border-gray-700 shadow-sm"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            <UserModal
                isOpen={modal === "form"}
                onClose={() => setModal(null)}
                onSave={handleSave}
                initialData={selected}
            />

            {modal === "delete" && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-gray-950/60 backdrop-blur-md animate-fade-in">
                    <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl w-full max-w-sm overflow-hidden animate-scale-in border border-red-500/10">
                        <div className="bg-red-500 p-8 text-white flex flex-col items-center">
                            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md mb-4 shadow-xl">
                                <Shield className="animate-pulse" size={32} />
                            </div>
                            <h2 className="text-2xl font-black uppercase tracking-tighter">Revoke Clearance</h2>
                        </div>
                        <div className="p-8 text-center space-y-6">
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider leading-relaxed">
                                Personnel Identity <span className="text-red-500 font-black">{selected?.name}</span> will be permanently purged from the matrix.
                            </p>
                            <div className="flex gap-4">
                                <button onClick={() => setModal(null)} className="btn-secondary flex-1 justify-center !py-4 font-bold uppercase text-xs">
                                    Abort
                                </button>
                                <button 
                                    onClick={handleDelete} 
                                    disabled={submitting} 
                                    className="btn-danger flex-1 justify-center !py-4 font-black uppercase text-xs shadow-xl shadow-red-500/20"
                                >
                                    {submitting ? <Loader2 size={18} className="animate-spin" /> : "Purge Matrix"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
