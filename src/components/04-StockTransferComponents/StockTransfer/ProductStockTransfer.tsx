import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Trash2 } from "lucide-react";
import { Dialog } from "primereact/dialog";

import { fetchBranch } from "../../08-PurchaseOrderComponents/PurchaseOrderCreate/PurchaseOrderCreate.function";
import { checkSKUInGRN } from "./StockTransfer.function";
import type { Branch } from "../../08-PurchaseOrderComponents/PurchaseOrderCreate/PurchaseOrderCreate.interface";

const ProductStockTransfer: React.FC = () => {
  const toast = useRef<Toast>(null);
  const scannerRef = useRef<HTMLInputElement>(null);

  const [branches, setBranches] = useState<Branch[]>([]);
  const [fromBranch, setFromBranch] = useState<number | null>(null);
  const [toBranch, setToBranch] = useState<number | null>(null);

  const [manualSKU, setManualSKU] = useState("");
  const [products, setProducts] = useState<any[]>([]);

  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [pendingProduct, setPendingProduct] = useState<any>(null);
  const [foundInBranchName, setFoundInBranchName] = useState("");

  // Load branch list
  useEffect(() => {
    fetchBranch().then((res) => setBranches(res));
  }, []);

  // Auto focus scanner input
  useEffect(() => {
    scannerRef.current?.focus();
  }, [products]);

  // To Branch should not show selected From Branch
  const filteredToBranches = branches.filter(
    (b) => b.refBranchId !== fromBranch
  );

  // Add product to table
  const addProduct = (product: any) => {
    setProducts((prev) => [...prev, product]);

    toast.current?.show({
      severity: "success",
      summary: "Product Added",
      detail: product.sku,
    });
  };

  // Fetch SKU → Add product
  const addProductBySKU = async (sku: string) => {
    if (!sku || !fromBranch) {
      toast.current?.show({
        severity: "warn",
        summary: "Missing Info",
        detail: "Select a branch & enter SKU",
      });
      return;
    }

    try {
      const res = await checkSKUInGRN(fromBranch, sku);

      if (!res.status) {
        toast.current?.show({
          severity: "warn",
          summary: "Not Found",
          detail: res.message,
        });
        return;
      }

      // Duplicate check
      if (products.some((p) => p.sku === res.data.sku)) {
        toast.current?.show({
          severity: "warn",
          summary: "Duplicate SKU",
          detail: res.data.sku,
        });
        return;
      }

      // Found in same branch
      if (res.isPresent) {
        addProduct(res.data);
        return;
      }

      // Found in another branch → require confirmation
      setPendingProduct(res.data);
      setFoundInBranchName(res.branchName);
      setConfirmDialogVisible(true);
    } catch (err) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Something went wrong",
      });
    }
  };

  const handleScan = (e: any) => {
    if (e.key === "Enter") {
      const sku = e.target.value.trim();
      addProductBySKU(sku);
      e.target.value = "";
    }
  };

  const handleManualEnter = (e: any) => {
    if (e.key === "Enter") {
      addProductBySKU(manualSKU);
      setManualSKU("");
    }
  };

  const deleteRow = (sku: string) => {
    setProducts((prev) => prev.filter((p) => p.sku !== sku));
  };

  return (
    <div className="flex gap-4">
      <Toast ref={toast} />

      {/* Hidden Scanner Input */}
      <input
        ref={scannerRef}
        type="text"
        onKeyDown={handleScan}
        style={{ position: "absolute", opacity: 0, height: 0, width: 0 }}
      />

      {/* LEFT SIDE (80%) */}
      <div className="flex-[4]">
        <div className="flex gap-3 mb-3">
          <Dropdown
            className="flex-1"
            placeholder="From Branch"
            options={branches}
            optionLabel="refBranchName"
            optionValue="refBranchId"
            value={fromBranch}
            onChange={(e) => setFromBranch(e.value)}
          />

          <Dropdown
            className="flex-1"
            placeholder="To Branch"
            options={filteredToBranches}
            optionLabel="refBranchName"
            optionValue="refBranchId"
            value={toBranch}
            onChange={(e) => setToBranch(e.value)}
          />

          <InputText className="flex-1" placeholder="Mode of Transport" />

          <InputText
            className="flex-1"
            placeholder="Enter SKU manually"
            value={manualSKU}
            onKeyDown={handleManualEnter}
            onChange={(e) => setManualSKU(e.target.value)}
          />

          <Button label="Add" onClick={() => addProductBySKU(manualSKU)} />
        </div>

        <DataTable value={products} showGridlines>
          <Column header="S.No" body={(_, { rowIndex }) => rowIndex + 1} />
          <Column field="productName" header="Product Name" />
          <Column field="total" header="Price" />
          <Column field="sku" header="SKU" />
          <Column field="quantity" header="Qty" />
          <Column field="hsnCode" header="HSN" />

          <Column
            header="Delete"
            body={(row) => (
              <Button
                icon={<Trash2 size={12} />}
                className="p-button-danger"
                text
                onClick={() => deleteRow(row.sku)}
              />
            )}
          />
        </DataTable>
      </div>

      {/* RIGHT SIDE (20%) */}
      <div className="flex-[1]">
        <div className="bg-white flex gap-3 p-4 rounded-md shadow mb-3">
          <Button label="Transfer" className="flex-1" />
          <Button label="Download" className="flex-1" />
        </div>
        <div className="bg-white p-4 rounded-md shadow text-sm">
          <h4 className="font-semibold mb-3">Summary</h4>

          <div className="flex justify-between">
            <span>Total Products</span>
            <span>{products.length}</span>
          </div>

          <div className="flex justify-between">
            <span>Total Value</span>
            <span>
              ₹
              {products
                .reduce((s, p) => s + Number(p.total ?? 0), 0)
                .toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* CONFIRMATION DIALOG */}
      <Dialog
        header="Product Found in Different Branch"
        visible={confirmDialogVisible}
        onHide={() => setConfirmDialogVisible(false)}
        style={{ width: "400px" }}
        modal
      >
        <p>
          This product is <b>not available in the selected From Branch</b>.
        </p>
        <p>
          It exists in: <b>{foundInBranchName}</b>
        </p>
        <p>Do you want to add it anyway?</p>

        <div className="flex justify-end gap-3 mt-4">
          <Button
            label="Cancel"
            className="p-button-secondary"
            onClick={() => setConfirmDialogVisible(false)}
          />

          <Button
            label="Proceed"
            className="p-button-danger"
            onClick={() => {
              addProduct(pendingProduct);
              setConfirmDialogVisible(false);
              setPendingProduct(null);
            }}
          />
        </div>
      </Dialog>
    </div>
  );
};

export default ProductStockTransfer;
