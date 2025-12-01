import React, { useState } from "react";
import type { InventoryProduct } from "../../../pages/03-Inventory/Inventory.interface";
import { Dialog } from "primereact/dialog";

interface Props {
  product: InventoryProduct | null;
}

const InventoryProductDetails: React.FC<Props> = ({ product }) => {
  const [fullscreenVisible, setFullscreenVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!product) return <p>No product selected</p>;

  return (
    <div className="p-3 space-y-3">
      <h3 className="text-lg font-semibold mb-3">
        {product.productName}{" "}
        <span className="text-gray-500">({product.barcode})</span>
      </h3>

      {/* ==== PRODUCT INFO ==== */}
      <div className="grid grid-cols-2 gap-3 text-sm">
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

      {/* ==== IMAGE GALLERY ==== */}
      <div className="mt-4">
        <p className="font-semibold mb-2">Product Images:</p>

        {product.images && product.images.length > 0 ? (
          <div className="grid grid-cols-5 gap-3">
            {product.images.map((img, index) => (
              <img
                key={index}
                src={img.viewURL}
                alt="Product"
                className="w-full h-28 object-cover rounded cursor-pointer shadow-md hover:scale-105 transition"
                onClick={() => {
                  setSelectedImage(img.viewURL);
                  setFullscreenVisible(true);
                }}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">No images available</p>
        )}
      </div>

      <Dialog
        visible={fullscreenVisible}
        onHide={() => setFullscreenVisible(false)}
        header="Image Preview"
        maximizable
        modal
        style={{ width: "80vw" }}
      >
        {selectedImage && (
          <img
            src={selectedImage}
            className="w-full h-auto rounded shadow-lg"
            alt="Preview"
          />
        )}
      </Dialog>
    </div>
  );
};

export default InventoryProductDetails;
