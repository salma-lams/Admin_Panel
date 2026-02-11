import { useState } from "react";

type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
};

const Products = () => {
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: "Laptop", price: 900, stock: 12 },
    { id: 2, name: "Phone", price: 500, stock: 20 },
  ]);

  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
  });

  // Add
  const handleAdd = () => {
    const newProduct: Product = {
      id: Date.now(),
      name: form.name,
      price: Number(form.price),
      stock: Number(form.stock),
    };

    setProducts([...products, newProduct]);

    setForm({ name: "", price: "", stock: "" });
    setShowModal(false);
  };

  // Delete
  const handleDelete = (id: number) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Products</h1>

        <button
          onClick={() => setShowModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          + Add Product
        </button>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-xl p-6">
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="py-3">Name</th>
              <th>Price ($)</th>
              <th>Stock</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b hover:bg-gray-50">
                <td className="py-3">{product.name}</td>
                <td>${product.price}</td>
                <td>{product.stock}</td>

                <td>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-80 space-y-4">
            <h2 className="font-semibold">Add Product</h2>

            <input
              className="w-full border p-2 rounded"
              placeholder="Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <input
              type="number"
              className="w-full border p-2 rounded"
              placeholder="Price"
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: e.target.value })
              }
            />

            <input
              type="number"
              className="w-full border p-2 rounded"
              placeholder="Stock"
              value={form.stock}
              onChange={(e) =>
                setForm({ ...form, stock: e.target.value })
              }
            />

            <div className="flex justify-end gap-2">
              <button onClick={() => setShowModal(false)}>Cancel</button>

              <button
                onClick={handleAdd}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
