"use client";

import { useEffect, useState } from "react";
import type { Product } from "../../features/products/product.types";
import {
  createProduct,
  deleteProduct as deleteProductApi,
  getProducts,
  updateProduct,
} from "../../features/products/product.api";

import ProductTable from "../../features/products/ProductTable";
import ProductModal from "../../features/products/ProductModal";

import ConfirmDialog from "../../components/common/ConfirmDialog";
import Loader from "../../components/common/Loader";
import Pagination from "../../components/common/Pagination";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

import useDebounce from "../../hooks/useDebounce";

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState("");

  const itemsPerPage = 5;
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    getProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    }).catch((err: unknown) => {
      setError(err instanceof Error ? err.message : "Failed to load products");
      setLoading(false);
    });
  }, []);

  const handleSave = async (product: Product) => {
    try {
      if (editingProduct) {
        const updated = await updateProduct(product.id, product);
        setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      } else {
        const created = await createProduct(product);
        setProducts((prev) => [...prev, created]);
      }
      setError("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save product");
    }
  };

  const confirmDelete = async () => {
    if (selectedId !== null) {
      try {
        await deleteProductApi(selectedId);
        setProducts((prev) => prev.filter((p) => p.id !== selectedId));
        setSelectedId(null);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to delete product");
      }
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) return <Loader />;

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Product Management
            </h1>
            <p className="text-gray-500 mt-1">
              Manage inventory, stock and pricing
            </p>
          </div>

          <Button
            onClick={() => {
              setEditingProduct(null);
              setIsModalOpen(true);
            }}
          >
            + New Product
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition">
            <p className="text-sm text-gray-500">Total Products</p>
            <p className="text-3xl font-bold text-indigo-600 mt-2">
              {products.length}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition">
            <p className="text-sm text-gray-500">In Stock</p>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {products.filter(p => p.stock > 0).length}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition">
            <p className="text-sm text-gray-500">Out of Stock</p>
            <p className="text-3xl font-bold text-red-500 mt-2">
              {products.filter(p => p.stock === 0).length}
            </p>
          </div>

        </div>

        {/* Search + Table Card */}
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          {error ? (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <div className="flex justify-between items-center mb-4">
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="max-w-sm"
            />
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              No products found.
            </div>
          ) : (
            <>
              <div className="overflow-hidden rounded-xl border border-gray-200">
                <ProductTable
                  products={paginated}
                  onEdit={(p) => {
                    setEditingProduct(p);
                    setIsModalOpen(true);
                  }}
                  onDelete={(id) => setSelectedId(id)}
                />
              </div>

              <div className="mt-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            </>
          )}

        </div>

      </div>

      {/* Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSave}
        initialData={editingProduct}
      />

      {/* Confirm */}
      <ConfirmDialog
        isOpen={selectedId !== null}
        onClose={() => setSelectedId(null)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this product?"
      />
    </div>
  );
};

export default Products;
