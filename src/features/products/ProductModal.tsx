import { useEffect, useState } from "react";
import type { Product } from "./product.types";
import { X, Loader2, Save, DollarSign, Package, Tag } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => Promise<void> | void;
  initialData?: Product | null;
}

const ProductModal = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}: Props) => {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Product>({
    id: Date.now(),
    name: "",
    price: 0,
    stock: 0,
  });

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm({
        id: Date.now(),
        name: "",
        price: 0,
        stock: 0,
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
        <div className="relative px-8 py-8 bg-gradient-to-br from-brand-600 to-brand-800 text-white">
            <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 rounded-2xl bg-white/10 hover:bg-white/20 transition-colors"
            >
                <X size={20} />
            </button>
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-sm">
                    <Package size={28} />
                </div>
                <div>
                    <h2 className="text-2xl font-black tracking-tight uppercase">
                        {initialData ? "Modify Asset" : "Initialize Asset"}
                    </h2>
                    <p className="text-brand-100 text-xs font-bold uppercase tracking-widest mt-0.5">Global Inventory System</p>
                </div>
            </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Identity</label>
              <div className="relative group">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-600 transition-colors" size={18} />
                <input
                    required
                    placeholder="Product Designation"
                    className="input pl-12 !py-4 font-bold tracking-tight"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Valuation</label>
                    <div className="relative group">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-600 transition-colors" size={18} />
                        <input
                            required
                            type="number"
                            min="0"
                            placeholder="0.00"
                            className="input pl-12 !py-4 font-black"
                            value={form.price}
                            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Allocation</label>
                    <div className="relative group">
                        <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-600 transition-colors" size={18} />
                        <input
                            required
                            type="number"
                            min="0"
                            placeholder="0"
                            className="input pl-12 !py-4 font-black"
                            value={form.stock}
                            onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                        />
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
              Abeyance
            </button>
            <button 
                type="submit"
                className="btn-primary flex-1 justify-center !py-4 font-black uppercase tracking-widest text-xs shadow-xl shadow-brand-600/20" 
                disabled={saving}
            >
              {saving ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <><Save size={18} className="mr-2" /> Commit Changes</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
