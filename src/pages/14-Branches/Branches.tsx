import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import {
  FileSignature,
  FileSpreadsheet,
  FileText,
  Pencil,
  Plus,
  User,
} from "lucide-react";
import { Sidebar } from "primereact/sidebar";
import { Column } from "primereact/column";
import { Toolbar } from "primereact/toolbar";
import { Tooltip } from "primereact/tooltip";
import {
  exportCSV,
  exportExcel,
  exportPdf,
  fetchBranch,
} from "./Branches.function";
import type { Branch } from "./Branches.interface";
import {
  fetchCategories,
  fetchSubCategories,
} from "../../components/08-PurchaseOrderComponents/PurchaseOrderCreate/PurchaseOrderCreate.function";
import type {
  Category,
  SubCategory,
} from "../../components/08-PurchaseOrderComponents/PurchaseOrderCreate/PurchaseOrderCreate.interface";
import AddEditBranches from "../../components/14-BranchesComponents/AddEditBranches/AddEditBranches";

import backgroundImage from "../../assets/background/bg.png";

const Branches: React.FC = () => {
  const [branch, setBranch] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<Branch[]>([]);
  const [visibleRight, setVisibleRight] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<Branch[]>>(null);
  const [exportLoading, setExportLoading] = useState({
    csv: false,
    excel: false,
    pdf: false,
  });

  const load = async () => {
    setLoading(true);
    try {
      const [branchData, categoryData, subCategoryData] = await Promise.all([
        fetchBranch(),
        fetchCategories(),
        fetchSubCategories(),
      ]);
      setBranch(branchData);
      setCategories(categoryData);
      setSubCategories(subCategoryData);
    } catch (err: any) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: err.message || "Failed to load branches",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);

  const editMode = Array.isArray(selectedBranch) && selectedBranch.length === 1;
  const selectedBranches = editMode ? selectedBranch[0] : null;

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
      exportExcel(branch);
      setExportLoading((prev) => ({ ...prev, excel: false }));
    }, 300);
  };

  const handleExportPDF = () => {
    setExportLoading((prev) => ({ ...prev, pdf: true }));
    setTimeout(() => {
      exportPdf(branch);
      setExportLoading((prev) => ({ ...prev, pdf: false }));
    }, 300);
  };

  const isSingleSelected = selectedBranch.length === 1;
  const isAnySelected = selectedBranch.length > 0;

  const leftToolbarTemplate = () => (
    <div className="flex gap-2">
      <Button
        icon={<Plus size={16} strokeWidth={2} />}
        severity="success"
        tooltip="Add Branch"
        disabled={isAnySelected}
        tooltipOptions={{ position: "left" }}
        onClick={() => setVisibleRight(true)}
      />
      <Button
        icon={<Pencil size={16} strokeWidth={2} />}
        severity="info"
        tooltip="Edit Branch"
        tooltipOptions={{ position: "left" }}
        disabled={!isSingleSelected}
        onClick={() => setVisibleRight(true)}
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

        <p className="uppercase font-semibold text-lg">Branches</p>

        <div className="ps-right">
          <User size={32} color="#6f1e60" />
        </div>
      </div>{" "}
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
          id="Branch-table"
          value={branch}
          selection={selectedBranch}
          onSelectionChange={(e) => setSelectedBranch(e.value as Branch[])}
          dataKey="refBranchId"
          selectionMode="multiple"
          paginator
          showGridlines
          stripedRows
          rows={10}
          loading={loading}
          rowsPerPageOptions={[5, 10, 20]}
          responsiveLayout="scroll"
        >
          <Column
            selectionMode="multiple"
            headerStyle={{ textAlign: "center" }}
          />
          <Column header="SNo" body={(_, opts) => opts.rowIndex + 1} />

          <Column field="refBranchCode" header="Code" sortable />
          <Column field="refBranchName" header="Branch Name" sortable />
          <Column field="refLocation" header="Location" sortable />
          <Column field="refMobile" header="Contact Number" />
          <Column field="refEmail" header="Email" />
          <Column
            field="isActive"
            header="Status"
            body={(rowData) => (rowData.isActive ? "Active" : "Inactive")}
          />
        </DataTable>

        <Sidebar
          visible={visibleRight}
          position="right"
          header={editMode ? "Edit Branch" : "Add Branch"}
          onHide={() => {
            setVisibleRight(false);
            setSelectedBranch([]);
          }}
          style={{ width: "50vw" }}
        >
          <AddEditBranches
            selectedBranches={selectedBranches}
            categories={categories}
            subCategories={subCategories}
            onClose={() => {
              setVisibleRight(false);
              setSelectedBranch([]);
            }}
            reloadData={load}
          />
        </Sidebar>
      </div>
    </div>
  );
};

export default Branches;
