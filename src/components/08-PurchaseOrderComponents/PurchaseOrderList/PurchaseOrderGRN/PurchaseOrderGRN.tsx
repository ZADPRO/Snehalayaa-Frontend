import React, { useState } from "react";
import type { PurchaseOrderListItem } from "../PurchaseOrderList.interface";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { InputNumber } from "primereact/inputnumber";
import ProductGRNDialog from "./ProductGRNDialog/ProductGRNDialog";
import ProductGRNInvoice from "./ProductGRNInvoice/ProductGRNInvoice";
import { Divider } from "primereact/divider";

interface Props {
  selectedPO: PurchaseOrderListItem | null;
}

const PurchaseOrderGRN: React.FC<Props> = ({ selectedPO }) => {
  const [receivedQty, setReceivedQty] = useState<number | null>(null);
  const [showGRNDialog, setShowGRNDialog] = useState(false);
  const [showInvoiceDialog, setShowInvoiceDialog] = useState(false);

  if (!selectedPO) return <p>No PO selected</p>;

  const handleStartGRN = () => {
    if (!receivedQty || receivedQty <= 0) {
      alert("Please enter a valid received quantity.");
      return;
    }
    setShowGRNDialog(true);
  };

  return (
    <div className="">
      <div className="space-y-2 text-sm flex justify-between">
        <div className="flex gap-3">
          <p>
            <b>Supplier:</b> {selectedPO.supplierName}
          </p>
          <p>
            <b>Branch:</b> {selectedPO.refBranchCode}
          </p>
          <p>
            <b>Status:</b> {selectedPO.status}
          </p>
          <p>
            <b>Total:</b> {selectedPO.total}
          </p>
        </div>

        <div className="flex gap-3">
          <p>
            <b>Total Ordered:</b> {selectedPO.totalorderedqty}
          </p>
          <p>
            <b>Total Received:</b> {selectedPO.totalreceivedqty}
          </p>
        </div>
      </div>
      <Divider />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <p>Enter Received Quantity :</p>

          <InputNumber
            value={receivedQty || undefined}
            onValueChange={(e) => setReceivedQty(e.value ?? null)}
            placeholder="0"
            min={1}
            max={selectedPO.totalorderedqty}
            className="w-32"
          />
        </div>

        <div className="flex items-center gap-3">
          <Button label="Start GRN" onClick={handleStartGRN} />
          <Button
            label="Upload Invoice"
            onClick={() => setShowInvoiceDialog(true)}
          />
          <Button label="Save Products" onClick={handleStartGRN} />
        </div>
      </div>
      <Divider />

      <div className="mt-2 mb-2">
        <p className="mb-2">Product Details</p>
        <DataTable showGridlines stripedRows value={selectedPO.products || []}>
          <Column header="S.No" body={(_, opt) => opt.rowIndex + 1} />
          <Column field="productName" header="Product" />
          <Column field="" header="Ref No" />
          <Column field="" header="Design" />
          <Column field="" header="Pattern" />
          <Column field="" header="Varient" />
          <Column field="" header="Color" />
          <Column field="" header="Size" />
          <Column field="" header="Profit %" />
          <Column field="" header="Total" />
          <Column field="" header="Delete" />
        </DataTable>
      </div>

      <Dialog
        header="Goods Receipt Note (GRN)"
        visible={showGRNDialog}
        style={{ width: "100vw", height: "100vh" }}
        modal
        maximizable
        onHide={() => setShowGRNDialog(false)}
      >
        <ProductGRNDialog
          selectedPO={selectedPO}
          receivedQty={receivedQty}
          closeDialog={() => setShowGRNDialog(false)}
        />{" "}
      </Dialog>
      <Dialog
        header="Invoice"
        visible={showInvoiceDialog}
        style={{ width: "100vw", height: "100vh" }}
        modal
        maximizable
        onHide={() => setShowInvoiceDialog(false)}
      >
        <ProductGRNInvoice
          selectedPO={selectedPO}
          closeDialog={() => setShowInvoiceDialog(false)}
        />{" "}
      </Dialog>
    </div>
  );
};

export default PurchaseOrderGRN;
