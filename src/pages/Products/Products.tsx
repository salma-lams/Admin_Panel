import { useEffect, useState } from "react";
import type { Product } from "../../features/products/product.types";
import { getProducts } from "../../features/products/product.api";

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

  const itemsPerPage = 5;
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    getProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  const handleSave = (product: Product) => {
    setProducts((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) {
        return prev.map((p) =>
          p.id === product.id ? product : p
        );
      }
      return [...prev, product];
    });
  };

  const confirmDelete = () => {
    if (selectedId !== null) {
      setProducts((prev) =>
        prev.filter((p) => p.id !== selectedId)
      );
      setSelectedId(null);
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
  <div className="p-6 bg-gray-50 min-h-screen">
    {/* Page Card */}
    <div className="bg-white rounded-2xl shadow-sm p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Products
          </h1>
          <p className="text-sm text-gray-500">
            Manage your store products
          </p>
        </div>

        <Button
          onClick={() => {
            setEditingProduct(null);
            setIsModalOpen(true);
          }}
        >
          + Add Product
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-xl">
          <p className="text-sm text-gray-500">
            Total Products
          </p>
          <p className="text-xl font-bold text-blue-600">
            {products.length}
          </p>
        </div>

        <div className="bg-green-50 p-4 rounded-xl">
          <p className="text-sm text-gray-500">
            In Stock
          </p>
          <p className="text-xl font-bold text-green-600">
            {products.filter(p => p.stock > 0).length}
          </p>
        </div>

        <div className="bg-red-50 p-4 rounded-xl">
          <p className="text-sm text-gray-500">
            Out of Stock
          </p>
          <p className="text-xl font-bold text-red-600">
            {products.filter(p => p.stock === 0).length}
          </p>
        </div>
      </div>

      {/* Search */}
      <Input
        placeholder="Search products..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
        className="mb-4"
      />

      {/* Table */}
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

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
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
