import React, { useState } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FileUpload } from "primereact/fileupload";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";

import * as XLSX from "xlsx";
import Papa from "papaparse";
import { createShopifyProduct } from "./ShopifyProducts.function";

const REQUIRED_FIELDS = [
  "Handle",
  "Title",
  "Vendor",
  "Variant SKU",
  "Variant Price",
  "Variant Inventory Qty",
  "Image Src",
  "Status",
];

const ShopifyProducts: React.FC = () => {
  const [tableData, setTableData] = useState<any[]>([]);
  const [imageCountByHandle, setImageCountByHandle] = useState<
    Record<string, number>
  >({});
  const [loadingRow, setLoadingRow] = useState<string | null>(null);

  // ✅ FILE UPLOAD
  const handleFileUpload = async (event: any) => {
    const file = event.files[0];
    if (!file) return;

    const reader = new FileReader();

    if (file.name.endsWith(".csv")) {
      reader.onload = (e: any) => {
        const csv = e.target.result;
        const parsed = Papa.parse(csv, { header: true });
        processData(parsed.data);
      };
      reader.readAsText(file);
    } else {
      reader.onload = (e: any) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet);
        processData(json);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  // ✅ PROCESS DATA
  const processData = (data: any[]) => {
    const imageMap: Record<string, number> = {};
    data.forEach((row) => {
      if (row.Handle && row["Image Src"]) {
        imageMap[row.Handle] = (imageMap[row.Handle] || 0) + 1;
      }
    });
    setImageCountByHandle(imageMap);
    setTableData(data);
  };

  const getCellClass = (row: any, field: string) => {
    if (REQUIRED_FIELDS.includes(field)) {
      return row[field] ? "" : "invalid-cell";
    }
    return "";
  };

  const imageValidationBody = (row: any) => {
    const count = imageCountByHandle[row.Handle] || 0;
    return (
      <Tag
        value={`${count} Images`}
        severity={count < 4 ? "danger" : "success"}
      />
    );
  };

  // ✅ BUILD SHOPIFY PAYLOAD
  const buildShopifyPayload = (row: any) => {
    const allImages = tableData
      .filter((item) => item.Handle === row.Handle && item["Image Src"])
      .map((item) => ({ Src: item["Image Src"] }));

    return {
      Title: row.Title,
      BodyHTML: row["Body (HTML)"] || `<strong>${row.Title}</strong>`,
      Vendor: row.Vendor,
      ProductType: row.Type || row["Product Category"] || "",
      Tags: row.Tags || "",
      Variants: [
        {
          Option1: "Default",
          Price: String(row["Variant Price"]),
          SKU: row["Variant SKU"],
          InventoryPolicy: "deny",
          InventoryManagement: "shopify",
          InventoryQuantity: Number(row["Variant Inventory Qty"]),
        },
      ],
      Images: allImages,
    };
  };

  // ✅ ✅ ✅ API CONNECTED UPDATE HANDLER
  const handleUpdate = async (row: any) => {
    try {
      setLoadingRow(row.Handle);

      const payload = buildShopifyPayload(row);
      console.log("✅ Sending Payload:", payload);

      const response = await createShopifyProduct(payload);

      console.log("✅ Shopify API Response:", response);

      alert(`✅ Shopify Product Created Successfully: ${row.Title}`);
    } catch (error: any) {
      console.error("❌ Shopify Upload Failed:", error);
      alert(
        error?.response?.data?.message ||
          "❌ Failed to upload product to Shopify"
      );
    } finally {
      setLoadingRow(null);
    }
  };

  return (
    <div className="p-3">
      <h3>Shopify Product Excel Upload & Validation</h3>

      <FileUpload
        mode="basic"
        accept=".xlsx,.csv"
        chooseLabel="Upload Shopify Excel"
        customUpload
        uploadHandler={handleFileUpload}
        className="mb-4"
      />

      <DataTable
        value={tableData}
        showGridlines
        className="shadow bg-white"
        emptyMessage="Upload a Shopify Excel file to preview"
      >
        {REQUIRED_FIELDS.map((field) => (
          <Column
            key={field}
            field={field}
            header={field}
            body={(row) => row[field]}
            bodyClassName={(row) => getCellClass(row, field)}
          />
        ))}

        <Column header="Image Validation" body={imageValidationBody} />

        <Column
          header="Action"
          body={(row) => (
            <Button
              label={loadingRow === row.Handle ? "Uploading..." : "Update"}
              icon="pi pi-upload"
              className="p-button-success p-button-sm"
              onClick={() => handleUpdate(row)}
              loading={loadingRow === row.Handle}
              disabled={
                REQUIRED_FIELDS.some((field) => !row[field]) ||
                (imageCountByHandle[row.Handle] || 0) < 4
              }
            />
          )}
        />
      </DataTable>

      <style>
        {`
          .invalid-cell {
            background-color: #ffcccc !important;
            color: #900;
            font-weight: bold;
          }
        `}
      </style>
    </div>
  );
};

export default ShopifyProducts;
