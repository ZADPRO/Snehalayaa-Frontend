import { Check, Pencil, Trash2 } from "lucide-react";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { InputSwitch } from "primereact/inputswitch";
import React, { useEffect, useRef, useState } from "react";

import {
  fetchBranch,
  fetchCategories,
  fetchSubCategories,
  fetchSupplier,
  calculateLineTotal,
  validateLine,
  showToastMsg,
  createPurchaseOrder,
} from "./PurchaseOrderCreate.function";

import type {
  Branch,
  Category,
  SubCategory,
  Supplier,
  LineItem,
} from "./PurchaseOrderCreate.interface";

const taxOptions = [0, 2, 2.5, 5, 8, 12, 18].map((v) => ({
  label: `${v}%`,
  value: v,
}));

const PurchaseOrderCreate: React.FC = () => {
  const toast = useRef<Toast>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [supplierDetails, setSupplierDetails] = useState<Supplier[]>([]);
  const [branchDetails, setBranchDetails] = useState<Branch[]>([]);
  const [categoryDetails, setCategoryDetails] = useState<Category[]>([]);
  const [subCategoryDetails, setSubCategoryDetails] = useState<SubCategory[]>(
    []
  );

  const [selectedSupplierId, setSelectedSupplierId] = useState<number | null>(
    null
  );
  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [filteredSubCategories, setFilteredSubCategories] = useState<
    SubCategory[]
  >([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState<number | null>(
    null
  );

  const [productDescription, setProductDescription] = useState<string>("");
  const [unitPrice, setUnitPrice] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [discountPercent, setDiscountPercent] = useState<string>("");

  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Incremental ID for frontend rows
  const [lineId, setLineId] = useState(1);

  const [taxEnabled, setTaxEnabled] = useState<boolean>(false);
  const [taxRate, setTaxRate] = useState<number>(0);

  const [paymentFee, setPaymentFee] = useState<string>("0");
  const [shippingFee, setShippingFee] = useState<string>("0");

  // After a successful PO save
  const [poLocked, setPoLocked] = useState(false);
  const [poNumber, setPoNumber] = useState<string | null>(null);
  console.log("poNumber", poNumber);

  const load = async () => {
    setLoading(true);
    try {
      setSupplierDetails(await fetchSupplier());
      setBranchDetails(await fetchBranch());
      setCategoryDetails(await fetchCategories());
      setSubCategoryDetails(await fetchSubCategories());
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

  // Filter subcategories based on selected category
  useEffect(() => {
    if (selectedCategory) {
      const filtered = subCategoryDetails.filter(
        (sub) => sub.refCategoryId === selectedCategory
      );
      setFilteredSubCategories(filtered);
      setSelectedSubCategory(null);
    } else {
      setFilteredSubCategories([]);
      setSelectedSubCategory(null);
    }
  }, [selectedCategory, subCategoryDetails]);

  // Numeric input helper
  const handleNumeric =
    (setter: (val: string) => void) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      if (v === "" || /^[0-9]*\.?[0-9]*$/.test(v)) {
        setter(v);
      }
    };

  const resetForm = () => {
    setSelectedCategory(null);
    setSelectedSubCategory(null);
    setProductDescription("");
    setUnitPrice("");
    setQuantity("");
    setDiscountPercent("");
    setEditingId(null);
  };

  const handleAddOrUpdate = () => {
    const validation = validateLine({
      selectedCategory,
      selectedSubCategory,
      productDescription,
      unitPrice,
      quantity,
      discountPercent,
    });

    if (!validation.valid) {
      showToastMsg(toast, "warn", "Validation", validation.message || "");
      return;
    }

    const { uPrice, qty, disc, discountAmount, total } = calculateLineTotal(
      unitPrice,
      quantity,
      discountPercent
    );

    const baseData = {
      categoryId: selectedCategory!,
      subCategoryId: selectedSubCategory!,
      productDescription: productDescription.trim(),
      unitPrice: uPrice,
      quantity: qty,
      discountPercent: disc,
      discountAmount,
      total,
    };

    if (editingId !== null) {
      setLineItems((prev) =>
        prev.map((row) =>
          row.id === editingId ? { ...row, ...baseData } : row
        )
      );
      resetForm();
      return;
    }

    const newItem: LineItem = {
      id: lineId,
      locked: false,
      ...baseData,
    };

    setLineItems((prev) => [...prev, newItem]);
    setLineId((prev) => prev + 1);
    resetForm();
  };

  const handleEditRow = (row: LineItem) => {
    if (row.locked) {
      showToastMsg(
        toast,
        "warn",
        "Locked",
        "This row is locked and cannot be edited."
      );
      return;
    }

    setSelectedCategory(row.categoryId);

    // Wait a tick so filteredSubCategories updates based on category
    setTimeout(() => {
      setSelectedSubCategory(row.subCategoryId);
    }, 10);

    setProductDescription(row.productDescription);
    setUnitPrice(row.unitPrice.toString());
    setQuantity(row.quantity.toString());
    setDiscountPercent(row.discountPercent.toString());

    setEditingId(row.id);
  };

  const handleDeleteRow = (rowId: number) => {
    setLineItems((prev) => prev.filter((item) => item.id !== rowId));
    showToastMsg(toast, "success", "Deleted", "Line item deleted");
  };

  // Summary calculations
  const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0);
  const numericPaymentFee = parseFloat(paymentFee) || 0;
  const numericShippingFee = parseFloat(shippingFee) || 0;
  const taxAmount = taxEnabled ? (subtotal * taxRate) / 100 : 0;
  const grandTotal =
    subtotal + taxAmount + numericPaymentFee + numericShippingFee;
  const roundOff = Math.round(grandTotal) - grandTotal;
  const totalRounded = grandTotal + roundOff;

  const selectedSupplier = supplierDetails.find(
    (s) => s.supplierId === selectedSupplierId
  );
  const selectedBranch = branchDetails.find(
    (b) => b.refBranchId === selectedBranchId
  );

  const handleSave = async () => {
    if (!selectedSupplierId || !selectedBranchId) {
      showToastMsg(
        toast,
        "warn",
        "Validation",
        "Please select Supplier & Branch"
      );
      return;
    }
    if (lineItems.length === 0) {
      showToastMsg(
        toast,
        "warn",
        "Validation",
        "Please add at least one line item"
      );
      return;
    }

    const payload = {
      supplierId: selectedSupplierId,
      branchId: selectedBranchId,
      taxEnabled,
      taxRate,
      paymentFee: numericPaymentFee,
      shippingFee: numericShippingFee,
      subtotal,
      taxAmount,
      roundOff,
      total: totalRounded,
      items: lineItems.map((item) => ({
        categoryId: item.categoryId,
        subCategoryId: item.subCategoryId,
        productDescription: item.productDescription,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        discountPercent: item.discountPercent,
        discountAmount: item.discountAmount,
        total: item.total,
      })),
    };

    try {
      setLoading(true);

      const result = await createPurchaseOrder(payload);
      console.log("📦 Purchase Order Created:", result);

      setPoNumber(result.data.poNumber);
      setPoLocked(true);

      showToastMsg(toast, "success", "Success", "Purchase Order Created!");
    } catch (err: any) {
      showToastMsg(
        toast,
        "error",
        "Error",
        err.message || "Failed to create PO"
      );
    } finally {
      setLoading(false);
    }
  };

  const getCategoryName = (id: number) =>
    categoryDetails.find((c) => c.refCategoryId === id)?.categoryName || "-";

  const getSubCategoryName = (id: number) =>
    subCategoryDetails.find((s) => s.refSubCategoryId === id)
      ?.subCategoryName || "-";

  return (
    <div className="flex gap-2 w-full">
      <Toast ref={toast} />
      <div className="w-[75%] flex flex-col gap-2">
        {/* Top Supplier + Branch row */}
        <div className="flex items-center justify-between bg-white py-3 px-4 rounded-md shadow">
          <div className="flex gap-2">
            <div>
              <Dropdown
                placeholder="Suppliers"
                className="w-[14rem]"
                options={supplierDetails}
                optionLabel="supplierName"
                optionValue="supplierId"
                value={selectedSupplierId}
                disabled={poLocked}
                onChange={(e) => setSelectedSupplierId(e.value)}
              />
            </div>
            <div>
              <Dropdown
                placeholder="Branch"
                className="w-[14rem]"
                options={branchDetails}
                optionValue="refBranchId"
                optionLabel="refBranchName"
                value={selectedBranchId}
                disabled={poLocked}
                onChange={(e) => setSelectedBranchId(e.value)}
              />
            </div>
          </div>

          <div className="flex gap-2 items-center text-sm">
            <div className="flex gap-2">
              <p className="font-semibold">Credited Days</p>
              <p className="text-gray-600">
                {selectedSupplier?.creditedDays ?? 30} Days
              </p>
            </div>
            <span>|</span>
            <div className="flex gap-2">
              <p className="font-semibold">Payment Status</p>
              <p className="text-gray-600">Pending</p>
            </div>
            <span>|</span>
            <div className="flex gap-2">
              <p className="font-semibold">Due On</p>
              <p className="text-gray-600">29-11-2025</p>
            </div>
          </div>
        </div>

        {/* Line item entry + table */}
        <div className="bg-white p-4 rounded-md shadow min-h-[400px]">
          {/* Entry Row */}
          <div className="flex gap-3 items-center">
            <div className="flex-1">
              <Dropdown
                placeholder="Categories"
                className="w-full"
                options={categoryDetails}
                optionLabel="categoryName"
                optionValue="refCategoryId"
                value={selectedCategory}
                disabled={poLocked}
                onChange={(e) => setSelectedCategory(e.value)}
              />
            </div>
            <div className="flex-1">
              <Dropdown
                placeholder="Sub Categories"
                className="w-full"
                options={filteredSubCategories}
                optionLabel="subCategoryName"
                optionValue="refSubCategoryId"
                value={selectedSubCategory}
                disabled={poLocked}
                onChange={(e) => setSelectedSubCategory(e.value)}
              />
            </div>
            <div className="flex-1">
              <InputText
                placeholder="Product Description"
                className="w-full"
                value={productDescription}
                disabled={poLocked}
                onChange={(e) => setProductDescription(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <InputText
                placeholder="Unit Price"
                className="w-full"
                disabled={poLocked}
                value={unitPrice}
                onChange={handleNumeric(setUnitPrice)}
              />
            </div>
            <div className="flex-1">
              <InputText
                placeholder="Quantity"
                className="w-full"
                value={quantity}
                disabled={poLocked}
                onChange={handleNumeric(setQuantity)}
              />
            </div>
            <div className="flex-1">
              <InputText
                placeholder="Discount %"
                className="w-full"
                value={discountPercent}
                disabled={poLocked}
                onChange={handleNumeric(setDiscountPercent)}
              />
            </div>
            <Button
              icon={<Check size={18} />}
              onClick={handleAddOrUpdate}
              loading={loading}
              disabled={poLocked}
            />
          </div>

          {/* Table */}
          <div className="mt-3">
            <DataTable
              value={lineItems}
              dataKey="id"
              showGridlines
              stripedRows
              paginator
              rows={10}
              rowsPerPageOptions={[10, 30, 50]}
              emptyMessage="No items added"
            >
              <Column
                header="S.No"
                body={(_, options) => options.rowIndex + 1}
                style={{ width: "4rem" }}
              />
              <Column
                header="Category"
                body={(rowData: LineItem) =>
                  getCategoryName(rowData.categoryId)
                }
              />
              <Column
                header="Sub Category"
                body={(rowData: LineItem) =>
                  getSubCategoryName(rowData.subCategoryId)
                }
              />
              <Column header="Product Description" field="productDescription" />
              <Column
                header="Quantity"
                body={(rowData: LineItem) => rowData.quantity.toFixed(2)}
              />
              <Column
                header="Price"
                body={(rowData: LineItem) => rowData.unitPrice.toFixed(2)}
              />
              <Column
                header="Disc %"
                body={(rowData: LineItem) => rowData.discountPercent.toFixed(2)}
              />
              <Column
                header="Discount"
                body={(rowData: LineItem) => rowData.discountAmount.toFixed(2)}
              />
              <Column
                header="Total"
                body={(rowData: LineItem) => rowData.total.toFixed(2)}
              />
              <Column
                header="Edit"
                body={(rowData: LineItem) => (
                  <Button
                    icon={<Pencil size={16} />}
                    text
                    rounded
                    disabled={rowData.locked || poLocked}
                    onClick={() => handleEditRow(rowData)}
                  />
                )}
              />
              <Column
                header="Delete"
                body={(rowData: LineItem) => (
                  <Button
                    icon={<Trash2 size={16} />}
                    text
                    rounded
                    severity="danger"
                    disabled={poLocked}
                    onClick={() => handleDeleteRow(rowData.id)}
                  />
                )}
              />
            </DataTable>
          </div>
        </div>
      </div>

      {/* RIGHT 25% */}
      <div className="w-[25%] flex flex-col gap-2">
        {/* Supplier & Branch Details */}
        <div className="bg-white flex flex-col p-4 rounded-md shadow justify-between items-start gap-4">
          <div className="flex flex-col flex-1 w-full">
            <h4 className="font-semibold mb-3">Supplier Details</h4>
            <p>{selectedSupplier?.supplierCompanyName || "-"}</p>
            <p>{selectedSupplier?.supplierName || "-"}</p>
            <p>
              {selectedSupplier
                ? `${selectedSupplier.supplierDoorNumber || ""} ${
                    selectedSupplier.supplierStreet || ""
                  }`
                : "-"}
            </p>
            <p>
              {selectedSupplier
                ? `${selectedSupplier.supplierCity || ""}, ${
                    selectedSupplier.supplierState || ""
                  }`
                : "-"}
            </p>
            <p>
              {selectedSupplier
                ? `${selectedSupplier.supplierContactNumber || ""} | ${
                    selectedSupplier.supplierEmail || ""
                  }`
                : "-"}
            </p>
          </div>

          <div className="flex flex-col flex-1 w-full">
            <h4 className="font-semibold mb-3">Branch Details</h4>
            <p>Company Name</p>
            <p>{selectedBranch?.refBranchName || "-"}</p>
            <p>{selectedBranch?.refLocation || "-"}</p>
            <p>{selectedBranch ? `${selectedBranch.refMobile || ""}` : "-"}</p>
            <p>{selectedBranch ? `${selectedBranch.refEmail || ""}` : "-"}</p>
          </div>
        </div>

        {/* Tax + Actions + Fees */}
        <div className="bg-white p-4 rounded-md shadow flex flex-col gap-3">
          <div className="flex gap-2">
            <Button
              label="Save"
              className="flex-1"
              onClick={handleSave}
              disabled={poLocked || loading}
            />
            <Button label="Download" className="flex-1" disabled={!poLocked} />
            <Button label="Print" className="flex-1" disabled={!poLocked} />
          </div>

          {/* Tax toggle + dropdown */}
          <div className="flex items-center justify-between mt-2">
            <span>Tax Enabled</span>
            <InputSwitch
              checked={taxEnabled}
              onChange={(e) => setTaxEnabled(e.value)}
              disabled={poLocked}
            />
          </div>
          {taxEnabled && (
            <div className="mt-2">
              <Dropdown
                value={taxRate}
                options={taxOptions}
                onChange={(e) => setTaxRate(e.value)}
                className="w-full"
                disabled={poLocked}
                placeholder="Select Tax %"
              />
            </div>
          )}

          {/* Payment & Shipping Fee */}
          <div className="mt-3 flex flex-col gap-2">
            <div className="flex gap-2">
              <div className="flex-1">
                <span className="block text-xs text-gray-600 mb-1">
                  Payment Fee
                </span>
                <InputText
                  value={paymentFee}
                  onChange={handleNumeric(setPaymentFee)}
                  className="w-full"
                  disabled={poLocked}
                />
              </div>
              <div className="flex-1">
                <span className="block text-xs text-gray-600 mb-1">
                  Shipping Fee
                </span>
                <InputText
                  value={shippingFee}
                  onChange={handleNumeric(setShippingFee)}
                  className="w-full"
                  disabled={poLocked}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white p-4 rounded-md shadow text-sm">
          <h4 className="font-semibold mb-3">Summary</h4>

          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span>Tax {taxEnabled ? `(${taxRate}%)` : ""}</span>
            <span>₹{taxAmount.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span>Payment Fee</span>
            <span>₹{numericPaymentFee.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span>Shipping Fee</span>
            <span>₹{numericShippingFee.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span>Round Off</span>
            <span>₹{roundOff.toFixed(2)}</span>
          </div>

          <hr className="my-3" />

          <div className="flex justify-between text-base font-semibold">
            <span>Total</span>
            <span>₹{totalRounded.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-base mt-2 text-red-600 font-semibold">
            <span>Pending Payment</span>
            <span>₹{totalRounded.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrderCreate;
