import React, { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { Dropdown, type DropdownChangeEvent } from "primereact/dropdown";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { InputNumber } from "primereact/inputnumber";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { Check, Eye, Pencil, Trash2 } from "lucide-react";

import { fetchPurchaseOrderList } from "../../08-PurchaseOrderComponents/PurchaseOrderList/PurchaseOrderList.function";
import { fetchSupplier } from "../../08-PurchaseOrderComponents/PurchaseOrderCreate/PurchaseOrderCreate.function";
import type { PurchaseOrderListItem } from "../../08-PurchaseOrderComponents/PurchaseOrderList/PurchaseOrderList.interface";
import type { Supplier } from "../../08-PurchaseOrderComponents/PurchaseOrderCreate/PurchaseOrderCreate.interface";
import BundlePreviewData from "../BundlePreviewData/BundlePreviewData";

type BillItem = {
  _id: number;
  billDate: Date | null;
  billNo: string;
  billQty: number;
  taxableValue: number;
  taxPercent: number;
  taxAmount: number;
  invoiceValue: number;
};

const receivingTypeOptions = [
  { name: "Done", code: "done" },
  { name: "Partial", code: "partial" },
  { name: "Sample", code: "sample" },
];

const bundleStatusOptions = [
  { name: "Open", code: "open" },
  { name: "Un Open", code: "unopen" },
];

const AddEditBundleInwards: React.FC = () => {
  const toast = useRef<Toast | null>(null);

  // master data
  const [poDetails, setPODetails] = useState<PurchaseOrderListItem[]>([]);
  const [supplierDetails, setSupplierDetails] = useState<Supplier[]>([]);
  const [_loading, setLoading] = useState(false);

  // form state
  const [formData, setFormData] = useState({
    poId: null as number | null,
    poDate: null as Date | null,
    supplierId: null as number | null,
    location: "",
    poValue: 0,
    receivingType: "",
    remarks: "",
    poQty: 0,
    boxCount: 0,
    // bill
    billList: [] as BillItem[],
    billForm: {
      _id: Date.now(),
      billDate: null,
      billNo: "",
      billQty: 0,
      taxableValue: 0,
      taxPercent: 0,
      taxAmount: 0,
      invoiceValue: 0,
    } as BillItem,
    // grn
    grnDate: null as Date | null,
    grnStatus: "",
    grnValue: 0,
    bundleStatus: "",
    transporterName: "",
    createdDate: null as Date | null,
  });

  // preview dialog
  const [previewVisible, setPreviewVisible] = useState(false);

  // load master data
  const load = async () => {
    setLoading(true);
    try {
      const po = await fetchPurchaseOrderList();
      const suppliers = await fetchSupplier();
      setPODetails(po);
      setSupplierDetails(suppliers);
    } catch (err: any) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: err?.message || "Failed to load data",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // ------ Helpers -------
  const resetBillForm = () => ({
    _id: Date.now(),
    billDate: null,
    billNo: "",
    billQty: 0,
    taxableValue: 0,
    taxPercent: 0,
    taxAmount: 0,
    invoiceValue: 0,
  });

  // When user selects a PO, autofill fields
  const handlePOChange = (e: DropdownChangeEvent) => {
    const poId = e.value as number;
    const selected = poDetails.find((p) => p.id === poId);
    if (!selected) return;

    const _supplier = supplierDetails.find(
      (s) => s.supplierId === selected.supplierId
    );

    const createdAtDate = selected.createdAt
      ? new Date(selected.createdAt)
      : null;

    setFormData((prev) => ({
      ...prev,
      poId: selected.id,
      poDate: createdAtDate,
      supplierId: selected.supplierId,
      location: selected?.refBranchCode ?? "",
      poValue: Number(selected.total) || 0,
      poQty: selected.totalorderedqty || 0,
      receivingType: prev.receivingType || "done",
    }));
  };

  // Update generic field
  const updateField = (key: string, value: any) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  // Update nested bill form and auto-calc tax/invoice
  const updateBillField = (key: keyof BillItem, value: any) => {
    const updated: BillItem = {
      ...formData.billForm,
      [key]: value,
    } as BillItem;

    const taxable = Number(updated.taxableValue || 0);
    const tax = Number(updated.taxPercent || 0);
    const taxAmount = +(taxable * (tax / 100));
    const invoiceValue = +(taxable + taxAmount);

    updated.taxAmount = +taxAmount;
    updated.invoiceValue = +invoiceValue;

    setFormData((prev) => ({ ...prev, billForm: updated }));
  };

  // Save (add) bill entry
  const saveBillEntry = () => {
    const bill = { ...formData.billForm };
    // basic validation for bill
    if (!bill.billNo) {
      toast.current?.show({
        severity: "warn",
        summary: "Validation",
        detail: "Enter Bill No.",
      });
      return;
    }

    // If editing existing row (match _id)
    const exists = formData.billList.find((b) => b._id === bill._id);
    if (exists) {
      const newList = formData.billList.map((b) =>
        b._id === bill._id ? bill : b
      );
      setFormData((prev) => ({
        ...prev,
        billList: newList,
        billForm: resetBillForm(),
      }));
      toast.current?.show({
        severity: "success",
        summary: "Updated",
        detail: "Bill updated",
      });
      return;
    }

    // New entry
    bill._id = Date.now();
    setFormData((prev) => ({
      ...prev,
      billList: [...prev.billList, bill],
      billForm: resetBillForm(),
    }));
    toast.current?.show({
      severity: "success",
      summary: "Saved",
      detail: "Bill added",
    });
  };

  const editBill = (row: BillItem) => {
    setFormData((prev) => ({ ...prev, billForm: { ...row } }));
    window.scrollTo({ top: 0, behavior: "smooth" }); // bring inputs into view
  };

  const deleteBill = (row: BillItem) => {
    const filtered = formData.billList.filter((b) => b._id !== row._id);
    setFormData((prev) => ({ ...prev, billList: filtered }));
    toast.current?.show({
      severity: "info",
      summary: "Deleted",
      detail: "Bill removed",
    });
  };

  const handleSaveAll = async () => {
    if (!formData.poId) {
      toast.current?.show({
        severity: "error",
        summary: "Validation",
        detail: "Please select PO",
      });
      return;
    }

    const payload = {
      poId: formData.poId,
      poDetails: {
        poDate: formData.poDate,
        supplierId: formData.supplierId,
        location: formData.location,
        poValue: +formData.poValue,
        receivingType: formData.receivingType,
        remarks: formData.remarks,
        poQty: +formData.poQty,
        boxCount: +formData.boxCount,
      },
      bills: formData.billList.map((b) => ({
        billDate: b.billDate,
        billNo: b.billNo,
        billQty: +b.billQty,
        taxableValue: +b.taxableValue,
        taxPercent: +b.taxPercent,
        taxAmount: +b.taxAmount,
        invoiceValue: +b.invoiceValue,
      })),
      grnDetails: {
        grnDate: formData.grnDate,
        grnStatus: formData.grnStatus,
        grnValue: +formData.grnValue,
        bundleStatus: formData.bundleStatus,
        transporterName: formData.transporterName,
        createdDate: formData.createdDate,
      },
    };

    console.log("Payload to send:", payload);

    toast.current?.show({
      severity: "success",
      summary: "Saved",
      detail: "Payload prepared and logged to console (replace with API)",
    });
  };

  const billDateBody = (row: BillItem) =>
    row.billDate ? new Date(row.billDate).toLocaleDateString() : "-";

  const billActions = (row: BillItem) => (
    <div className="flex gap-2">
      <Button icon={<Pencil />} onClick={() => editBill(row)} />
      <Button
        icon={<Trash2 />}
        severity="danger"
        onClick={() => deleteBill(row)}
      />
    </div>
  );

  return (
    <div className="">
      <Toast ref={toast} />

      <div className="flex flex-col">
        <p className="font-bold uppercase underline">PO Basic Details</p>

        <div className="flex mt-3 gap-3">
          <div className="flex-1">
            <FloatLabel className="always-float">
              <Dropdown
                optionLabel="po_number"
                className="w-full"
                options={poDetails}
                optionValue="id"
                onChange={handlePOChange}
                value={formData.poId}
              />
              <label>PO Number</label>
            </FloatLabel>
          </div>

          <div className="flex-1">
            <FloatLabel className="always-float">
              <Calendar
                showIcon
                value={formData.poDate}
                onChange={(e) => updateField("poDate", e.value)}
                className="w-full"
              />
              <label>PO Date</label>
            </FloatLabel>
          </div>

          <div className="flex-1">
            <FloatLabel className="always-float">
              <Dropdown
                options={supplierDetails}
                optionLabel="supplierName"
                optionValue="supplierId"
                className="w-full"
                value={formData.supplierId}
                onChange={(e) => updateField("supplierId", e.value)}
              />
              <label>Supplier</label>
            </FloatLabel>
          </div>
        </div>

        <div className="flex mt-3 gap-3">
          <div className="flex-1">
            <FloatLabel className="always-float">
              <InputText
                className="w-full"
                value={formData.location}
                onChange={(e) => updateField("location", e.target.value)}
              />
              <label>Location</label>
            </FloatLabel>
          </div>

          <div className="flex-1">
            <FloatLabel className="always-float">
              <InputNumber
                mode="decimal"
                value={formData.poValue}
                onValueChange={(e) => updateField("poValue", e.value)}
                className="w-full"
              />
              <label>PO Value</label>
            </FloatLabel>
          </div>

          <div className="flex-1">
            <FloatLabel className="always-float">
              <Dropdown
                optionLabel="name"
                options={receivingTypeOptions}
                className="w-full"
                value={formData.receivingType}
                onChange={(e) =>
                  updateField("receivingType", e.value?.code ?? e.value)
                }
              />
              <label>Receiving Type</label>
            </FloatLabel>
          </div>
        </div>

        <div className="flex mt-3 gap-3">
          <div className="flex-1">
            <FloatLabel className="always-float">
              <InputText
                value={formData.remarks}
                onChange={(e) => updateField("remarks", e.target.value)}
                className="w-full"
              />
              <label>Remarks</label>
            </FloatLabel>
          </div>

          <div className="flex-1">
            <FloatLabel className="always-float">
              <InputNumber
                value={formData.poQty}
                onValueChange={(e) => updateField("poQty", e.value)}
                className="w-full"
              />
              <label>PO Qnty</label>
            </FloatLabel>
          </div>

          <div className="flex-1">
            <FloatLabel className="always-float">
              <InputNumber
                mode="decimal"
                minFractionDigits={2}
                value={formData.boxCount}
                onValueChange={(e) => updateField("boxCount", e.value)}
                className="w-full"
              />
              <label>Box Count</label>
            </FloatLabel>
          </div>
        </div>

        <Divider />

        {/* ---------------- Bill Entry ---------------- */}
        <p className="font-bold uppercase underline">Bill Entry</p>

        <div className="flex mt-3 gap-3">
          <div className="flex-1">
            <FloatLabel className="always-float">
              <Calendar
                showIcon
                value={formData.billForm.billDate}
                onChange={(e) => updateBillField("billDate", e.value)}
                className="w-full"
              />
              <label>Bill Date</label>
            </FloatLabel>
          </div>

          <div className="flex-1">
            <FloatLabel className="always-float">
              <InputText
                value={formData.billForm.billNo}
                onChange={(e) => updateBillField("billNo", e.target.value)}
                className="w-full"
              />
              <label>Bill No</label>
            </FloatLabel>
          </div>

          <div className="flex-1">
            <FloatLabel className="always-float">
              <InputNumber
                mode="decimal"
                value={formData.billForm.billQty}
                onValueChange={(e) => updateBillField("billQty", e.value)}
                className="w-full"
              />
              <label>Bill Qnty</label>
            </FloatLabel>
          </div>

          <div className="flex-1">
            <FloatLabel className="always-float">
              <InputNumber
                mode="decimal"
                value={formData.billForm.taxableValue}
                onValueChange={(e) => updateBillField("taxableValue", e.value)}
                className="w-full"
              />
              <label>Taxable Value</label>
            </FloatLabel>
          </div>
        </div>

        <div className="flex mt-3 gap-3">
          <div className="flex-1">
            <FloatLabel className="always-float">
              <InputNumber
                mode="decimal"
                value={formData.billForm.taxPercent}
                onValueChange={(e) => updateBillField("taxPercent", e.value)}
                className="w-full"
              />
              <label>Tax %</label>
            </FloatLabel>
          </div>

          <div className="flex-1">
            <FloatLabel className="always-float">
              <InputNumber
                mode="decimal"
                value={formData.billForm.taxAmount}
                className="w-full"
                readOnly
              />
              <label>Tax Amount (Auto)</label>
            </FloatLabel>
          </div>

          <div className="flex-1">
            <FloatLabel className="always-float">
              <InputNumber
                mode="decimal"
                value={formData.billForm.invoiceValue}
                className="w-full"
                readOnly
              />
              <label>Invoice Value (Auto)</label>
            </FloatLabel>
          </div>

          <div className="flex-1 flex items-end">
            <Button
              className="w-full"
              label={
                formData.billList.some((b) => b._id === formData.billForm._id)
                  ? "Update"
                  : "Add"
              }
              icon={<Check />}
              onClick={saveBillEntry}
            />
          </div>
        </div>

        <Divider />

        {/* Bill list table */}
        <DataTable value={formData.billList} showGridlines stripedRows>
          <Column
            header="SNo"
            body={(_, opts) => opts.rowIndex + 1}
            style={{ width: "60px" }}
          />
          <Column header="Bill Date" body={billDateBody} />
          <Column header="Bill No" field="billNo" />
          <Column header="Bill Qnty" field="billQty" />
          <Column header="Taxable Value" field="taxableValue" />
          <Column header="Tax %" field="taxPercent" />
          <Column header="Tax Amount" field="taxAmount" />
          <Column header="Invoice Value" field="invoiceValue" />
          <Column
            header="Actions"
            body={billActions}
            style={{ width: "150px" }}
          />
        </DataTable>

        <Divider />

        {/* GRN Details */}
        <p className="font-bold uppercase underline">GRN Details</p>

        <div className="flex mt-3 gap-3">
          <div className="flex-1">
            <FloatLabel className="always-float">
              <Calendar
                showIcon
                value={formData.grnDate}
                onChange={(e) => updateField("grnDate", e.value)}
                className="w-full"
              />
              <label>GRN Date</label>
            </FloatLabel>
          </div>

          <div className="flex-1">
            <FloatLabel className="always-float">
              <InputText
                value={formData.grnStatus}
                onChange={(e) => updateField("grnStatus", e.target.value)}
                className="w-full"
              />
              <label>GRN Status</label>
            </FloatLabel>
          </div>

          <div className="flex-1">
            <FloatLabel className="always-float">
              <InputNumber
                mode="decimal"
                value={formData.grnValue}
                onValueChange={(e) => updateField("grnValue", e.value)}
                className="w-full"
              />
              <label>GRN Value</label>
            </FloatLabel>
          </div>
        </div>

        <div className="flex mt-3 gap-3">
          <div className="flex-1">
            <FloatLabel className="always-float">
              <Dropdown
                optionLabel="name"
                options={bundleStatusOptions}
                className="w-full"
                value={formData.bundleStatus}
                onChange={(e) =>
                  updateField("bundleStatus", e.value?.code ?? e.value)
                }
              />
              <label>Bundle Status</label>
            </FloatLabel>
          </div>

          <div className="flex-1">
            <FloatLabel className="always-float">
              <InputText
                value={formData.transporterName}
                onChange={(e) => updateField("transporterName", e.target.value)}
                className="w-full"
              />
              <label>Transporter Name</label>
            </FloatLabel>
          </div>

          <div className="flex-1">
            <FloatLabel className="always-float">
              <Calendar
                showIcon
                value={formData.createdDate}
                onChange={(e) => updateField("createdDate", e.value)}
                className="w-full"
              />
              <label>Created Date</label>
            </FloatLabel>
          </div>
        </div>

        {/* bottom action bar */}
        <div className="fixed flex justify-end gap-3 bottom-0 left-0 w-full shadow-md p-4 z-10">
          <Button
            label="Preview"
            icon={<Eye />}
            className="bg-[#8e5ea8] border-none gap-2"
            onClick={() => setPreviewVisible(true)}
          />
          <Button
            label="Save"
            icon={<Check />}
            className="bg-[#8e5ea8] border-none gap-2"
            onClick={handleSaveAll}
          />
        </div>
      </div>

      <Dialog
        header="Preview Bundle Inward"
        visible={previewVisible}
        style={{ width: "70vw" }}
        onHide={() => setPreviewVisible(false)}
      >
        <BundlePreviewData />
      </Dialog>
    </div>
  );
};

export default AddEditBundleInwards;
