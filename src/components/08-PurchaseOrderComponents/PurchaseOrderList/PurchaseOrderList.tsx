import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import type { Toast } from "primereact/toast";
import React, { useEffect, useRef, useState } from "react";
import {
  fetchPurchaseOrderList,
  showToastMsg,
} from "./PurchaseOrderList.function";
import type { PurchaseOrderListItem } from "./PurchaseOrderList.interface";

const PurchaseOrderList: React.FC = () => {
  const toast = useRef<Toast>(null);

  const [loading, setLoading] = useState<boolean>(false);
  console.log('loading', loading)
  const [purchaseOrderDetails, setPurchaseOrderDetails] = useState<
    PurchaseOrderListItem[]
  >([]);
  const load = async () => {
    setLoading(true);
    try {
      console.log("true");
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

  return (
    <div>
      <div className="flex">

      </div>
      <DataTable
        scrollable
        showGridlines
        stripedRows
        value={purchaseOrderDetails}
      >
        <Column header="S.No" />
        <Column
          header="PO Number"
          field="po_number"
          style={{ minWidth: "12rem" }}
        />
        <Column
          header="Supplier Name"
          field="supplierName"
          style={{ minWidth: "12rem" }}
        />
        <Column
          header="Credited Days"
          field="creditedDays"
          style={{ minWidth: "8rem" }}
        />
        <Column
          header="Branch Code"
          field="refBranchCode"
          style={{ minWidth: "8rem" }}
        />

        <Column header="Total" field="total" style={{ minWidth: "12rem" }} />
        <Column
          header="PO Status"
          field="status"
          style={{ minWidth: "8rem" }}
        />

        <Column
          header="Total Qnty"
          field="totalorderedqty"
          style={{ minWidth: "6rem" }}
        />
        <Column
          header="Received Qnty"
          field="totalreceivedqty"
          style={{ minWidth: "8rem" }}
        />
        <Column
          header="Is Fully Closed"
          field="isfullyclosed"
          style={{ minWidth: "8rem" }}
        />

        <Column
          header="Tax Enabled"
          field="taxEnabled"
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
          header="Created BY"
          field="createdBy"
          style={{ minWidth: "8rem" }}
        />
      </DataTable>
    </div>
  );
};

export default PurchaseOrderList;
