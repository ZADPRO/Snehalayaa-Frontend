import React, { useEffect, useState } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";

import Papa from "papaparse";

import { fetchShopifyProducts } from "../../../pages/06-Shopify/Shopify.function";

const ShopifyInward: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [showDialog, setShowDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);

  // ✅ LOAD DATA WITH BULK FIX
  const loadData = async () => {
    try {
      setLoading(true);
      const response = await fetchShopifyProducts();

      // ✅ ✅ ✅ THIS IS THE MAIN BULK FIX
      const productArray = Array.isArray(response)
        ? response
        : response?.data || [];

      setProducts(productArray);
    } catch (err) {
      console.error("Error fetching Shopify products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ✅ HANDLE GENERATOR
  const generateHandle = (name: string) =>
    name?.toLowerCase().replace(/\s+/g, "-");

  // ✅ SAFE SHOPIFY CSV MAPPER (NO BLANK EXPORT)
  const mapToShopifyCSV = (row: any) => ({
    Handle: generateHandle(row.productName || "product"),
    Title: row.productName || "",
    "Body (HTML)": `<p>${row.productName || ""}</p>`,
    Vendor: "Snehalayaa",

    "Product Category": row.categoryName || "",
    Type: row.subCategoryName || "",

    Tags: [row.categoryName, row.subCategoryName].filter(Boolean).join(", "),

    Published: "TRUE",

    "Option1 Name": "Title",
    "Option1 Value": "Default",

    "Variant SKU": row.barcode || "",
    "Variant Inventory Tracker": "shopify",
    "Variant Inventory Qty": row.quantity || 0,

    "Variant Inventory Policy": "deny",
    "Variant Fulfillment Service": "manual",

    "Variant Price": row.totalAmount || 0,
    "Variant Compare At Price": row.totalAmount || 0,

    "Variant Requires Shipping": "TRUE",
    "Variant Taxable": "TRUE",

    "Variant Barcode": row.barcode || "",

    // ✅ Safe image fallback
    "Image Src": row.productImage || row.image || row.images?.[0]?.src || "",

    Status: "active",
  });

  // ✅ BULK + SINGLE CSV DOWNLOAD (FIXED)
  const downloadShopifyCSV = (data: any[]) => {
    if (!Array.isArray(data) || data.length === 0) {
      alert("No products available for download.");
      return;
    }

    const formatted = data.map(mapToShopifyCSV);

    const csv = Papa.unparse(formatted, {
      header: true,
      skipEmptyLines: true,
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "shopify_bulk_products.csv");

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-3">
      {/* ✅ BULK DOWNLOAD BUTTON */}
      <Button
        label="Download Shopify Bulk CSV"
        icon="pi pi-download"
        className="mb-3"
        onClick={() => downloadShopifyCSV(products)}
      />

      {/* ✅ SHOPIFY PRODUCTS TABLE */}
      <DataTable
        value={products}
        loading={loading}
        paginator
        rows={10}
        showGridlines
        className="shadow bg-white"
      >
        <Column header="S.No" body={(_, { rowIndex }) => rowIndex + 1} />
        <Column field="productName" header="Product Name" />

        {/* ✅ CLICKABLE SKU */}
        <Column
          header="Barcode / SKU"
          body={(row) => (
            <span
              onClick={() => {
                setSelectedRow(row);
                setShowDialog(true);
              }}
              style={{
                color: "blue",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              {row.barcode}
            </span>
          )}
        />

        <Column field="categoryName" header="Category" />
        <Column field="subCategoryName" header="Sub Category" />
        <Column field="designName" header="Design" />
        <Column field="patternName" header="Pattern" />
        <Column field="colorName" header="Color" />
        <Column field="sizeName" header="Size" />
        <Column field="varientName" header="Variant" />
        <Column field="unitCost" header="Cost" />
        <Column field="marginPercent" header="Margin %" />
        <Column field="totalAmount" header="Total Amount" />
        <Column field="quantity" header="Stock Qty" />

        <Column
          header="Branch"
          body={(row) => `${row.refBranchName} (${row.refBranchCode})`}
        />

        <Column field="grnNumber" header="GRN Number" />
        <Column field="createdAt" header="Created At" />
      </DataTable>

      {/* ✅ SINGLE PRODUCT CSV PREVIEW DIALOG */}
      <Dialog
        header="Shopify Product CSV Preview"
        visible={showDialog}
        style={{ width: "90vw" }}
        modal
        onHide={() => setShowDialog(false)}
      >
        {selectedRow && (
          <div className="grid p-3">
            <div className="col-4">
              <label>Handle</label>
              <InputText
                value={generateHandle(selectedRow.productName)}
                disabled
                className="w-full"
              />
            </div>

            <div className="col-4">
              <label>Title</label>
              <InputText value={selectedRow.productName} className="w-full" />
            </div>

            <div className="col-4">
              <label>Vendor</label>
              <InputText value="Snehalayaa" className="w-full" />
            </div>

            <div className="col-12">
              <label>Body (HTML)</label>
              <InputTextarea
                rows={3}
                value={`<p>${selectedRow.productName}</p>`}
                className="w-full"
              />
            </div>

            <div className="col-4">
              <label>Variant SKU</label>
              <InputText value={selectedRow.barcode} className="w-full" />
            </div>

            <div className="col-4">
              <label>Variant Price</label>
              <InputText value={selectedRow.totalAmount} className="w-full" />
            </div>

            <div className="col-4">
              <label>Inventory Qty</label>
              <InputText value={selectedRow.quantity} className="w-full" />
            </div>

            <div className="col-12 mt-3">
              <Button
                label="Download This Product CSV"
                icon="pi pi-download"
                onClick={() => downloadShopifyCSV([selectedRow])}
              />
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default ShopifyInward;
