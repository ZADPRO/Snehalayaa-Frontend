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

const PurchaseOrderList: React.FC = () => {
  const toast = useRef<Toast>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [purchaseOrderDetails, setPurchaseOrderDetails] = useState<
    PurchaseOrderListItem[]
  >([]);

  // 🔥 Sidebar State
  const [sidebarVisible, setSidebarVisible] = useState<boolean>(false);
  const [selectedPO, setSelectedPO] = useState<PurchaseOrderListItem | null>(
    null
  );

  const load = async () => {
    setLoading(true);
    try {
      setPurchaseOrderDetails(await fetchPurchaseOrderList());
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

  return (
    <div>
      <Toast ref={toast} />

      <div className="flex gap-3 mb-3">
        <div className="flex-1">
          <Dropdown placeholder="Select Branch" className="w-full" />
        </div>
        <div className="flex-1">
          <Dropdown placeholder="Select Supplier" className="w-full" />
        </div>
        <div className="flex-1">
          <Calendar placeholder="From Date" className="w-full" showIcon />
        </div>
        <div className="flex-1">
          <Calendar placeholder="To Date" className="w-full" showIcon />
        </div>
        <div className="flex-1 flex gap-3">
          <Dropdown placeholder="PO Status" className="w-full" />
          {/* <Button label="Go" /> */}
        </div>
        <div className="flex-1">
          <InputText placeholder="Global Search" className="w-full" />
        </div>
      </div>

      <DataTable
        value={purchaseOrderDetails}
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
