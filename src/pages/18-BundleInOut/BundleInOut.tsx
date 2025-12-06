import React, { useRef, useState } from "react";

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

const BundleInOut: React.FC = () => {
  const dt = useRef<DataTable<any[]>>(null);
  const toast = useRef<Toast>(null);

  const [visibleInwardSidebar, setVisibleInwardSidebar] =
    useState<boolean>(true);
  const [selectedInwardItems, setSelectedInwardItems] = useState<any[]>([]);

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

  const rightToolbarTemplate = () => (
    <div className="flex gap-2 items-center">
      <span className="font-medium pr-5">
        Total: | Selected: {selectedInwardItems.length}
      </span>
      <Button
        icon={<FileText size={16} strokeWidth={2} />}
        severity="secondary"
        tooltip="Export as CSV"
        tooltipOptions={{ position: "left" }}
        // onClick={handleExportCSV}
        // loading={exportLoading.csv}
        // disabled={exportLoading.csv}
      />
      <Button
        icon={<FileSpreadsheet size={16} strokeWidth={2} />}
        severity="success"
        tooltip="Export as Excel"
        tooltipOptions={{ position: "left" }}
        // onClick={handleExportExcel}
        // loading={exportLoading.excel}
        // disabled={exportLoading.excel}
      />
      <Button
        icon={<FileSignature size={16} strokeWidth={2} />}
        severity="danger"
        tooltip="Export as PDF"
        tooltipOptions={{ position: "left" }}
        // onClick={handleExportPDF}
        // loading={exportLoading.pdf}
        // disabled={exportLoading.pdf}
      />
    </div>
  );

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
          id="categories-table"
          //   value={categories}
          selection={selectedInwardItems}
          onSelectionChange={(e) => setSelectedInwardItems(e.value as any[])}
          dataKey="refCategoryId"
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
          <Column header="Month" style={{ minWidth: "5rem" }} />
          <Column header="Date" style={{ minWidth: "5rem" }} frozen />
          <Column header="PO Date" style={{ minWidth: "5rem" }} />
          <Column header="PO Number" style={{ minWidth: "12rem" }} frozen />
          <Column header="PO Value" style={{ minWidth: "5rem" }} />
          <Column header="PO Receiving Type" style={{ minWidth: "12rem" }} />
          <Column header="Remarks" style={{ minWidth: "5rem" }} />
          <Column header="Quantity" style={{ minWidth: "5rem" }} />
          <Column header="Box Count" style={{ minWidth: "12rem" }} />
          <Column header="Location" style={{ minWidth: "5rem" }} />
          <Column header="Supplier Name" style={{ minWidth: "12rem" }} />
          <Column header="Bill Date" style={{ minWidth: "5rem" }} />
          <Column header="Bill No" style={{ minWidth: "5rem" }} />
          <Column header="Bill Quantity" style={{ minWidth: "12rem" }} />
          <Column header="Taxable Value" style={{ minWidth: "12rem" }} />
          <Column header="Tax %" style={{ minWidth: "5rem" }} />
          <Column header="Taxable Amount" style={{ minWidth: "12rem" }} />
          <Column header="Invoice Value" style={{ minWidth: "12rem" }} />
          <Column header="Bundle Status" style={{ minWidth: "12rem" }} />
          <Column header="GRN Date" style={{ minWidth: "12rem" }} />
          <Column header="GRN Status" style={{ minWidth: "12rem" }} />
          <Column header="GRN Value" style={{ minWidth: "12rem" }} />
          <Column header="Transporter Name" style={{ minWidth: "12rem" }} />
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
