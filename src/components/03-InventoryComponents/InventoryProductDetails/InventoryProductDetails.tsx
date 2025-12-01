import React from "react";
import type { InventoryProduct } from "../../../pages/03-Inventory/Inventory.interface";

interface Props {
  product: InventoryProduct | null;
}

const InventoryProductDetails: React.FC<Props> = ({ product }) => {
  if (!product) return <p>No product selected</p>;

  return (
    <div className="p-3 space-y-3">
      <h3 className="text-lg font-semibold mb-3">
        {product.productName}{" "}
        <span className="text-gray-500">({product.barcode})</span>
      </h3>

      <div className="grid grid-cols-2 gap-3">
        <p>
          <b>Barcode:</b> {product.barcode}
        </p>
        <p>
          <b>GRN Number:</b> {product.grnNumber}
        </p>

        <p>
          <b>Category:</b> {product.categoryName}
        </p>
        <p>
          <b>Sub Category:</b> {product.subCategoryName}
        </p>

        <p>
          <b>Design:</b> {product.designName || "-"}
        </p>
        <p>
          <b>Pattern:</b> {product.patternName || "-"}
        </p>

        <p>
          <b>Variant:</b> {product.varientName || "-"}
        </p>
        <p>
          <b>Color:</b> {product.colorName || "-"}
        </p>

        <p>
          <b>Size:</b> {product.sizeName || "-"}
        </p>

        <p>
          <b>Supplier:</b> {product.supplierName}
        </p>
        <p>
          <b>Branch:</b> {product.refBranchName}
        </p>

        <p>
          <b>Unit Cost:</b> ₹{product.unitCost}
        </p>
        <p>
          <b>Total Amount:</b> ₹{product.totalAmount}
        </p>

        <p>
          <b>Margin %:</b> {product.marginPercent}%
        </p>
        <p>
          <b>Discount %:</b> {product.discountPercent || "-"}
        </p>

        <p>
          <b>Created At:</b> {product.createdAt}
        </p>
        <p>
          <b>Created By:</b> {product.createdBy}
        </p>
      </div>

      {/* Image Section */}
      <div className="mt-4">
        <p className="font-semibold mb-2">Product Image:</p>
        {product.productImage ? (
          <img
            src={`YOUR_CDN_URL/${product.productImage}`}
            alt="Product"
            className="w-48 h-48 rounded shadow object-cover"
          />
        ) : (
          <p className="text-gray-500 italic">No image available</p>
        )}
      </div>
    </div>
  );
};

export default InventoryProductDetails;
