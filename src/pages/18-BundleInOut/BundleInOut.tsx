import React, { useEffect, useRef, useState } from "react";

import backgroundImage from "../../assets/background/bg.png";
import { User } from "lucide-react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
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
import { Toolbar } from "primereact/toolbar";
import AddEditBundleInwards from "../../components/18-BundleInOutComponents/AddEditBundleInwards/AddEditBundleInwards";
import { fetchBundleData } from "./BundleInOut.function";
import type { BundleInwardItem } from "./BundleInOut.interface";

const BundleInOut: React.FC = () => {
  const dt = useRef<DataTable<any[]>>(null);
  const toast = useRef<Toast>(null);

  const [bundleRegisterData, setBundleRegisterData] = useState<
    BundleInwardItem[]
  >([]);

  const [visibleInwardSidebar, setVisibleInwardSidebar] =
    useState<boolean>(false);
  const [selectedInwardItems, setSelectedInwardItems] = useState<
    BundleInwardItem[]
  >([]);

  const editMode =
    Array.isArray(selectedInwardItems) && selectedInwardItems.length === 1;
  const selectedInward = editMode ? selectedInwardItems[0] : null;
  const isSingleSelected = selectedInwardItems.length === 1;
  const isAnySelected = selectedInwardItems.length > 0;

  const leftToolbarTemplate = () => (
    <div className="flex gap-2">
      <Button
        icon={<Plus size={16} strokeWidth={2} />}
        severity="success"
        tooltip="Add Category"
        tooltipOptions={{ position: "left" }}
        disabled={!!selectedInward}
        onClick={() => setVisibleInwardSidebar(true)}
      />
      <Button
        icon={<Pencil size={16} strokeWidth={2} />}
        severity="info"
        tooltip="Edit Category"
        tooltipOptions={{ position: "left" }}
        disabled={!isSingleSelected}
        onClick={() => setVisibleInwardSidebar(true)}
      />
      <Button
        icon={<Trash2 size={16} strokeWidth={2} />}
        severity="danger"
        tooltip="Delete Categories"
        tooltipOptions={{ position: "left" }}
        disabled={!isAnySelected}
        // onClick={handleDelete}
      />
    </div>
  );

  const [globalFilter, setGlobalFilter] = useState("");

  const rightToolbarTemplate = () => (
    <div className="flex gap-3 items-center">
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <input
          type="text"
          className="p-inputtext p-component"
          placeholder="Search..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          style={{ width: "250px" }}
        />
      </span>

      <Button
        icon={<FileText size={16} />}
        severity="secondary"
        tooltip="CSV"
      />
      <Button
        icon={<FileSpreadsheet size={16} />}
        severity="success"
        tooltip="Excel"
      />
      <Button
        icon={<FileSignature size={16} />}
        severity="danger"
        tooltip="PDF"
      />
    </div>
  );

  const load = async () => {
    try {
      const res = await fetchBundleData();

      setBundleRegisterData(res);
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

  return (
    <div
      className="ps-container"
      style={{
        backgroundColor: "#f5f5f5",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      <div className="ps-topbar">
        <div className="ps-left">
          <button className="ps-back-btn" onClick={() => window.history.back()}>
            Back
          </button>
        </div>

        <p className="uppercase font-semibold text-lg">Inward Register</p>

        <div className="ps-right">
          <User size={32} color="#6f1e60" />
        </div>
      </div>
      <div className="p-3">
        <Toast ref={toast} />
        <Toolbar
          className="mb-2"
          left={leftToolbarTemplate}
          right={rightToolbarTemplate}
        />
        <Tooltip target=".p-button" position="left" />
        <DataTable
          ref={dt}
          value={bundleRegisterData}
          selection={selectedInwardItems}
          onSelectionChange={(e) =>
            setSelectedInwardItems(e.value as BundleInwardItem[])
          }
          dataKey="refCategoryId"
          globalFilter={globalFilter}
          selectionMode="multiple"
          paginator
          showGridlines
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
          <Column header="S.No" frozen />

          <Column header="Inward Number" style={{ minWidth: "12rem" }} frozen />

          <Column
            header="Date"
            field="created_date"
            style={{ minWidth: "5rem" }}
            frozen
          />

          <Column
            header="PO Date"
            field="po_date"
            style={{ minWidth: "5rem" }}
          />
          <Column
            header="PO Number"
            field="po_number"
            style={{ minWidth: "12rem" }}
            frozen
          />
          <Column
            header="PO Value"
            field="total"
            style={{ minWidth: "5rem" }}
          />
          <Column
            header="PO Receiving Type"
            field="receiving_type"
            style={{ minWidth: "12rem", textTransform: "capitalize" }}
          />
          <Column
            header="Remarks"
            field="remarks"
            style={{ minWidth: "5rem" }}
          />

          <Column header="Quantity" style={{ minWidth: "5rem" }} />
          <Column
            header="Box Count"
            field="box_count"
            style={{ minWidth: "12rem" }}
          />
          <Column
            header="Location"
            field="location"
            style={{ minWidth: "5rem" }}
          />
          <Column header="Supplier Name" style={{ minWidth: "12rem" }} />

          <Column
            header="Bundle Status"
            field="bundle_status"
            style={{ minWidth: "12rem" }}
          />
          <Column
            header="GRN Date"
            field="grn_date"
            style={{ minWidth: "12rem" }}
          />
          <Column
            header="GRN Status"
            field="grn_status"
            style={{ minWidth: "12rem" }}
          />
          <Column
            header="GRN Value"
            field="grn_value"
            style={{ minWidth: "12rem" }}
          />

          <Column
            header="Transporter Name"
            field="transporter_name"
            style={{ minWidth: "12rem" }}
          />
        </DataTable>

        <Sidebar
          visible={visibleInwardSidebar}
          position="right"
          header={editMode ? "Edit Inward" : "Add Inward"}
          onHide={() => {
            setVisibleInwardSidebar(false);
            setSelectedInwardItems([]);
          }}
          style={{ width: "70vw" }}
        >
          <AddEditBundleInwards />
        </Sidebar>
      </div>
    </div>
  );
};

export default BundleInOut;
