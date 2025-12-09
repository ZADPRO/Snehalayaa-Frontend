import React from "react";
import type { InventoryProduct } from "../../../pages/03-Inventory/Inventory.interface";

interface Props {
  product: InventoryProduct | null;
}

const ViewEditProducts: React.FC<Props> = ({ product }) => {
  if (!product) return <p>No product selected</p>;

  return (
    <div>
      <div className="p-3 space-y-3">
        <h3 className="text-lg font-semibold mb-3">
          {product.productName}{" "}
          <span className="text-gray-500">({product.barcode})</span>
        </h3>
      </div>
    </div>
  );
};

export default ViewEditProducts;
