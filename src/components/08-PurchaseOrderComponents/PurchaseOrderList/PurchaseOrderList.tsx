import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Toast } from "primereact/toast";
import React, { useEffect, useRef, useState } from "react";
import {
  fetchPurchaseOrderList,
  showToastMsg,
} from "./PurchaseOrderList.function";
import type { PurchaseOrderListItem } from "./PurchaseOrderList.interface";

import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
// import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";
import PurchaseOrderGRN from "./PurchaseOrderGRN/PurchaseOrderGRN";
import type {
  Branch,
  Supplier,
} from "../PurchaseOrderCreate/PurchaseOrderCreate.interface";
import {
  fetchBranch,
  fetchSupplier,
} from "../PurchaseOrderCreate/PurchaseOrderCreate.function";

const PurchaseOrderList: React.FC = () => {
  const toast = useRef<Toast>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [purchaseOrderDetails, setPurchaseOrderDetails] = useState<
    PurchaseOrderListItem[]
  >([]);
  const [branchDetails, setBranchDetails] = useState<Branch[]>([]);
  const [supplierDetails, setSupplierDetails] = useState<Supplier[]>([]);

  // 🔥 Sidebar State
  const [sidebarVisible, setSidebarVisible] = useState<boolean>(false);
  const [selectedPO, setSelectedPO] = useState<PurchaseOrderListItem | null>(
    null
  );

  const [selectedBranch, setSelectedBranch] = useState<number | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<number | null>(null);
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [globalFilter, setGlobalFilter] = useState<string>("");

  const load = async () => {
    setLoading(true);
    try {
      setPurchaseOrderDetails(await fetchPurchaseOrderList());
      setBranchDetails(await fetchBranch());
      setSupplierDetails(await fetchSupplier());
    } catch (err: any) {
      showToastMsg(
        toast,
        "error",
        "Error",
        err.message || "Failed to load data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const poNumberTemplate = (row: PurchaseOrderListItem) => {
    return (
      <span
        className="text-blue-600 font-medium cursor-pointer underline"
        onClick={() => {
          setSelectedPO(row);
          setSidebarVisible(true);
        }}
      >
        {row.po_number}
      </span>
    );
  };

  const filteredPurchaseOrders = purchaseOrderDetails.filter((po) => {
    // ✅ Branch Filter
    if (selectedBranch && po.refBranchId !== selectedBranch) return false;

    // ✅ Supplier Filter
    if (selectedSupplier && po.supplierId !== selectedSupplier) return false;

    // ✅ Date Range Filter (createdAt)
    if (fromDate || toDate) {
      const createdDate = new Date(po.createdAt);

      if (fromDate && createdDate < fromDate) return false;
      if (toDate && createdDate > toDate) return false;
    }

    // ✅ Global Search Filter
    if (globalFilter.trim()) {
      const search = globalFilter.toLowerCase();

      const combinedFields = `
      ${po.po_number}
      ${po.supplierName}
      ${po.refBranchCode}
      ${po.status}
      ${po.total}
    `.toLowerCase();

      if (!combinedFields.includes(search)) return false;
    }

    return true;
  });

  return (
    <div>
      <Toast ref={toast} />

      <div className="flex gap-3 mb-3">
        <div className="flex-1">
          <Dropdown
            placeholder="Select Branch"
            className="w-full"
            options={branchDetails}
            optionValue="refBranchId"
            optionLabel="refBranchName"
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.value)}
            showClear
          />
        </div>
        <div className="flex-1">
          <Dropdown
            placeholder="Select Supplier"
            className="w-full"
            optionValue="supplierId"
            optionLabel="supplierName"
            options={supplierDetails}
            value={selectedSupplier}
            onChange={(e) => setSelectedSupplier(e.value)}
            showClear
          />
        </div>
        <div className="flex-1">
          <Calendar
            placeholder="From Date"
            className="w-full"
            showIcon
            value={fromDate}
            showButtonBar
            showOnFocus={false}
            onChange={(e) => setFromDate(e.value as Date)}
          />
        </div>
        <div className="flex-1">
          <Calendar
            placeholder="To Date"
            className="w-full"
            showIcon
            value={toDate}
            showButtonBar
            showOnFocus={false}
            onChange={(e) => setToDate(e.value as Date)}
          />{" "}
        </div>
        <div className="flex-1 flex gap-3">
          {/* <Dropdown placeholder="PO Status" className="w-full" /> */}
          {/* <Button label="Go" /> */}
        </div>
        <div className="flex-1">
          <InputText
            placeholder="Global Search"
            className="w-full"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </div>
      </div>

      <DataTable
        value={filteredPurchaseOrders}
        scrollable
        showGridlines
        stripedRows
        loading={loading}
        dataKey="id"
        paginator
        rows={20}
        rowsPerPageOptions={[20, 50, 80]}
        responsiveLayout="scroll"
      >
        <Column
          header="S.No"
          body={(_, options) => options.rowIndex + 1}
          frozen
          style={{ width: "5rem" }}
        />

        <Column
          header="PO Number"
          body={poNumberTemplate}
          sortable
          frozen
          style={{ minWidth: "12rem" }}
        />

        <Column
          header="Supplier Name"
          field="supplierName"
          style={{ minWidth: "15rem" }}
          frozen
        />

        <Column
          header="Credited Days"
          field="creditedDays"
          style={{ minWidth: "8rem" }}
        />

        <Column
          header="Branch Code"
          sortable
          field="refBranchCode"
          style={{ minWidth: "10rem" }}
        />

        <Column header="Total" field="total" style={{ minWidth: "12rem" }} />
        <Column
          header="PO Status"
          sortable
          field="status"
          style={{ minWidth: "8rem" }}
        />

        <Column
          header="Total Qty"
          field="totalorderedqty"
          style={{ minWidth: "6rem" }}
        />
        <Column
          header="Received Qty"
          field="totalreceivedqty"
          style={{ minWidth: "8rem" }}
        />

        <Column
          header="Fully Closed"
          field="isfullyclosed"
          body={(row) => (row.isfullyclosed ? "Yes" : "No")}
          style={{ minWidth: "8rem" }}
        />

        <Column
          header="Tax Enabled"
          field="taxEnabled"
          body={(row) => (row.taxEnabled ? "Yes" : "No")}
          style={{ minWidth: "8rem" }}
        />

        <Column
          header="Tax Rate"
          field="taxRate"
          style={{ minWidth: "8rem" }}
        />
        <Column
          header="Tax Amount"
          field="taxAmount"
          style={{ minWidth: "8rem" }}
        />

        <Column
          header="Created At"
          field="createdAt"
          style={{ minWidth: "12rem" }}
        />
        <Column
          header="Created By"
          field="createdBy"
          style={{ minWidth: "8rem" }}
        />
      </DataTable>

      <Sidebar
        visible={sidebarVisible}
        position="right"
        style={{ width: "90vw" }}
        header="Purchase Order Details"
        onHide={() => setSidebarVisible(false)}
      >
        <PurchaseOrderGRN selectedPO={selectedPO} />
      </Sidebar>
    </div>
  );
};

export default PurchaseOrderList;
