import React, { useEffect, useState } from "react";
import type { InventoryProduct } from "../../../pages/03-Inventory/Inventory.interface";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { fetchProductDynamicFields } from "./ViewEditProducts.function";

interface Props {
  product: InventoryProduct | null;
}

const ViewEditProducts: React.FC<Props> = ({ product }) => {
  const [dynamicFields, setDynamicFields] = useState<any[]>([]);
  const [formValues, setFormValues] = useState<any>({});
  const [images, setImages] = useState<string[]>([]);

  if (!product) return <p>No product selected</p>;

  // ✅ LOAD DYNAMIC FIELDS
  useEffect(() => {
    const load = async () => {
      const data = await fetchProductDynamicFields();
      setDynamicFields(data);
    };
    load();
  }, []);

  // ✅ HANDLE INPUT CHANGE
  const handleChange = (key: string, value: any) => {
    setFormValues((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  };

  // ✅ IMAGE UPLOAD HANDLER (CAMERA + FILE)
  const handleImageUpload = (e: any) => {
    const files = Array.from(e.target.files) as File[];
    const previews = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...previews]);
  };

  // ✅ FALLBACK DISPLAY
  const show = (val: any) =>
    val === null || val === "" || val === undefined ? "-" : val;

  return (
    <div className="p-3">
      {/* ✅ TITLE */}
      <h3 className="text-xl font-semibold">
        {product.productName}{" "}
        <span className="text-gray-500 text-sm">({product.barcode})</span>
      </h3>

      {/* ✅ FULL PRODUCT DETAILS IN 3-COLUMN GRID */}
      <div className="mt-3 grid grid-cols-3 gap-4 text-sm bg-gray-50 rounded">
        <p>
          <b>Branch:</b> {show(product.refBranchName)}
        </p>
        <p>
          <b>Branch Code:</b> {show(product.refBranchCode)}
        </p>
        <p>
          <b>Supplier:</b> {show(product.supplierName)}
        </p>

        <p>
          <b>Category:</b> {show(product.categoryName)}
        </p>
        <p>
          <b>Sub Category:</b> {show(product.subCategoryName)}
        </p>
        <p>
          <b>Product ID:</b> {show(product.productId)}
        </p>

        <p>
          <b>Design:</b> {show(product.designName)}
        </p>
        <p>
          <b>Pattern:</b> {show(product.patternName)}
        </p>
        <p>
          <b>Variant:</b> {show(product.varientName)}
        </p>

        <p>
          <b>Color:</b> {show(product.colorName)}
        </p>
        <p>
          <b>Size:</b> {show(product.sizeName)}
        </p>
        <p>
          <b>GRN Number:</b> {show(product.grnNumber)}
        </p>

        <p>
          <b>Unit Cost:</b> ₹{show(product.unitCost)}
        </p>
        <p>
          <b>Total Amount:</b> ₹{show(product.totalAmount)}
        </p>
        <p>
          <b>Margin %:</b> {show(product.marginPercent)}
        </p>

        <p>
          <b>Discount %:</b> {show(product.discountPercent)}
        </p>
        <p>
          <b>Discount Amount:</b> ₹{show(product.discountAmount)}
        </p>

        <p>
          <b>Created By:</b> {show(product.createdBy)}
        </p>
        <p>
          <b>Created At:</b> {show(product.createdAt)}
        </p>
      </div>

      {/* ✅ DYNAMIC FORM SECTION */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        {dynamicFields.map((field) => {
          if (field.data_type === "TEXT") {
            return (
              <div key={field.id}>
                <label className="block mb-1 font-semibold">
                  {field.column_label}
                </label>
                <InputText
                  className="w-full"
                  value={formValues[field.column_name] || ""}
                  onChange={(e) =>
                    handleChange(field.column_name, e.target.value)
                  }
                />
              </div>
            );
          }

          if (field.data_type === "TEXTAREA") {
            return (
              <div key={field.id} className="col-span-2">
                <label className="block mb-1 font-semibold">
                  {field.column_label}
                </label>
                <InputTextarea
                  rows={4}
                  className="w-full"
                  value={formValues[field.column_name] || ""}
                  onChange={(e) =>
                    handleChange(field.column_name, e.target.value)
                  }
                />
              </div>
            );
          }

          if (field.data_type === "IMAGE") {
            return (
              <div key={field.id} className="col-span-2">
                <label className="block mb-1 font-semibold">
                  {field.column_label}
                </label>

                {/* ✅ CAMERA + UPLOAD */}
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  multiple
                  onChange={handleImageUpload}
                />

                {/* ✅ IMAGE GRID PREVIEW */}
                <div className="grid grid-cols-4 gap-3 mt-3">
                  {images.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt="preview"
                      className="rounded border"
                      style={{
                        width: "200px",
                        height: "200px",
                        objectFit: "cover",
                      }}
                    />
                  ))}
                </div>
              </div>
            );
          }

          return null;
        })}
      </div>

      {/* ✅ ACTION BUTTONS */}
      <div className="flex gap-3 justify-end mt-5">
        <Button label="Cancel" className="p-button-secondary" />
        <Button label="Update Product" className="p-button-success" />
      </div>
    </div>
  );
};

export default ViewEditProducts;
