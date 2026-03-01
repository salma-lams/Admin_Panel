"use client";
import { useEffect, useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { fetchUsers, createUser, updateUser, deleteUser, type User } from "../../../store/usersSlice";
import { Search, Plus, Pencil, Trash2, ChevronLeft, ChevronRight, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import clsx from "clsx";

interface UserForm {
    name: string;
    email: string;
    password: string;
    role: "admin" | "user";
    isActive: boolean;
}

const BLANK_FORM: UserForm = { name: "", email: "", password: "", role: "user", isActive: true };

export default function UsersPage() {
    const dispatch = useAppDispatch();
    const { users, total, pages, isLoading } = useAppSelector((s) => s.users);
    const currentUser = useAppSelector((s) => s.auth.user);

    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState<"" | "admin" | "user">("");
    const [page, setPage] = useState(1);

    const [modal, setModal] = useState<"create" | "edit" | "delete" | null>(null);
    const [selected, setSelected] = useState<User | null>(null);
    const [form, setForm] = useState<UserForm>(BLANK_FORM);
    const [submitting, setSubmitting] = useState(false);

    const load = useCallback(() => {
        dispatch(fetchUsers({ page, search, role: roleFilter }));
    }, [dispatch, page, search, roleFilter]);

    useEffect(() => { load(); }, [load]);

    // Debounce search
    useEffect(() => { setPage(1); }, [search, roleFilter]);

    function openCreate() { setForm(BLANK_FORM); setSelected(null); setModal("create"); }
    function openEdit(u: User) { setForm({ name: u.name, email: u.email, password: "", role: u.role, isActive: u.isActive }); setSelected(u); setModal("edit"); }
    function openDelete(u: User) { setSelected(u); setModal("delete"); }
    function closeModal() { setModal(null); setSelected(null); setForm(BLANK_FORM); }

    async function handleCreate() {
        if (!form.name || !form.email || !form.password) { toast.error("All fields required"); return; }
        setSubmitting(true);
        const res = await dispatch(createUser(form));
        setSubmitting(false);
        if (createUser.fulfilled.match(res)) { toast.success("User created"); closeModal(); load(); }
        else toast.error(res.payload as string);
    }

    async function handleEdit() {
        if (!selected) return;
        setSubmitting(true);
        const payload = { name: form.name, email: form.email, role: form.role, isActive: form.isActive, ...(form.password ? { password: form.password } : {}) };
        const res = await dispatch(updateUser({ id: selected._id, payload }));
        setSubmitting(false);
        if (updateUser.fulfilled.match(res)) { toast.success("User updated"); closeModal(); load(); }
        else toast.error(res.payload as string);
    }

    async function handleDelete() {
        if (!selected) return;
        setSubmitting(true);
        const res = await dispatch(deleteUser(selected._id));
        setSubmitting(false);
        if (deleteUser.fulfilled.match(res)) { toast.success("User deleted"); closeModal(); load(); }
        else toast.error(res.payload as string);
    }

    return (
        <div className="space-y-5 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{total} total users</p>
                </div>
                <div className="sm:ml-auto">
                    <button id="create-user-btn" onClick={openCreate} className="btn-primary">
                        <Plus size={16} /> Add User
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="card p-4 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        id="user-search"
                        type="text"
                        className="input pl-9"
                        placeholder="Search name or email…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <select
                    id="role-filter"
                    className="input sm:w-40"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value as "" | "admin" | "user")}
                >
                    <option value="">All roles</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                </select>
            </div>

            {/* Table */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">Status</th>
                                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">Joined</th>
                                <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i}><td colSpan={5} className="px-5 py-4"><div className="h-6 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" /></td></tr>
                                ))
                            ) : users.length === 0 ? (
                                <tr><td colSpan={5} className="px-5 py-12 text-center text-gray-400">No users found</td></tr>
                            ) : (
                                users.map((u) => (
                                    <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-brand-600/20 flex items-center justify-center font-semibold text-brand-600 dark:text-brand-400 text-sm shrink-0">
                                                    {u.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-gray-100">{u.name}
                                                        {u._id === currentUser?.id && <span className="ml-2 text-[10px] text-brand-500 font-semibold uppercase">(you)</span>}
                                                    </p>
                                                    <p className="text-xs text-gray-400 dark:text-gray-500">{u.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={u.role === "admin" ? "badge-admin" : "badge-user"}>{u.role}</span>
                                        </td>
                                        <td className="px-5 py-4 hidden md:table-cell">
                                            <span className={u.isActive ? "badge-active" : "badge-inactive"}>
                                                {u.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-gray-400 text-xs hidden lg:table-cell">
                                            {new Date(u.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    id={`edit-user-${u._id}`}
                                                    onClick={() => openEdit(u)}
                                                    className="p-2 rounded-lg text-gray-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors"
                                                >
                                                    <Pencil size={15} />
                                                </button>
                                                <button
                                                    id={`delete-user-${u._id}`}
                                                    onClick={() => openDelete(u)}
                                                    className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                                    disabled={u._id === currentUser?.id}
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pages > 1 && (
                    <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                        <p className="text-sm text-gray-500">Page {page} of {pages}</p>
                        <div className="flex gap-1">
                            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary p-2 disabled:opacity-40">
                                <ChevronLeft size={16} />
                            </button>
                            <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages} className="btn-secondary p-2 disabled:opacity-40">
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Create / Edit Modal */}
            {(modal === "create" || modal === "edit") && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md animate-scale-in">
                        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800">
                            <h2 className="font-bold text-gray-900 dark:text-white text-lg">
                                {modal === "create" ? "Create User" : "Edit User"}
                            </h2>
                            <button onClick={closeModal} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-colors">
                                <X size={18} />
                            </button>
                        </div>
                        <div className="px-6 py-5 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Name</label>
                                <input id="user-name" className="input" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
                                <input id="user-email" className="input" type="email" placeholder="user@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                    Password {modal === "edit" && <span className="text-gray-400 font-normal">(leave blank to keep)</span>}
                                </label>
                                <input id="user-password" className="input" type="password" placeholder="••••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Role</label>
                                    <select id="user-role" className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as "admin" | "user" })}>
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Status</label>
                                    <select id="user-status" className="input" value={form.isActive ? "active" : "inactive"} onChange={(e) => setForm({ ...form, isActive: e.target.value === "active" })}>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3 px-6 pb-6 pt-2">
                            <button onClick={closeModal} className="btn-secondary flex-1 justify-center">Cancel</button>
                            <button
                                id="save-user-btn"
                                onClick={modal === "create" ? handleCreate : handleEdit}
                                disabled={submitting}
                                className="btn-primary flex-1 justify-center"
                            >
                                {submitting ? <><Loader2 size={14} className="animate-spin" /> Saving…</> : modal === "create" ? "Create" : "Save changes"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete confirm modal */}
            {modal === "delete" && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm animate-scale-in p-6 text-center">
                        <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
                            <Trash2 size={24} className="text-red-500" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Delete user?</h2>
                        <p className="text-sm text-gray-400 mb-6">
                            This will permanently delete <strong className="text-gray-300">{selected?.name}</strong>. This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button onClick={closeModal} className="btn-secondary flex-1 justify-center">Cancel</button>
                            <button id="confirm-delete-btn" onClick={handleDelete} disabled={submitting} className="btn-danger flex-1 justify-center">
                                {submitting ? <><Loader2 size={14} className="animate-spin" /> Deleting…</> : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
