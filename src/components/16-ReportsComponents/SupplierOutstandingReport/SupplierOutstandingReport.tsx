import React, { useEffect, useState } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { ProgressSpinner } from "primereact/progressspinner";

import axios from "axios";
import { baseURLV2 } from "../../../utils/helper";

const SupplierOutstandingReport: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ FETCH SUPPLIER OUTSTANDING REPORT
  const fetchOutstandingReport = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${baseURLV2}/admin/purchaseOrder/getSupplierBillAgeingReport`,
        {
          headers: {
            Authorization: localStorage.getItem("token") || "",
          },
        }
      );

      setData(response.data?.data || []);
    } catch (error) {
      console.error("❌ Failed to fetch supplier outstanding report:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOutstandingReport();
  }, []);

  // ✅ OVERDUE TAG UI
  const overdueTemplate = (row: any) => {
    const overdue = Number(row["Over Due by Bill Date"] || 0);

    return (
      <Tag
        value={overdue > 0 ? `Overdue: ${overdue} days` : "Not Due"}
        severity={overdue > 0 ? "danger" : "success"}
      />
    );
  };

  return (
    <div className="p-3">
      <h3>Supplier Outstanding Report</h3>

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
          emptyMessage="No outstanding records found"
        >
          <Column field="Unit" header="Unit" />
          {/* <Column field="GRN Date" header="GRN Date" /> */}
          <Column field="GRN Number" header="GRN Number" />
          <Column field="Supplier Invoice Number" header="Invoice No" />
          <Column field="Invoice Date" header="Invoice Date" />
          <Column field="Ageing by Supplier Bill Date" header="Ageing (Days)" />
          <Column field="Credit Days" header="Credit Days" />
          <Column header="Overdue Status" body={overdueTemplate} />
          <Column
            field="Over Due by Bill Date"
            header="Overdue (Days)"
            bodyClassName={(row) =>
              Number(row["Over Due by Bill Date"] || 0) > 0
                ? "overdue-cell"
                : ""
            }
          />
        </DataTable>
      )}

      {/* ✅ RED HIGHLIGHT FOR OVERDUE */}
      <style>
        {`
          .overdue-cell {
            background-color: #ffe0e0 !important;
            color: #b00000;
            font-weight: bold;
          }
        `}
      </style>
    </div>
  );
};

export default SupplierOutstandingReport;
