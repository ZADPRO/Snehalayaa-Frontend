import { Dropdown, type DropdownChangeEvent } from "primereact/dropdown";
import { FloatLabel } from "primereact/floatlabel";
import React, { useEffect, useRef, useState } from "react";
import type { PurchaseOrderListItem } from "../../08-PurchaseOrderComponents/PurchaseOrderList/PurchaseOrderList.interface";
import { fetchPurchaseOrderList } from "../../08-PurchaseOrderComponents/PurchaseOrderList/PurchaseOrderList.function";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import {
  checkSKUOnlyGRN,
  createDebitNote,
} from "../../04-StockTransferComponents/StockTransfer/StockTransfer.function";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";

const AddEditDebitNote: React.FC = () => {
  const toast = useRef<Toast | null>(null);

  const [poDetails, setPODetails] = useState<PurchaseOrderListItem[]>([]);

  const [manualSKU, setManualSKU] = useState("");
  const [selectedPOId, setSelectedPOId] = useState<number | null>(null);

  // ✅ Stores validated SKU rows
  const [skuRows, setSkuRows] = useState<any[]>([]);

  // ✅ Initial data load
  const load = async () => {
    try {
      const po = await fetchPurchaseOrderList();
      setPODetails(po || []);
    } catch (err: any) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: err?.message || "Failed to load data",
      });
    }
  };

  useEffect(() => {
    load();
  }, []);

  // ✅ PO Change
  const handlePOChange = (e: DropdownChangeEvent) => {
    const poId = e.value as number;
    setSelectedPOId(poId);
  };

  // ✅ SKU ENTER HANDLER
  const handleManualEnter = async (e: any) => {
    if (e.key === "Enter" && manualSKU.trim()) {
      try {
        const res = await checkSKUOnlyGRN(manualSKU.trim());

        if (!res?.isPresent) {
          toast.current?.show({
            severity: "warn",
            summary: "Not Found",
            detail: "SKU not found in GRN",
          });
          return;
        }

        // ✅ Prevent duplicate SKU
        const alreadyExists = skuRows.some((r) => r.sku === res.data.sku);

        if (alreadyExists) {
          toast.current?.show({
            severity: "warn",
            summary: "Duplicate",
            detail: "This SKU is already added",
          });
          setManualSKU("");
          return;
        }

        const row = {
          sku: res.data.sku,
          supplierId: res.data.supplierId,
          supplierName: res.data.supplierName,
          quantity: res.data.quantity,
          productId: res.data.productId,
          purchaseOrderId: res.data.purchaseOrderId,
        };

        setSkuRows((prev) => [...prev, row]);

        toast.current?.show({
          severity: "success",
          summary: "Added",
          detail: `SKU ${res.data.sku} added`,
        });

        setManualSKU("");
      } catch (err: any) {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: err?.message || "Failed to validate SKU",
        });
      }
    }
  };

  // ✅ DELETE ROW
  const deleteRow = (index: number) => {
    setSkuRows((prev) => prev.filter((_, i) => i !== index));
  };

  // ✅ FINAL PAYLOAD FOR BACKEND
  const buildDebitNotePayload = () => {
    return {
      poId: selectedPOId,
      items: skuRows.map((row) => ({
        sku: row.sku,
        productId: row.productId,
        purchaseOrderId: row.purchaseOrderId,
        supplierId: row.supplierId,
        quantity: row.quantity,
      })),
    };
  };

  const handleSubmit = async () => {
    if (!selectedPOId) {
      toast.current?.show({
        severity: "warn",
        summary: "Missing PO",
        detail: "Please select a PO Number",
      });
      return;
    }

    if (!skuRows.length) {
      toast.current?.show({
        severity: "warn",
        summary: "No Items",
        detail: "Please add at least one SKU",
      });
      return;
    }

    const payload = buildDebitNotePayload();

    try {
      const res = await createDebitNote(payload);

      toast.current?.show({
        severity: "success",
        summary: "Debit Note Created",
        detail: `Debit Note ID: ${res?.data?.debitNoteId}`,
      });

      // ✅ RESET FORM AFTER SUCCESS
      setSkuRows([]);
      setSelectedPOId(null);
    } catch (err: any) {
      toast.current?.show({
        severity: "error",
        summary: "Failed",
        detail: err?.message || "Debit Note creation failed",
      });
    }
  };

  return (
    <div className="p-3">
      <Toast ref={toast} />

      {/* ✅ PO + SKU INPUT */}
      <div className="flex mt-3 gap-3">
        <div className="flex-1">
          <FloatLabel className="always-float">
            <Dropdown
              optionLabel="po_number"
              className="w-full"
              options={poDetails}
              optionValue="id"
              onChange={handlePOChange}
              value={selectedPOId}
            />
            <label>PO Number</label>
          </FloatLabel>
        </div>

        <div className="flex-1">
          <FloatLabel className="always-float">
            <InputText
              className="w-full"
              placeholder="Enter SKU manually"
              value={manualSKU}
              onKeyDown={handleManualEnter}
              onChange={(e) => setManualSKU(e.target.value)}
            />
            <label>SKU Number</label>
          </FloatLabel>
        </div>
      </div>

      {/* ✅ SKU TABLE */}
      <DataTable
        value={skuRows}
        showGridlines
        stripedRows
        className="mt-4"
        emptyMessage="No SKUs Added"
      >
        <Column
          header="S.No"
          body={(_, options) => options.rowIndex + 1}
          style={{ width: "5rem" }}
        />
        <Column header="SKU Number" field="sku" />
        <Column header="Supplier" field="supplierName" />
        <Column header="Quantity" field="quantity" />

        <Column
          header="Action"
          body={(_, options) => (
            <button
              className="text-red-600 underline"
              onClick={() => deleteRow(options.rowIndex)}
            >
              Delete
            </button>
          )}
        />
      </DataTable>

      {/* ✅ SUBMIT BUTTON */}
      <div className="flex justify-end mt-4">
        <Button label="Submit Debit Note" onClick={handleSubmit} />
      </div>
    </div>
  );
};

export default AddEditDebitNote;
