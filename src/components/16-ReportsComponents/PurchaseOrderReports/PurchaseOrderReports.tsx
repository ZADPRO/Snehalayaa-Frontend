import React, { useEffect, useState } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProgressSpinner } from "primereact/progressspinner";
import { fetchPurchaseOrderReport } from "./PurchaseOrderReports.function";

const PurchaseOrderReports: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadReport = async () => {
    try {
      setLoading(true);
      const response = await fetchPurchaseOrderReport();
      setData(response?.data || []);
    } catch (error) {
      console.error("❌ Failed to load purchase order report:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, []);

  return (
    <div className="p-3">
      <h3>Purchase Order / GRN Report</h3>

      {loading ? (
        <div className="flex justify-content-center mt-6">
          <ProgressSpinner />
        </div>
      ) : (
        <DataTable
          value={data}
          paginator
          rows={10}
          showGridlines
          stripedRows
          className="shadow bg-white"
          emptyMessage="No purchase order records found"
        >
          <Column field="Unit" header="Unit" />
          <Column field="Type" header="Type" />
          <Column field="GRN No." header="GRN No" />
          <Column field="GRN Dt." header="GRN Date" />
          <Column field="Supplier Name" header="Supplier" />
          <Column field="GST Reg. No" header="GST No" />
          <Column field="PO #" header="PO No" />
          <Column field="PO Date" header="PO Date" />
          <Column field="Item Code" header="Item Code" />
          <Column field="Item Name" header="Item Name" />
          <Column field="Item Category" header="Category" />
          <Column field="Pack Qty" header="Qty" />
          <Column field="Rate" header="Rate" />
          <Column field="Selling Price" header="Selling Price" />
          <Column field="Tax %" header="Tax %" />
          <Column field="Margin %" header="Margin %" />
          <Column field="Gross Amount" header="Gross Amount" />
          <Column field="CGST" header="CGST" />
          <Column field="SGST" header="SGST" />
          <Column field="IGST" header="IGST" />
          <Column field="Tax Amount" header="Tax Amount" />
          <Column field="Credit Days" header="Credit Days" />
        </DataTable>
      )}
    </div>
  );
};

export default PurchaseOrderReports;
