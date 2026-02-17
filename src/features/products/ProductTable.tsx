import type { Product } from "./product.types";
import Button from "../../components/ui/Button";

interface Props {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}

const ProductTable = ({
  products,
  onEdit,
  onDelete,
}: Props) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <table className="w-full text-sm text-left">

        {/* Header */}
        <thead className="bg-gray-50 text-gray-700 uppercase text-xs tracking-wider">
          <tr>
            <th className="px-6 py-4 font-semibold">Name</th>
            <th className="px-6 py-4 font-semibold">Price</th>
            <th className="px-6 py-4 font-semibold">Stock</th>
            <th className="px-6 py-4 font-semibold text-right">
              Actions
            </th>
          </tr>
        </thead>

        {/* Body */}
        <tbody className="text-gray-700 divide-y divide-gray-100">
          {products.length === 0 ? (
            <tr>
              <td
                colSpan={4}
                className="px-6 py-10 text-center text-gray-400"
              >
                No products found.
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <tr
                key={product.id}
                className="hover:bg-gray-50 transition duration-200"
              >
                <td className="px-6 py-4 font-medium text-gray-800">
                  {product.name}
                </td>

                <td className="px-6 py-4">
                  ${product.price}
                </td>

                <td className="px-6 py-4">
                  {product.stock > 0 ? (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                      In Stock
                    </span>
                  ) : (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">
                      Out of Stock
                    </span>
                  )}
                </td>

                <td className="px-6 py-4 text-right space-x-2">
                  <Button
                    variant="edit"
                    onClick={() => onEdit(product)}
                  >
                    Edit
                  </Button>

                  <Button
                    variant="danger"
                    onClick={() => onDelete(product.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
