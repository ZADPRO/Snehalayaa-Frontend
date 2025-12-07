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
import type {
  AddEditProps,
  BillItem,
  FormState,
} from "./AddEditBundleInwards.interface";
import { createBundle, updateBundle } from "./AddEditBundleInwards.function";

const receivingTypeOptions = [
  { name: "Done", code: "done" },
  { name: "Partial", code: "partial" },
  { name: "Sample", code: "sample" },
];

const bundleStatusOptions = [
  { name: "Open", code: "open" },
  { name: "Un Open", code: "unopen" },
];

const AddEditBundleInwards: React.FC<AddEditProps> = ({
  editData,
  onSuccess,
}) => {
  console.log("editData", editData);
  const toast = useRef<Toast | null>(null);
  const isEditMode = Boolean(editData);

  const [poDetails, setPODetails] = useState<PurchaseOrderListItem[]>([]);
  const [supplierDetails, setSupplierDetails] = useState<Supplier[]>([]);

  const [qtyDialogVisible, setQtyDialogVisible] = useState(false);
  const [pendingBillData, setPendingBillData] = useState<BillItem | null>(null);

  const [formData, setFormData] = useState<FormState>({
    poId: null,
    poDate: null,
    supplierId: null,
    location: "",
    poValue: 0,
    receivingType: "",
    remarks: "",
    poQty: 0,
    boxCount: 0,

    billList: [],
    billForm: {
      _id: null,
      billDate: null,
      billNo: "",
      billQty: 0,
      taxableValue: 0,
      taxPercent: 0,
      taxAmount: 0,
      invoiceValue: 0,
    },

    grnDate: null,
    grnStatus: "",
    grnValue: 0,
    bundleStatus: "",
    transporterName: "",
    createdDate: null,
  });

  const [previewVisible, setPreviewVisible] = useState(false);

  const load = async () => {
    try {
      const po = await fetchPurchaseOrderList();
      const suppliers = await fetchSupplier();
      setPODetails(po || []);
      setSupplierDetails(suppliers || []);
    } catch (err: any) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: err?.message || "Failed to load data",
      });
    }
  };

  useEffect(() => {
    load();
  }, []);

  const resetBillForm = (): FormState["billForm"] => ({
    _id: null,
    billDate: null,
    billNo: "",
    billQty: 0,
    taxableValue: 0,
    taxPercent: 0,
    taxAmount: 0,
    invoiceValue: 0,
  });

  const updateField = (key: keyof FormState, value: any) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  const handlePOChange = (e: DropdownChangeEvent) => {
    const poId = e.value as number;
    const selected = poDetails.find((p) => p.id === poId);
    if (!selected) return;

    const createdAtDate = selected.createdAt
      ? new Date(selected.createdAt)
      : null;

    setFormData((prev) => ({
      ...prev,
      poId: selected.id,
      poDate: createdAtDate,
      supplierId: selected.supplierId,
      poValue: Number(selected.total) || 0,
      location: selected.supplierCity,
      poQty: selected.totalorderedqty || 0,
      receivingType: prev.receivingType ?? "",
    }));
  };

  const updateBillField = (key: keyof BillItem, value: any) => {
    setFormData((prev) => {
      const updated = {
        ...prev.billForm,
        [key]: value,
      } as BillItem & { _id: number | null };

      const taxable = Number(updated.taxableValue || 0);
      const tax = Number(updated.taxPercent || 0);
      const taxAmount = +(taxable * (tax / 100));
      const invoiceValue = +(taxable + taxAmount);

      updated.taxAmount = +taxAmount;
      updated.invoiceValue = +invoiceValue;

      return { ...prev, billForm: updated };
    });
  };

  const applyBillSave = (bill: BillItem) => {
    if (bill._id !== null) {
      // EDIT MODE
      setFormData((prev) => {
        const updatedList = prev.billList.map((b) =>
          b._id === bill._id ? bill : b
        );
        return { ...prev, billList: updatedList, billForm: resetBillForm() };
      });

      toast.current?.show({
        severity: "success",
        summary: "Updated",
        detail: "Bill updated",
      });
    } else {
      // ADD MODE
      const newBill = { ...bill, _id: Date.now() };
      setFormData((prev) => ({
        ...prev,
        billList: [...prev.billList, newBill],
        billForm: resetBillForm(),
      }));

      toast.current?.show({
        severity: "success",
        summary: "Saved",
        detail: "Bill added",
      });
    }
  };

  const saveBillEntry = () => {
    const bill = { ...formData.billForm };

    if (!bill.billNo?.trim()) {
      toast.current?.show({
        severity: "warn",
        summary: "Validation",
        detail: "Enter Bill No.",
      });
      return;
    }

    const poQty = Number(formData.poQty || 0);

    // sum of already added bill quantities (exclude same record when editing)
    const existingQty = formData.billList
      .filter((b) => b._id !== bill._id)
      .reduce((sum, b) => sum + Number(b.billQty), 0);

    const newTotal = existingQty + Number(bill.billQty);

    if (newTotal > poQty) {
      // open dialog
      setPendingBillData(bill);
      setQtyDialogVisible(true);
      return;
    }

    // quantity within limit → directly save
    applyBillSave(bill);
  };

  const editBill = (row: BillItem) => {
    setFormData((prev) => ({ ...prev, billForm: { ...row } as any }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteBill = (row: BillItem) => {
    setFormData((prev) => ({
      ...prev,
      billList: prev.billList.filter((b) => b._id !== row._id),
    }));
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
      id: editData?.inward_id ?? null,
      poId: formData.poId,

      poDetails: {
        poDate: formData.poDate ? String(formData.poDate) : "",
        supplierId: formData.supplierId,
        location: String(formData.location ?? ""),
        poValue: String(formData.poValue ?? "0"),
        receivingType: String(formData.receivingType ?? ""),
        remarks: String(formData.remarks ?? ""),
        poQty: String(formData.poQty ?? "0"),
        boxCount: String(formData.boxCount ?? "0"),
      },

      bills: formData.billList.map((b) => ({
        billDate: b.billDate ? String(b.billDate) : "",
        billNo: String(b.billNo ?? ""),
        billQty: String(b.billQty ?? "0"),
        taxableValue: String(b.taxableValue ?? "0"),
        taxPercent: String(b.taxPercent ?? "0"),
        taxAmount: String(b.taxAmount ?? "0"),
        invoiceValue: String(b.invoiceValue ?? "0"),
      })),

      grnDetails: {
        grnDate: formData.grnDate ? String(formData.grnDate) : "",
        grnStatus: String(formData.grnStatus ?? ""),
        grnValue: String(formData.grnValue ?? "0"),
        bundleStatus: String(formData.bundleStatus ?? ""),
        transporterName: String(formData.transporterName ?? ""),
        createdDate: formData.createdDate ? String(formData.createdDate) : "",
      },
    };

    console.log("Payload to send:", payload);

    try {
      let result;

      if (isEditMode) {
        // ⬅️ UPDATE
        result = await updateBundle(payload);
        toast.current?.show({
          severity: "success",
          summary: "Updated",
          detail: "Bundle updated successfully",
        });
      } else {
        // ⬅️ CREATE
        result = await createBundle(payload);
        toast.current?.show({
          severity: "success",
          summary: "Saved",
          detail: "Bundle created successfully",
        });
      }

      console.log("API Result:", result);
      onSuccess();
    } catch (err: any) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: err?.message || "Something went wrong",
      });
    }
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

  useEffect(() => {
    if (editData) {
      const formattedBills: BillItem[] = (editData.bills || []).map(
        (b: any) => ({
          _id: b.id ?? Date.now(),
          billDate: b.bill_date ? new Date(b.bill_date) : null,
          billNo: b.bill_no ?? "",
          billQty: Number(b.bill_qty ?? 0),
          taxableValue: Number(b.taxable_value ?? 0),
          taxPercent: Number(b.tax_percent ?? 0),
          taxAmount: Number(b.tax_amount ?? 0),
          invoiceValue: Number(b.invoice_value ?? 0),
        })
      );

      setFormData({
        poId: editData.po_id || null,
        poDate: editData.po_date ? new Date(editData.po_date) : null,
        supplierId: editData.supplier_id,
        location: editData.location,
        poValue: Number(editData.total),
        receivingType: editData.receiving_type,
        remarks: editData.remarks,
        poQty: Number(editData.po_qty),
        boxCount: Number(editData.box_count),

        billList: formattedBills, // ← FIXED

        billForm: resetBillForm(),

        grnDate: editData.grn_date ? new Date(editData.grn_date) : null,
        grnStatus: editData.grn_status,
        grnValue: Number(editData.grn_value ?? 0), // ← FIXED
        bundleStatus: editData.bundle_status,
        transporterName: editData.transporter_name,
        createdDate: editData.created_date
          ? new Date(editData.created_date)
          : null,
      });
    }
  }, [editData]);

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
                minFractionDigits={2}
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
                optionValue="code"
                options={receivingTypeOptions}
                className="w-full"
                value={formData.receivingType}
                onChange={(e) => updateField("receivingType", e.value)}
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
                mode="decimal"
                minFractionDigits={2}
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
                minFractionDigits={2}
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
                minFractionDigits={2}
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
                minFractionDigits={2}
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
                minFractionDigits={2}
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
                minFractionDigits={2}
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
              label={formData.billForm._id !== null ? "Update" : "Add"}
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
                minFractionDigits={2}
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
                optionValue="code"
                options={bundleStatusOptions}
                className="w-full"
                value={formData.bundleStatus}
                onChange={(e) => updateField("bundleStatus", e.value)}
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
            label={isEditMode ? "Update" : "Save"}
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
        <BundlePreviewData
          data={formData}
          poList={poDetails}
          supplierList={supplierDetails}
        />
      </Dialog>

      <Dialog
        header="Quantity Exceeded"
        visible={qtyDialogVisible}
        style={{ width: "25rem" }}
        onHide={() => setQtyDialogVisible(false)}
      >
        <p className="mb-4 text-red-500 font-semibold">
          The quantity entered is more than ordered. Do you want to proceed?
        </p>

        <div className="flex justify-end gap-3">
          <Button
            label="Cancel"
            severity="secondary"
            onClick={() => {
              setQtyDialogVisible(false);
              setPendingBillData(null);
            }}
          />
          <Button
            label="Proceed"
            onClick={() => {
              if (pendingBillData) {
                applyBillSave(pendingBillData);
              }
              setQtyDialogVisible(false);
              setPendingBillData(null);
            }}
            autoFocus
          />
        </div>
      </Dialog>
    </div>
  );
};

export default AddEditBundleInwards;
