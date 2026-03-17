"use client";
import { useEffect, useState } from "react";
import { X, Loader2, Save, User, Mail, Shield, Zap, Power } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: any) => Promise<void> | void;
  initialData?: any | null;
}

const UserModal = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}: Props) => {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    isActive: true,
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name,
        email: initialData.email,
        password: "",
        role: initialData.role,
        isActive: initialData.isActive ?? initialData.active ?? true,
      });
    } else {
      setForm({
        name: "",
        email: "",
        password: "",
        role: "user",
        isActive: true,
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } catch (error) {
        console.error("Save error:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-950/40 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="relative px-8 py-8 bg-gradient-to-br from-brand-600 to-indigo-700 text-white">
            <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 rounded-2xl bg-white/10 hover:bg-white/20 transition-colors"
            >
                <X size={20} />
            </button>
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-sm">
                    <User size={28} />
                </div>
                <div>
                    <h2 className="text-2xl font-black tracking-tight uppercase">
                        {initialData ? "Authorize Personnel" : "Onboard Personnel"}
                    </h2>
                    <p className="text-brand-100 text-xs font-bold uppercase tracking-widest mt-0.5">Tactical Access Management</p>
                </div>
            </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Designation</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-600 transition-colors" size={18} />
                <input
                    required
                    placeholder="Full Identity Name"
                    className="input pl-12 !py-4 font-bold tracking-tight"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Comms Protocol (Email)</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-600 transition-colors" size={18} />
                <input
                    required
                    type="email"
                    placeholder="identity@matrix.com"
                    className="input pl-12 !py-4 font-bold tracking-tight"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                Access Code {initialData && <span className="text-brand-400 lowercase">(Encrypt to change)</span>}
              </label>
              <div className="relative group">
                <Zap className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-600 transition-colors" size={18} />
                <input
                    required={!initialData}
                    type="password"
                    placeholder="••••••••"
                    className="input pl-12 !py-4 font-black"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Clearance</label>
                    <div className="relative group">
                        <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-600 transition-colors pointer-events-none" size={18} />
                        <select
                            className="input pl-12 !py-4 font-black uppercase text-xs"
                            value={form.role}
                            onChange={(e) => setForm({ ...form, role: e.target.value })}
                        >
                            <option value="user">Level 1 (User)</option>
                            <option value="admin">Level 2 (Admin)</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Status</label>
                    <div className="relative group">
                        <Power className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-600 transition-colors pointer-events-none" size={18} />
                        <select
                            className="input pl-12 !py-4 font-black uppercase text-xs"
                            value={form.isActive ? "active" : "inactive"}
                            onChange={(e) => setForm({ ...form, isActive: e.target.value === "active" })}
                        >
                            <option value="active">Operational</option>
                            <option value="inactive">Suspended</option>
                        </select>
                    </div>
                </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button 
                type="button"
                className="btn-secondary flex-1 justify-center !py-4 font-bold uppercase tracking-widest text-xs" 
                onClick={onClose}
            >
              Abort
            </button>
            <button 
                type="submit"
                className="btn-primary flex-1 justify-center !py-4 font-black uppercase tracking-widest text-xs shadow-xl shadow-brand-600/20" 
                disabled={saving}
            >
              {saving ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <><Save size={18} className="mr-2" /> Execute Protocol</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
