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
} from "./ProductStockIntake.function";

const ProductStockIntake: React.FC = () => {
  const toast = useRef<Toast>(null);
  const scannerRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [stockTransfers, setStockTransfers] = useState<any[]>([]);

  // Sidebar states
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [selectedTransferId, setSelectedTransferId] = useState<number | null>(
    null
  );
  console.log("selectedTransferId", selectedTransferId);
  const [transferItems, setTransferItems] = useState<any[]>([]);

  // Fetch master list
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

  // Fetch items for a transfer
  const openTransferItems = async (id: number) => {
    setSelectedTransferId(id);
    setSidebarVisible(true);

    try {
      const items = await fetchStockTransferItems(id);

      // Each item gets a status field for UI
      const formatted = items.map((item: any) => ({
        ...item,
        status: "Pending", // Default
      }));

      setTransferItems(formatted);

      // Focus scanner input
      setTimeout(() => {
        scannerRef.current?.focus();
      }, 200);
    } catch (err: any) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: err.message,
      });
    }
  };

  // Scan -> update status
  const handleScan = (e: any) => {
    if (e.key === "Enter") {
      const sku = e.target.value.trim();
      e.target.value = "";

      // Update UI
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

  // Accept All button
  const acceptAll = () => {
    setTransferItems((prev) =>
      prev.map((item) => ({
        ...item,
        status: "Accepted",
      }))
    );

    toast.current?.show({
      severity: "success",
      summary: "All Accepted",
      detail: "All items marked as Accepted",
    });
  };

  return (
    <div className="p-4">
      <Toast ref={toast} />

      <h2 className="text-xl font-semibold mb-4">Stock Intake List</h2>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <ProgressSpinner />
        </div>
      ) : (
        <DataTable value={stockTransfers} paginator rows={10} showGridlines>
          <Column
            header="S.No"
            body={(_, { rowIndex }) => rowIndex + 1}
            style={{ width: "70px" }}
          />
          <Column field="stockTransferNumber" header="ST Number" />
          <Column
            header="From Branch"
            body={(row) => (
              <span>
                {row.from_branch_name} ({row.from_branch_code})
              </span>
            )}
          />
          <Column
            header="To Branch"
            body={(row) => (
              <span>
                {row.to_branch_name} ({row.to_branch_code})
              </span>
            )}
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
                onClick={() => openTransferItems(row.id)}
              />
            )}
          />
        </DataTable>
      )}

      {/* 📌 SIDEBAR */}
      <Sidebar
        visible={sidebarVisible}
        position="right"
        onHide={() => setSidebarVisible(false)}
        style={{ width: "50vw" }}
        header="Stock Intake Items"
      >
        {/* Hidden scanner input */}
        <input
          ref={scannerRef}
          type="text"
          onKeyDown={handleScan}
          style={{ opacity: 0, height: 1, width: 1, position: "absolute" }}
        />

        <Button
          label="Accept All"
          className="p-button-success mb-3"
          onClick={acceptAll}
        />

        <DataTable value={transferItems} showGridlines>
          <Column field="sku" header="SKU" />
          <Column field="productName" header="Product Name" />
          <Column
            field="status"
            header="Status"
            body={(row) => (
              <span
                className={
                  row.status === "Accepted" ? "text-green-600" : "text-red-600"
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
