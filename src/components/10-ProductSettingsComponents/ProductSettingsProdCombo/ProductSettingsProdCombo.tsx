import React, { useState, useRef, useEffect } from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Sidebar } from "primereact/sidebar";
import { Toolbar } from "primereact/toolbar";
import { Tooltip } from "primereact/tooltip";

import {
  FileSpreadsheet,
  FileText,
  Plus,
  Pencil,
  Trash2,
  FileSignature,
} from "lucide-react";

import AddEditSettingsProducts from "./AddEditSettingsProducts/AddEditSettingsProducts";
import { getProducts } from "./ProductSettingsProdCombo.function";

const ProductSettingsProdCombo: React.FC = () => {
  const dt = useRef<DataTable<any>>(null);
  const toast = useRef<Toast>(null);

  const [visibleRight, setVisibleRight] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [editRowData, setEditRowData] = useState<any | null>(null);
  const [tableData, setTableData] = useState<any[]>([]);

  const isSingleSelected = selectedRows.length === 1;
  const isAnySelected = selectedRows.length > 0;

  /** Left Toolbar */
  const leftToolbarTemplate = () => (
    <div className="flex gap-2">
      <Button
        icon={<Plus size={16} strokeWidth={2} />}
        severity="success"
        tooltip="Add Product"
        tooltipOptions={{ position: "left" }}
        onClick={() => {
          setEditRowData(null);
          setVisibleRight(true);
        }}
      />

      <Button
        icon={<Pencil size={16} strokeWidth={2} />}
        severity="info"
        tooltip="Edit Product"
        tooltipOptions={{ position: "left" }}
        disabled={!isSingleSelected}
        onClick={() => {
          setEditRowData(selectedRows[0]);
          setVisibleRight(true);
        }}
      />

      <Button
        icon={<Trash2 size={16} strokeWidth={2} />}
        severity="danger"
        tooltip="Delete Product"
        tooltipOptions={{ position: "left" }}
        disabled={!isAnySelected}
        onClick={() => {
          toast.current?.show({
            severity: "warn",
            summary: "Delete",
            detail: "Delete API not connected yet",
          });
        }}
      />
    </div>
  );

  /** Right Toolbar */
  const rightToolbarTemplate = () => (
    <div className="flex gap-2 items-center">
      <span className="font-medium pr-5">
        Total: {tableData.length} | Selected: {selectedRows.length}
      </span>

      <Button
        icon={<FileText size={16} />}
        severity="secondary"
        tooltip="Export CSV"
      />
      <Button
        icon={<FileSpreadsheet size={16} />}
        severity="success"
        tooltip="Export Excel"
      />
      <Button
        icon={<FileSignature size={16} />}
        severity="danger"
        tooltip="Export PDF"
      />
    </div>
  );

  const loadProducts = async () => {
    try {
      const data = await getProducts();

      // Add serial number (S.No)
      const mapped = data.map((item: any, index: number) => ({
        sno: index + 1,
        ...item,
      }));

      setTableData(mapped);
    } catch (err: any) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: err.message || "Failed to load products",
      });
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div>
      <Toast ref={toast} />

      <Toolbar
        className="mb-2"
        left={leftToolbarTemplate}
        right={rightToolbarTemplate}
      />
      <Tooltip target=".p-button" position="left" />

      {/* TABLE */}
      <DataTable
        ref={dt}
        value={tableData}
        showGridlines
        scrollable
        stripedRows
        selectionMode="checkbox"
        selection={selectedRows}
        onSelectionChange={(e) => setSelectedRows(e.value)}
        dataKey="id"
      >
        <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />

        <Column field="sno" header="S.No" />
        <Column field="productName" header="Product Name" />
        <Column field="categoryName" header="Category" />
        <Column field="subCategoryName" header="Sub Category" />
        <Column field="hsnCode" header="HSN Code" />
        <Column field="taxPercentage" header="Tax %" />
        <Column field="productCode" header="Product Code" />
        <Column field="createdAt" header="Created At" />
        <Column field="createdBy" header="Created By" />
        <Column field="updatedAt" header="Updated At" />
        <Column field="updatedBy" header="Updated By" />
      </DataTable>

      <Sidebar
        visible={visibleRight}
        position="right"
        header={editRowData ? "Edit Product" : "Add Product"}
        style={{ width: "50vw" }}
        onHide={() => {
          setVisibleRight(false);
          setEditRowData(null);
          setSelectedRows([]);
        }}
      >
        <AddEditSettingsProducts
          selectedProduct={editRowData}
          onClose={() => {
            setVisibleRight(false);
            setEditRowData(null);
            setSelectedRows([]);
            loadProducts();
          }}
          reloadData={() => {}}
        />
      </Sidebar>
    </div>
  );
};

export default ProductSettingsProdCombo;
