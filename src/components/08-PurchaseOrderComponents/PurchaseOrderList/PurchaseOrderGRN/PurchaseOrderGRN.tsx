import React, { useEffect, useState } from "react";
import type { PurchaseOrderListItem } from "../PurchaseOrderList.interface";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { InputNumber } from "primereact/inputnumber";
import ProductGRNDialog from "./ProductGRNDialog/ProductGRNDialog";
import ProductGRNInvoice from "./ProductGRNInvoice/ProductGRNInvoice";
import { Divider } from "primereact/divider";
import { createGRN, fetchGRNItemsByPO } from "./PurchaseOrderGRN.function";
import { Dropdown } from "primereact/dropdown";
import { FloatLabel } from "primereact/floatlabel";
import { getBundleDetails } from "./ProductGRNDialog/ProductGRNDialog.function";

interface Props {
  selectedPO: PurchaseOrderListItem | null;
}

const PurchaseOrderGRN: React.FC<Props> = ({ selectedPO }) => {
  console.log("selectedPO", selectedPO);
  const [receivedQty, setReceivedQty] = useState<number | null>(null);
  const [showGRNDialog, setShowGRNDialog] = useState(false);
  const [showInvoiceDialog, setShowInvoiceDialog] = useState(false);

  const [existingGRNItems, setExistingGRNItems] = useState<any[]>([]);

  const [quantityInMeters, setQuantityInMeters] = useState<"yes" | "no" | null>(
    null
  );
  const [clothType, setClothType] = useState<"sarees" | "readymade" | null>(
    null
  );

  const [bundleDetails, setBundleDetails] = useState<any[]>([]);

  // GRN data returned from child
  const [grnData, setGrnData] = useState<{
    poId: number;
    supplierId: number;
    items: any[];
  } | null>(null);

  if (!selectedPO) return <p>No PO selected</p>;

  const handleStartGRN = () => {
    if (!receivedQty || receivedQty <= 0) {
      alert("Please enter a valid received quantity.");
      return;
    }
    setShowGRNDialog(true);
  };

  const handleGRNSave = (payload: {
    poId: number;
    supplierId: number;
    items: any[];
  }) => {
    const finalPayload = {
      ...payload,
      branchId: selectedPO.refBranchId,
    };

    console.log("✅ GRN DATA RECEIVED IN PARENT:", finalPayload);
    setGrnData(finalPayload);
    setShowGRNDialog(false);
  };

  const productRows = grnData?.items?.length ? grnData.items : existingGRNItems;

  const remainingQty = selectedPO.totalorderedqty - selectedPO.totalreceivedqty;

  const fetchExistingGRN = async () => {
    try {
      const items = await fetchGRNItemsByPO(selectedPO.id);
      const bundleDetails = await getBundleDetails(selectedPO.id);
      console.log("bundleDetails", bundleDetails);
      console.log("items", items);
      setExistingGRNItems(items);
      setBundleDetails(bundleDetails);
      if (bundleDetails) {
        setReceivedQty(bundleDetails.po_qty);
      }
    } catch (err) {
      console.error("Failed to fetch GRN items", err);
    }
  };

  useEffect(() => {
    if (!selectedPO) return;
    fetchExistingGRN();
  }, [selectedPO]);

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
            onValueChange={(e) => {
              let value = e.value ?? 0;
              if (value > remainingQty) {
                value = remainingQty;
              }
              setReceivedQty(value);
            }}
            placeholder="0"
            min={1}
            max={remainingQty}
            className="w-32"
          />
        </div>

        <div className="flex items-center gap-3">
          <Button label="Start GRN" onClick={handleStartGRN} />
          <Button
            label="Save Products"
            onClick={async () => {
              if (!grnData) {
                alert("No GRN data to save!");
                return;
              }

              try {
                const result = await createGRN({
                  ...grnData!,
                  branchId: selectedPO.refBranchId, // 🔥 Correct place to pass branch id
                });
                console.log("GRN saved:", result);
                alert("GRN Saved Successfully!");
              } catch (err: any) {
                alert(err.message || "Failed to save GRN");
              }
            }}
          />
        </div>
      </div>
      <Divider />

      <div className="mt-2 mb-2">
        <p className="mb-2">Product Details</p>

        {/* If GRN is done, show GRN items; else show original PO products */}
        <DataTable showGridlines stripedRows value={productRows}>
          <Column header="S.No" body={(_, opt) => opt.rowIndex + 1} />

          {/* When GRN present: productName, else from PO */}
          <Column field="productName" header="Product" />

          <Column field="refNo" header="Ref No" />

          <Column
            header="Design"
            body={(row: any) => row.design?.name ?? row.designName ?? ""}
          />

          <Column
            header="Pattern"
            body={(row: any) => row.pattern?.name ?? row.patternName ?? ""}
          />

          <Column
            header="Variant"
            body={(row: any) => row.variant?.name ?? row.variantName ?? ""}
          />

          <Column
            header="Color"
            body={(row: any) => row.color?.name ?? row.colorName ?? ""}
          />

          <Column
            header="Size"
            body={(row: any) => row.size?.name ?? row.sizeName ?? ""}
          />

          <Column field="profitPercent" header="Profit %" />

          <Column field="total" header="Total" />

          {/* Delete in main table for GRN items (optional) */}
          {grnData && (
            <Column
              header="Delete"
              body={(_, opt) => (
                <Button
                  text
                  severity="danger"
                  icon="pi pi-trash"
                  onClick={() => {
                    if (!grnData) return;
                    const updatedItems = grnData.items.filter(
                      (_: any, i: number) => i !== opt.rowIndex
                    );
                    setGrnData({ ...grnData, items: updatedItems });
                  }}
                />
              )}
            />
          )}
        </DataTable>
      </div>

      <Dialog
        header={
          <div className="flex items-center w-full gap-5">
            <span className="text-xl font-semibold">
              Goods Receipt Note (GRN)
            </span>
            <div className="flex gap-3 mt-2">
              <FloatLabel className="flex-1 always-float">
                <Dropdown
                  value={quantityInMeters}
                  onChange={(e) => setQuantityInMeters(e.value)}
                  placeholder="Quantity in Meters"
                  options={[
                    { label: "No", value: "no" },
                    { label: "Yes", value: "yes" },
                  ]}
                  className="w-15rem"
                />

                <label htmlFor="quantityInMeters">Quantity in Meters?</label>
              </FloatLabel>
              <FloatLabel className="flex-1 always-float">
                <Dropdown
                  value={clothType}
                  onChange={(e) => setClothType(e.value)}
                  placeholder="Select Type"
                  options={[
                    { label: "Sarees", value: "sarees" },
                    { label: "Ready Made", value: "readymade" },
                  ]}
                  className="w-15rem"
                />
                <label htmlFor="clothType">Cloth Type</label>
              </FloatLabel>
            </div>
          </div>
        }
        visible={showGRNDialog}
        style={{ width: "100vw", height: "100vh" }}
        modal
        maximizable
        onHide={() => setShowGRNDialog(false)}
      >
        <ProductGRNDialog
          selectedPO={selectedPO}
          receivedQty={receivedQty}
          quantityInMeters={quantityInMeters}
          clothType={clothType}
          closeDialog={() => setShowGRNDialog(false)}
          onGRNSave={handleGRNSave}
        />
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
          bundleDetails={bundleDetails}
          closeDialog={() => setShowInvoiceDialog(false)}
        />
      </Dialog>
    </div>
  );
};

export default PurchaseOrderGRN;
