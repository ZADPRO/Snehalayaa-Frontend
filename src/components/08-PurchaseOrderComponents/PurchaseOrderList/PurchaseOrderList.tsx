import React, { useEffect, useRef, useState } from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Toast } from "primereact/toast";

import { StickyNote } from "lucide-react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

import Barcode from "react-barcode";

const LABEL_WIDTH = 60; // mm
const LABEL_HEIGHT = 20; // mm

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
import { fetchGRNItemsByPO } from "./PurchaseOrderGRN/PurchaseOrderGRN.function";

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

  const [showGRNViewDialog, setShowGRNViewDialog] = useState(false);
  const [grnViewItems, setGrnViewItems] = useState<any[]>([]);
  const [grnGlobalFilter, setGrnGlobalFilter] = useState("");
  const [selectedGRNRows, setSelectedGRNRows] = useState<any[]>([]);

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
    if (selectedBranch && po.refBranchId !== selectedBranch) return false;

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

  const fetchExistingGRN = async (poId: number) => {
    try {
      const res = await fetchGRNItemsByPO(poId);

      // ✅ res is already the array
      console.log("GRN ITEMS ARRAY:", res);

      setGrnViewItems(Array.isArray(res) ? res : []);
      setShowGRNViewDialog(true);
    } catch (err) {
      console.error("Failed to fetch GRN items", err);
    }
  };

  const viewTemplate = (row: PurchaseOrderListItem) => {
    return (
      <StickyNote
        size={20}
        className="cursor-pointer text-blue-600 hover:text-blue-800"
        onClick={() => fetchExistingGRN(row.id)}
      />
    );
  };

  const [_isGenerating, setIsGenerating] = useState(false);

  const printLabels = () => {
    if (!selectedGRNRows.length) return;
    setIsGenerating(true);

    setTimeout(() => {
      const printContents = document.getElementById("print-area")?.innerHTML;
      if (!printContents) return;

      const printWindow = window.open("", "", "width=800,height=600");
      if (!printWindow) return;

      printWindow.document.write(`
        <html>
          <head>
            <title>Print Labels</title>
            <!-- Import Roboto with weight 500 -->
            <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@500&display=swap" rel="stylesheet">
            <style>
              /* Apply Roboto Medium to all labels */
              .barcode-label {
                font-family: 'Roboto', sans-serif;
                font-weight: 500;
              }
            </style>
            <style>
              @media print {
                body * { visibility: hidden; }
                #print-area, #print-area * {
                  visibility: visible;
                  font-family: 'Roboto', sans-serif;
                  font-weight: 500; /* ensure medium weight for print */
                }
                #print-area {
                  display: grid !important;
                  grid-template-columns: repeat(2, 1fr) !important;
                  gap: 5mm;
                  padding-left: 3mm;
                  padding-top: 5mm;
                  margin: 0;
                }
                .barcode-label {
                  width: auto !important;
                  height: auto !important;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  page-break-inside: avoid;
                  border: none !important;
                  text-transform: uppercase;
                  font-family: 'Roboto', sans-serif !important;
                  font-weight: 500 !important;
                }
              }
              .barcode-label {
                width: ${LABEL_WIDTH}mm;
                height: ${LABEL_HEIGHT}mm;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                margin: 5px;
                font-family: 'Roboto', sans-serif;
                font-weight: 500;
              }
            </style>
          </head>
          <body>
            <div id="print-area">${printContents}</div>
          </body>
        </html>
      `);

      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();

      setIsGenerating(false);
    }, 100);
  };

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
          header="View"
          body={viewTemplate}
          frozen
          style={{ minWidth: "5rem" }}
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

      <Dialog
        header={
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-2">
              <i className="pi pi-search text-lg" />
              <InputText
                placeholder="Global Search"
                value={grnGlobalFilter}
                onChange={(e) => setGrnGlobalFilter(e.target.value)}
              />
            </div>

            <Button
              label="Generate Bar Code"
              icon="pi pi-qrcode"
              className="p-button-success"
              onClick={printLabels}
            />
          </div>
        }
        visible={showGRNViewDialog}
        style={{ width: "95vw", height: "90vh" }}
        modal
        maximizable
        onHide={() => setShowGRNViewDialog(false)}
      >
        <DataTable
          value={grnViewItems}
          paginator
          rows={20}
          rowsPerPageOptions={[20, 50, 100]}
          showGridlines
          stripedRows
          responsiveLayout="scroll"
          selectionMode="multiple"
          selection={selectedGRNRows}
          onSelectionChange={(e) => setSelectedGRNRows(e.value)}
          globalFilter={grnGlobalFilter}
          dataKey="grnItemId"
        >
          <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />

          <Column header="SKU" field="sku" />
          <Column header="Product" field="productName" />
          <Column header="Pattern" field="patternName" />
          <Column header="Variant" field="varientName" />
          <Column header="Color" field="colorName" />
          <Column header="Size" field="sizeName" />
          <Column header="Cost" field="cost" />
          <Column header="Profit %" field="profitPercent" />
          <Column header="Total" field="total" />
          <Column header="Round Off" field="roundOff" />
          <Column header="Cloth Type" field="clothType" />
          <Column header="Meter Qty" field="meterQty" />
          <Column header="Qty in Meters" field="quantityInMeters" />
          <Column header="Branch" field="branchCode" />
          <Column header="Supplier" field="supplierName" />
          <Column header="GRN Date" field="grnDate" />
        </DataTable>
      </Dialog>

      <div id="print-area">
        {selectedGRNRows.map((p, index) => (
          <div key={index} className="barcode-label hidden">
            <p className="product-name">{p.productName}</p>

            <div className="barcode-wrapper">
              <Barcode
                value={p.sku || ""}
                height={35}
                width={1}
                displayValue={false}
              />
            </div>

            <div className="sku">{p.SKU}</div>
            <div className="price">₹ {parseFloat(p.total || 0).toFixed(2)}</div>

            <div className="pinv">
              {p.poNumber} | {p.lineNo || "-"}
            </div>
          </div>
        ))}

        <style>
          {`
      .barcode-label {
        width: ${LABEL_WIDTH}mm;
        height: ${LABEL_HEIGHT}mm;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        margin: 5px;
      }
      .product-name {
        font-weight: bold;
        margin: 0;
        margin-bottom: 2px; /* reduce gap below name */
      }
      .barcode-wrapper {
        margin-top: -2px; /* move barcode closer to name */
        margin-bottom: 2px;
      }
      .pinv {
        font-size: 9px; /* smaller font for P-INV text */
      }

      @media print {
        body * {
          visibility: hidden;
        }
        #print-area, #print-area * {
          visibility: visible;
          font-weight: bold; /* ensure bold carries in print */
        }
        #print-area {
          display: grid !important;
          grid-template-columns: repeat(2, 1fr) !important;
          gap: 5mm;
          padding-left: 3mm;
          padding-top: 5mm;
          margin: 0;
        }
        .barcode-label {
          width: auto !important;
          height: auto !important;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          page-break-inside: avoid;
          border: none !important;
          text-transform: uppercase;
        }
        .product-name {
          font-weight: bold;
        }
        .pinv {
          font-size: 7pt !important;
        }
        .barcode-wrapper {
          margin-top: -1mm !important;
          margin-bottom: 1mm !important;
        }
      }
    `}
        </style>
      </div>
    </div>
  );
};

export default PurchaseOrderList;
