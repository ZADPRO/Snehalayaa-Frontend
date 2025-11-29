import React, { useEffect, useRef, useState } from "react";

import {
  FileSignature,
  FileSpreadsheet,
  FileText,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Tooltip } from "primereact/tooltip";
import { Sidebar } from "primereact/sidebar";
import { Skeleton } from "primereact/skeleton";

import {
  deleteSuppliers,
  fetchSupplier,
  exportCSV,
  exportExcel,
  exportPdf,
} from "./ViewDeleteSuppliers.function";
import type { Supplier } from "./ViewDeleteSuppliers.interface";
import AddEditSuppliers from "./AddEditSuppliers/AddEditSuppliers";

const ViewDeleteSuppliers: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedSuppliers, setSelectedSuppliers] = useState<Supplier[]>([]);
  const [visibleRight, setVisibleRight] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<Supplier[]>>(null);
  const [exportLoading, setExportLoading] = useState({
    csv: false,
    excel: false,
    pdf: false,
  });
  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchSupplier();
      setSuppliers(data);
    } catch (err: any) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: err.message || "Failed to load Suppliers",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const editMode =
    Array.isArray(selectedSuppliers) && selectedSuppliers.length === 1;
  const selectedSupplier = editMode ? selectedSuppliers[0] : null;
  console.log("selectedSupplier", selectedSupplier);

  const handleDelete = async () => {
    if (!selectedSuppliers.length) return;

    try {
      const supplierIds = selectedSuppliers.map((s) => s.supplierId);

      const res = await deleteSuppliers(supplierIds, true); // true = delete
      if (res.status) {
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: res.message,
        });
        setSelectedSuppliers([]);
        load();
      } else {
        toast.current?.show({
          severity: "warn",
          summary: "Warning",
          detail: res.message,
        });
      }
    } catch (err: any) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: err.message || "Failed to delete suppliers",
      });
    }
  };

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
      exportExcel(suppliers);
      setExportLoading((prev) => ({ ...prev, excel: false }));
    }, 300);
  };

  const handleExportPDF = () => {
    setExportLoading((prev) => ({ ...prev, pdf: true }));
    setTimeout(() => {
      exportPdf(suppliers);
      setExportLoading((prev) => ({ ...prev, pdf: false }));
    }, 300);
  };

  const isSingleSelected = selectedSuppliers.length === 1;
  const isAnySelected = selectedSuppliers.length > 0;

  const leftToolbarTemplate = () => (
    <div className="flex gap-2">
      <Button
        icon={<Plus size={16} strokeWidth={2} />}
        severity="success"
        tooltip="Add Supplier"
        disabled={isAnySelected}
        tooltipOptions={{ position: "left" }}
        onClick={() => setVisibleRight(true)}
      />
      <Button
        icon={<Pencil size={16} strokeWidth={2} />}
        severity="info"
        tooltip="Edit Supplier"
        tooltipOptions={{ position: "left" }}
        disabled={!isSingleSelected}
        onClick={() => setVisibleRight(true)}
      />
      <Button
        icon={<Trash2 size={16} strokeWidth={2} />}
        severity="danger"
        tooltip="Delete Suppliers"
        tooltipOptions={{ position: "left" }}
        disabled={!isAnySelected}
        onClick={handleDelete}
      />
    </div>
  );

  const rightToolbarTemplate = () => (
    <div className="flex gap-2">
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
        id="Suppliers-table"
        value={suppliers}
        loading={loading}
        selection={selectedSuppliers}
        onSelectionChange={(e) => setSelectedSuppliers(e.value as Supplier[])}
        dataKey="supplierId"
        selectionMode="multiple"
        paginator
        showGridlines
        stripedRows
        rows={10}
        rowsPerPageOptions={[5, 10, 20]}
        responsiveLayout="scroll"
      >
        <Column
          selectionMode="multiple"
          headerClassName="align-start-header"
          headerStyle={{ textAlign: "center", justifyContent: "flex-start" }}
        />
        <Column header="SNo" body={(_, opts) => opts.rowIndex + 1} />

        <Column
          field="supplierCode"
          header="Code"
          sortable
          body={(rowData) =>
            loading ? (
              <Skeleton width="100px" height="1rem" />
            ) : (
              rowData.supplierCode
            )
          }
        />
        <Column
          header="Name"
          field="supplierName"
          sortable
          body={(rowData) =>
            loading ? (
              <Skeleton width="120px" height="1rem" />
            ) : (
              rowData.supplierName
            )
          }
        />
        <Column
          header="Company Name"
          field="supplierCompanyName"
          sortable
          body={(rowData) =>
            loading ? (
              <Skeleton width="150px" height="1rem" />
            ) : (
              rowData.supplierCompanyName
            )
          }
        />
        <Column
          header="Contact Number"
          field="supplierContactNumber"
          body={(rowData) =>
            loading ? (
              <Skeleton width="100px" height="1rem" />
            ) : (
              rowData.supplierContactNumber
            )
          }
        />
        <Column
          field="supplierIsActive"
          header="Status"
          body={(rowData) =>
            loading ? (
              <Skeleton width="70px" height="1rem" />
            ) : rowData.supplierIsActive === "true" ? (
              "Active"
            ) : (
              "Inactive"
            )
          }
        />
      </DataTable>

      <Sidebar
        visible={visibleRight}
        position="right"
        header={editMode ? "Edit Supplier" : "Add Supplier"}
        onHide={() => {
          setVisibleRight(false);
          setSelectedSuppliers([]);
        }}
        style={{ width: "50vw" }}
      >
        <AddEditSuppliers
          selectedSupplier={selectedSupplier}
          onClose={() => {
            setVisibleRight(false);
            setSelectedSuppliers([]);
          }}
          reloadData={load}
        />
      </Sidebar>
    </div>
  );
};

export default ViewDeleteSuppliers;
