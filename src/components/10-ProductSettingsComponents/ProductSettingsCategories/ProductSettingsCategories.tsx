import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Tooltip } from "primereact/tooltip";
import { Sidebar } from "primereact/sidebar";

import {
  Plus,
  Pencil,
  Trash2,
  FileText,
  FileSpreadsheet,
  FileSignature,
} from "lucide-react";

import type { Category } from "./ProductSettingsCategories.interface";
import {
  bulkDeleteCategories,
  exportCSV,
  exportExcel,
  exportPdf,
  fetchCategories,
} from "./ProductSettingsCategories.function";
import { ConfirmDialog } from "primereact/confirmdialog";
import AddEditSettingsCategories from "./AddEditSettingsCategories/AddEditSettingsCategories";

const ProductSettingsCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [visibleRight, setVisibleRight] = useState<boolean>(false);
  const [pendingForceDeleteIds, setPendingForceDeleteIds] = useState<number[]>(
    []
  );
  const [showForceDialog, setShowForceDialog] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<Category[]>>(null);
  const [exportLoading, setExportLoading] = useState({
    csv: false,
    excel: false,
    pdf: false,
  });

  const editMode =
    Array.isArray(selectedCategories) && selectedCategories.length === 1;
  const selectedCategory = editMode ? selectedCategories[0] : null;

  const handleExportCSV = () => {
    setExportLoading((prev) => ({ ...prev, csv: true }));
    setTimeout(() => {
      exportCSV(dt);
      setExportLoading((prev) => ({ ...prev, csv: false }));
    }, 300);
  };

  const handleExportExcel = () => {
    setExportLoading((prev) => ({ ...prev, excel: true }));
    setTimeout(() => {
      exportExcel(categories);
      setExportLoading((prev) => ({ ...prev, excel: false }));
    }, 300);
  };

  const handleExportPDF = () => {
    setExportLoading((prev) => ({ ...prev, pdf: true }));
    setTimeout(() => {
      exportPdf(categories);
      setExportLoading((prev) => ({ ...prev, pdf: false }));
    }, 300);
  };

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (err: any) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: err.message || "Failed to load categories",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);

  const handleDelete = async () => {
    if (!selectedCategories.length) return;

    const idsToDelete = selectedCategories.map((cat) => cat.refCategoryId);

    try {
      const res = await bulkDeleteCategories(idsToDelete);

      if (res.status) {
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: res.message,
        });
        setSelectedCategories([]);
        load();
      } else {
        // If status false but 409, or confirmationNeeded flag is returned
        const is409 =
          res?.statusCode === 409 ||
          res?.message?.toLowerCase?.()?.includes("subcategories");

        if (res.confirmationNeeded || is409) {
          setPendingForceDeleteIds(idsToDelete);
          setShowForceDialog(true);
        } else {
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: res.message,
          });
        }
      }
    } catch (err: any) {
      const statusCode = err?.response?.status;
      const backendMessage =
        err?.response?.data?.message || err?.message || "Failed to delete";

      if (statusCode === 409) {
        setPendingForceDeleteIds(idsToDelete);
        setShowForceDialog(true);
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: backendMessage,
        });
      }
    }
  };

  const isSingleSelected = selectedCategories.length === 1;
  const isAnySelected = selectedCategories.length > 0;

  const leftToolbarTemplate = () => (
    <div className="flex gap-2">
      <Button
        icon={<Plus size={16} strokeWidth={2} />}
        severity="success"
        tooltip="Add Category"
        tooltipOptions={{ position: "left" }}
        disabled={!!selectedCategory}
        onClick={() => setVisibleRight(true)}
      />
      <Button
        icon={<Pencil size={16} strokeWidth={2} />}
        severity="info"
        tooltip="Edit Category"
        tooltipOptions={{ position: "left" }}
        disabled={!isSingleSelected}
        onClick={() => setVisibleRight(true)}
      />
      <Button
        icon={<Trash2 size={16} strokeWidth={2} />}
        severity="danger"
        tooltip="Delete Categories"
        tooltipOptions={{ position: "left" }}
        disabled={!isAnySelected}
        onClick={handleDelete}
      />
    </div>
  );

  const rightToolbarTemplate = () => (
    <div className="flex gap-2 items-center">
      <span className="font-medium pr-5">
        Total: {categories.length} | Selected: {selectedCategories.length}
      </span>
      <Button
        icon={<FileText size={16} strokeWidth={2} />}
        severity="secondary"
        tooltip="Export as CSV"
        tooltipOptions={{ position: "left" }}
        onClick={handleExportCSV}
        loading={exportLoading.csv}
        disabled={exportLoading.csv}
      />
      <Button
        icon={<FileSpreadsheet size={16} strokeWidth={2} />}
        severity="success"
        tooltip="Export as Excel"
        tooltipOptions={{ position: "left" }}
        onClick={handleExportExcel}
        loading={exportLoading.excel}
        disabled={exportLoading.excel}
      />
      <Button
        icon={<FileSignature size={16} strokeWidth={2} />}
        severity="danger"
        tooltip="Export as PDF"
        tooltipOptions={{ position: "left" }}
        onClick={handleExportPDF}
        loading={exportLoading.pdf}
        disabled={exportLoading.pdf}
      />
    </div>
  );

  return (
    <div className="">
      <Toast ref={toast} />
      <Toolbar
        className="mb-2"
        left={leftToolbarTemplate}
        right={rightToolbarTemplate}
      />
      <Tooltip target=".p-button" position="left" />

      <DataTable
        ref={dt}
        id="categories-table"
        value={categories}
        selection={selectedCategories}
        onSelectionChange={(e) => setSelectedCategories(e.value as Category[])}
        dataKey="refCategoryId"
        selectionMode="multiple"
        paginator
        showGridlines
        loading={loading}
        stripedRows
        rows={15}
        rowsPerPageOptions={[15, 30, 50]}
        responsiveLayout="scroll"
      >
        <Column
          selectionMode="multiple"
          headerClassName="align-start-header"
          headerStyle={{ textAlign: "center", justifyContent: "flex-start" }}
        />
        <Column header="SNo" body={(_, opts) => opts.rowIndex + 1} />

        <Column field="categoryCode" header="Code" sortable />
        <Column field="categoryName" header="Name" sortable />
        <Column field="createdBy" header="Created By" />
        <Column field="createdAt" header="Created At" />
        <Column
          field="isActive"
          header="Status"
          body={(rowData) => (rowData.isActive ? "Active" : "Inactive")}
        />
      </DataTable>

      <Sidebar
        visible={visibleRight}
        position="right"
        header={editMode ? "Edit Category" : "Add Category"}
        onHide={() => {
          setVisibleRight(false);
          setSelectedCategories([]);
        }}
        style={{ width: "50vw" }}
      >
        <AddEditSettingsCategories
          selectedCategory={selectedCategory}
          onClose={() => {
            setVisibleRight(false);
            setSelectedCategories([]);
          }}
          reloadData={load}
        />
      </Sidebar>
      <ConfirmDialog
        visible={showForceDialog}
        onHide={() => setShowForceDialog(false)}
        message="This category contains subcategories. Deleting it will make them idle. Do you want to continue?"
        header="Confirm Deletion"
        acceptClassName="p-button-danger"
        className="m-4"
        accept={async () => {
          try {
            const res = await bulkDeleteCategories(pendingForceDeleteIds, true);
            if (res.status) {
              toast.current?.show({
                severity: "success",
                summary: "Deleted",
                detail: res.message,
              });
              setSelectedCategories([]);
              load();
            } else {
              toast.current?.show({
                severity: "error",
                summary: "Error",
                detail: res.message,
              });
            }
          } catch (err: any) {
            const backendMessage =
              err?.response?.data?.message ||
              err?.message ||
              "Forced delete failed";

            toast.current?.show({
              severity: "error",
              summary: "Error",
              detail: backendMessage,
            });
          } finally {
            setShowForceDialog(false);
            setPendingForceDeleteIds([]);
          }
        }}
        reject={() => {
          setShowForceDialog(false);
          setPendingForceDeleteIds([]);
        }}
      />
    </div>
  );
};

export default ProductSettingsCategories;
