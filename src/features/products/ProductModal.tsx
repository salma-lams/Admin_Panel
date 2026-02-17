import { useEffect, useState } from "react";
import type { Product } from "./product.types";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  initialData?: Product | null;
}

const ProductModal = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}: Props) => {
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
  }, [initialData]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white p-6 rounded w-96 space-y-4">
        <h2 className="text-xl font-bold">
          {initialData ? "Edit Product" : "Add Product"}
        </h2>

        <Input
          placeholder="Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <Input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) =>
            setForm({ ...form, price: Number(e.target.value) })
          }
        />

        <Input
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={(e) =>
            setForm({ ...form, stock: Number(e.target.value) })
          }
        />

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
