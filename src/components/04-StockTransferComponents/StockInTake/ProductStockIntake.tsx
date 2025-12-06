import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { ProgressSpinner } from "primereact/progressspinner";
import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";

import {
  fetchStockIntakeList,
  fetchStockTransferItems,
  acceptStockIntake, // <-- NEW API FUNCTION
} from "./ProductStockIntake.function";

const ProductStockIntake: React.FC = () => {
  const toast = useRef<Toast>(null);
  const scannerRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [stockTransfers, setStockTransfers] = useState<any[]>([]);

  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState<any>(null);
  const [transferItems, setTransferItems] = useState<any[]>([]);

  const [selectedRows, setSelectedRows] = useState<any[]>([]);

  useEffect(() => {
    loadStockIntake();
  }, []);

  const loadStockIntake = async () => {
    try {
      setLoading(true);
      const data = await fetchStockIntakeList();
      setStockTransfers(data);
    } catch (err: any) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // ----------- OPEN SUB LIST (SIDEBAR) -----------
  const openTransferItems = async (rowData: any) => {
    setSelectedTransfer(rowData);
    setSidebarVisible(true);
    setSelectedRows([]);

    try {
      const items = await fetchStockTransferItems(rowData.id);
      setTransferItems(
        items.map((item: any) => ({
          ...item,
          status: "Pending",
        }))
      );

      setTimeout(() => scannerRef.current?.focus(), 300);
    } catch (err: any) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: err.message,
      });
    }
  };

  // ----------- SCAN INPUT -----------
  const handleScan = (e: any) => {
    if (e.key === "Enter") {
      const sku = e.target.value.trim();
      e.target.value = "";

      setTransferItems((prev) =>
        prev.map((item) =>
          item.sku === sku ? { ...item, status: "Accepted" } : item
        )
      );

      toast.current?.show({
        severity: "success",
        summary: "Accepted",
        detail: `SKU ${sku} marked as Accepted`,
      });
    }
  };

  // ----------- ACCEPT ALL -----------
  const acceptAll = async () => {
    if (!selectedTransfer) return;

    const payload = {
      toBranchId: selectedTransfer.to_branch_id, // ⭐ dynamic branch
      items: transferItems.map((item) => ({ sku: item.sku })),
    };

    try {
      const res = await acceptStockIntake(payload);
      console.log("res", res);

      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: `All items accepted`,
      });

      setTransferItems((prev) =>
        prev.map((item) => ({ ...item, status: "Accepted" }))
      );
    } catch (err: any) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: err.message,
      });
    }
  };

  // ----------- ACCEPT SELECTED -----------
  const acceptSelected = async () => {
    if (!selectedRows.length) {
      toast.current?.show({
        severity: "warn",
        summary: "No Selection",
        detail: "Select items first",
      });
      return;
    }

    const payload = {
      toBranchId: selectedTransfer.to_branch_id, // ⭐ dynamic branch
      items: selectedRows.map((item) => ({ sku: item.sku })),
    };

    try {
      const res = await acceptStockIntake(payload);
      console.log("res", res);

      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: `Items accepted`,
      });

      setTransferItems((prev) =>
        prev.map((item) =>
          selectedRows.some((sel) => sel.sku === item.sku)
            ? { ...item, status: "Accepted" }
            : item
        )
      );
    } catch (err: any) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: err.message,
      });
    }
  };

  return (
    <div>
      <Toast ref={toast} />

      {/* MAIN LIST */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <ProgressSpinner />
        </div>
      ) : (
        <DataTable value={stockTransfers} paginator rows={10} showGridlines>
          <Column header="S.No" body={(_, { rowIndex }) => rowIndex + 1} />
          <Column field="stockTransferNumber" header="ST Number" />
          <Column
            header="From Branch"
            body={(row) => `${row.from_branch_name} (${row.from_branch_code})`}
          />
          <Column
            header="To Branch"
            body={(row) => `${row.to_branch_name} (${row.to_branch_code})`}
          />
          <Column field="created_at" header="Created At" />
          <Column field="item_count" header="Items" />
          <Column
            header="View"
            body={(row) => (
              <Button
                label="View Items"
                size="small"
                className="p-button-info"
                onClick={() => openTransferItems(row)}
              />
            )}
          />
        </DataTable>
      )}

      {/* SIDEBAR */}
      <Sidebar
        visible={sidebarVisible}
        position="right"
        onHide={() => setSidebarVisible(false)}
        style={{ width: "70vw" }}
        header="Stock Intake Items"
      >
        <input
          ref={scannerRef}
          type="text"
          onKeyDown={handleScan}
          style={{ opacity: 0, height: 1, width: 1, position: "absolute" }}
        />

        <div className="flex gap-3 mb-3">
          <Button
            label="Accept All"
            className="p-button-success"
            onClick={acceptAll}
          />
          <Button
            label="Accept Selected"
            className="p-button-warning"
            onClick={acceptSelected}
          />
        </div>

        <DataTable
          value={transferItems}
          showGridlines
          selection={selectedRows}
          onSelectionChange={(e) => setSelectedRows(e.value)}
          dataKey="sku"
        >
          <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
          <Column header="S.No" body={(_, { rowIndex }) => rowIndex + 1} />
          <Column field="sku" header="SKU" />
          <Column field="productName" header="Product Name" />
          <Column
            field="status"
            header="Status"
            body={(row) => (
              <span
                className={
                  row.status === "Accepted"
                    ? "text-green-600 font-semibold"
                    : "text-red-600 font-semibold"
                }
              >
                {row.status}
              </span>
            )}
          />
        </DataTable>
      </Sidebar>
    </div>
  );
};

export default ProductStockIntake;
