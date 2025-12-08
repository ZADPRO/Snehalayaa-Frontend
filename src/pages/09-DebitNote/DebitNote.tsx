import React, { useEffect, useRef, useState } from "react";

import backgroundImage from "../../assets/background/bg.png";
import { User } from "lucide-react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Tooltip } from "primereact/tooltip";
import { Sidebar } from "primereact/sidebar";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";

import {
  Plus,
  Pencil,
  FileText,
  FileSpreadsheet,
  FileSignature,
} from "lucide-react";
import { Toolbar } from "primereact/toolbar";
import AddEditDebitNote from "../../components/09-DebitNoteComponents/AddEditDebitNote/AddEditDebitNote";
import { fetchDebitNoteData } from "./DebitNote.function";

const DebitNote: React.FC = () => {
  const dt = useRef<DataTable<any[]>>(null);
  const toast = useRef<Toast>(null);

  const [visibleInwardSidebar, setVisibleInwardSidebar] =
    useState<boolean>(false);

  const [selectedInwardItems, setSelectedInwardItems] = useState<any[]>([]);
  const [debitNoteData, setDebitNoteData] = useState<any[]>([]);

  const isSingleSelected = selectedInwardItems.length === 1;

  const leftToolbarTemplate = () => (
    <div className="flex gap-2">
      <Button
        icon={<Plus size={16} strokeWidth={2} />}
        severity="success"
        tooltip="Add Category"
        tooltipOptions={{ position: "left" }}
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
    </div>
  );

  const [globalFilter, setGlobalFilter] = useState("");

  const rightToolbarTemplate = () => (
    <div className="flex gap-3 items-center">
      <IconField iconPosition="left">
        <InputIcon className="pi pi-search" />
        <InputText
          placeholder="Search..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          style={{ width: "250px" }}
        />
      </IconField>

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
      const res = await fetchDebitNoteData();

      setDebitNoteData(res);
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
      }}
    >
      {/* TOP BAR */}
      <div className="ps-topbar flex items-center justify-between p-3 bg-white shadow">
        <button className="ps-back-btn" onClick={() => window.history.back()}>
          Back
        </button>

        <p className="uppercase font-semibold text-lg">Debit Note</p>

        <User size={32} color="#6f1e60" />
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
          value={debitNoteData}
          selection={selectedInwardItems}
          onSelectionChange={(e) => setSelectedInwardItems(e.value as any[])}
          dataKey="inward_id"
          globalFilter={globalFilter}
          selectionMode="multiple"
          paginator
          showGridlines
          stripedRows
          scrollable
          rows={15}
          rowsPerPageOptions={[15, 30, 50]}
          responsiveLayout="scroll"
        >
          <Column
            selectionMode="multiple"
            headerClassName="align-start-header"
            headerStyle={{ textAlign: "center", justifyContent: "flex-start" }}
          />
          <Column header="SNo" frozen body={(_, opts) => opts.rowIndex + 1} />

          <Column
            header="Supplier Name"
            field="supplierName"
            style={{ minWidth: "12rem" }}
            frozen
          />
          <Column
            header="PO Number"
            field="po_number"
            style={{ minWidth: "12rem" }}
            frozen
          />
          <Column
            header="Branch Name"
            field="refBranchName"
            style={{ minWidth: "12rem" }}
            frozen
          />
          <Column
            header="Quantity"
            field="totalQuantity"
            style={{ minWidth: "12rem" }}
            frozen
          />
          <Column
            header="Created At"
            field="createdAt"
            style={{ minWidth: "12rem" }}
            frozen
          />
          <Column
            header="Created By"
            field="createdBy"
            style={{ minWidth: "12rem" }}
            frozen
          />
        </DataTable>

        <Sidebar
          visible={visibleInwardSidebar}
          position="right"
          header={"Add Debit Note"}
          onHide={() => {
            setVisibleInwardSidebar(false);
            setSelectedInwardItems([]);
          }}
          style={{ width: "70vw" }}
        >
          <AddEditDebitNote
          // editData={selectedInward}
          // onSuccess={() => {
          //   setVisibleInwardSidebar(false);
          //   setSelectedInwardItems([]);
          //   load();
          // }}
          />
        </Sidebar>
      </div>
    </div>
  );
};

export default DebitNote;
