import React, { useState, useRef, useEffect } from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Sidebar } from "primereact/sidebar";
import { Toolbar } from "primereact/toolbar";
import { Tooltip } from "primereact/tooltip";
import { Dialog } from "primereact/dialog";

import {
  FileSpreadsheet,
  FileText,
  Plus,
  Pencil,
  Trash2,
  FileSignature,
} from "lucide-react";

import AddEditSettingsProducts from "./AddEditSettingsProducts/AddEditSettingsProducts";
import {
  deleteProducts,
  getProducts,
} from "./ProductSettingsProdCombo.function";

const ProductSettingsProdCombo: React.FC = () => {
  const dt = useRef<DataTable<any>>(null);
  const toast = useRef<Toast>(null);

  const [visibleRight, setVisibleRight] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [editRowData, setEditRowData] = useState<any | null>(null);
  const [tableData, setTableData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Delete Dialog State
  const [deleteDialogVisible, setDeleteDialogVisible] =
    useState<boolean>(false);

  const isSingleSelected = selectedRows.length === 1;
  const isAnySelected = selectedRows.length > 0;

  /** LOAD PRODUCTS */
  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();

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
    } finally {
      setLoading(false);
    }
  };

  /** DELETE ACTION */
  const confirmDelete = () => {
    setDeleteDialogVisible(true);
  };

  const handleDelete = async () => {
    try {
      const ids = selectedRows.map((row) => row.id);

      const result = await deleteProducts(ids);

      toast.current?.show({
        severity: "success",
        summary: "Deleted",
        detail: "Products deleted successfully",
      });

      if (result?.token) {
        localStorage.setItem("token", result.token);
      }

      setSelectedRows([]);
      setDeleteDialogVisible(false);
      loadProducts();
    } catch (err: any) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: err.response?.data?.message || "Failed to delete products",
      });
    }
  };

  /** FORMAT EMPTY VALUES */
  const formatValue = (value: any) =>
    value === null || value === undefined || value === "" ? "-" : value;

  useEffect(() => {
    loadProducts();
  }, []);

  /** TOOLBAR LEFT */
  const leftToolbarTemplate = () => (
    <div className="flex gap-2">
      <Button
        icon={<Plus size={16} />}
        severity="success"
        tooltip="Add Product"
        tooltipOptions={{ position: "left" }}
        onClick={() => {
          setEditRowData(null);
          setVisibleRight(true);
        }}
      />

      <Button
        icon={<Pencil size={16} />}
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
        icon={<Trash2 size={16} />}
        severity="danger"
        tooltip="Delete Product"
        tooltipOptions={{ position: "left" }}
        disabled={!isAnySelected}
        onClick={confirmDelete}
      />
    </div>
  );

  /** TOOLBAR RIGHT */
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

  return (
    <div>
      <Toast ref={toast} />

      <Toolbar
        className="mb-2"
        left={leftToolbarTemplate}
        right={rightToolbarTemplate}
      />
      <Tooltip target=".p-button" position="left" />

      <DataTable
        ref={dt}
        value={tableData}
        showGridlines
        scrollable
        stripedRows
        loading={loading}
        paginator
        rows={15}
        rowsPerPageOptions={[15, 30, 50]}
        selection={selectedRows}
        onSelectionChange={(e) => setSelectedRows(e.value)}
        dataKey="id"
      >
        <Column
          selectionMode="multiple"
          headerClassName="align-start-header"
          headerStyle={{ textAlign: "center", justifyContent: "flex-start" }}
        />

        <Column field="sno" header="S.No" body={(r) => formatValue(r.sno)} />
        <Column
          field="productName"
          header="Product Name"
          body={(r) => formatValue(r.productName)}
        />
        <Column
          field="categoryName"
          header="Category"
          body={(r) => formatValue(r.categoryName)}
        />
        <Column
          field="subCategoryName"
          header="Sub Category"
          body={(r) => formatValue(r.subCategoryName)}
        />
        <Column
          field="hsnCode"
          header="HSN Code"
          body={(r) => formatValue(r.hsnCode)}
        />
        <Column
          field="taxPercentage"
          header="Tax %"
          body={(r) => formatValue(r.taxPercentage)}
        />
        <Column
          field="productCode"
          header="Product Code"
          body={(r) => formatValue(r.productCode)}
        />
        <Column
          field="createdAt"
          header="Created At"
          body={(r) => formatValue(r.createdAt)}
        />
        <Column
          field="createdBy"
          header="Created By"
          body={(r) => formatValue(r.createdBy)}
        />
        <Column
          field="updatedAt"
          header="Updated At"
          body={(r) => formatValue(r.updatedAt)}
        />
        <Column
          field="updatedBy"
          header="Updated By"
          body={(r) => formatValue(r.updatedBy)}
        />
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

      <Dialog
        header="Confirm Delete"
        visible={deleteDialogVisible}
        style={{ width: "30vw" }}
        modal
        footer={
          <div className="flex justify-end gap-3">
            <Button
              label="Cancel"
              severity="secondary"
              onClick={() => setDeleteDialogVisible(false)}
            />
            <Button label="Delete" severity="danger" onClick={handleDelete} />
          </div>
        }
        onHide={() => setDeleteDialogVisible(false)}
      >
        <p className="m-0">
          Are you sure you want to delete <b>{selectedRows.length}</b>{" "}
          product(s)?
        </p>
      </Dialog>
    </div>
  );
};

export default ProductSettingsProdCombo;
