import { Check, Pencil, Trash2 } from "lucide-react";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Divider } from "primereact/divider";
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
} from "./PurchaseOrderCreate.function";
import type {
  Branch,
  Category,
  SubCategory,
  Supplier,
} from "./PurchaseOrderCreate.interface";

interface LineItem {
  id: number;
  categoryId: number;
  subCategoryId: number;
  productDescription: string;
  unitPrice: number;
  quantity: number;
  discountPercent: number; // line-level %
  discountAmount: number;
  total: number;
  locked?: boolean; // for duplicate/merged rows
}

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
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [taxEnabled, setTaxEnabled] = useState<boolean>(false);
  const [taxRate, setTaxRate] = useState<number>(0);

  const [paymentFee, setPaymentFee] = useState<string>("0");
  const [shippingFee, setShippingFee] = useState<string>("0");

  const load = async () => {
    setLoading(true);
    try {
      const supplierDetails = await fetchSupplier();
      setSupplierDetails(supplierDetails);

      const branchDetails = await fetchBranch();
      setBranchDetails(branchDetails);

      const categoryDetails = await fetchCategories();
      setCategoryDetails(categoryDetails);

      const subCategoryDetails = await fetchSubCategories();
      setSubCategoryDetails(subCategoryDetails);
    } catch (err: any) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: err.message || "Failed to load data",
        life: 3000,
      });
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
      setSelectedSubCategory(null); // reset subcategory when category changes
    } else {
      setFilteredSubCategories([]);
      setSelectedSubCategory(null);
    }
  }, [selectedCategory, subCategoryDetails]);

  // Helpers
  const handleNumericChange =
    (setter: (val: string) => void) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
        setter(value);
      }
    };

  const resetLineForm = () => {
    setSelectedCategory(null);
    setSelectedSubCategory(null);
    setProductDescription("");
    setUnitPrice("");
    setQuantity("");
    setDiscountPercent("");
    setEditingIndex(null);
  };

  const showToast = (
    severity: "success" | "info" | "warn" | "error",
    summary: string,
    detail: string
  ) => {
    toast.current?.show({ severity, summary, detail, life: 2500 });
  };

  const handleAddOrUpdateLine = () => {
    if (!selectedCategory || !selectedSubCategory) {
      showToast("warn", "Validation", "Please select Category & Sub Category");
      return;
    }
    if (!productDescription.trim()) {
      showToast("warn", "Validation", "Please enter Product Description");
      return;
    }
    const uPrice = parseFloat(unitPrice);
    const qty = parseFloat(quantity);
    const disc = discountPercent ? parseFloat(discountPercent) : 0;

    if (isNaN(uPrice) || uPrice <= 0) {
      showToast("warn", "Validation", "Please enter valid Unit Price");
      return;
    }
    if (isNaN(qty) || qty <= 0) {
      showToast("warn", "Validation", "Please enter valid Quantity");
      return;
    }
    if (disc < 0) {
      showToast("warn", "Validation", "Discount cannot be negative");
      return;
    }

    const lineSubtotal = uPrice * qty;
    const discountAmount = (lineSubtotal * disc) / 100;
    const total = lineSubtotal - discountAmount;

    const baseData = {
      categoryId: selectedCategory,
      subCategoryId: selectedSubCategory,
      productDescription: productDescription.trim(),
      unitPrice: uPrice,
      quantity: qty,
      discountPercent: disc,
      discountAmount,
      total,
    };

    // Duplicate detection (same cat, subcat, desc, unit price)
    const duplicateIndex = lineItems.findIndex(
      (item) =>
        item.categoryId === baseData.categoryId &&
        item.subCategoryId === baseData.subCategoryId &&
        item.productDescription.toLowerCase() ===
          baseData.productDescription.toLowerCase() &&
        item.unitPrice === baseData.unitPrice
    );

    if (editingIndex !== null) {
      // Editing existing row
      const updated = [...lineItems];
      updated[editingIndex] = {
        ...updated[editingIndex],
        ...baseData,
        locked: updated[editingIndex].locked,
      };
      setLineItems(updated);
      console.log("Updated Line Items:", updated);
      showToast("success", "Updated", "Line item updated successfully");
      resetLineForm();
      return;
    }

    if (duplicateIndex !== -1) {
      // Same data again: merge with existing row and lock it
      const updated = [...lineItems];
      const existing = updated[duplicateIndex];
      const newQty = existing.quantity + qty;
      const newSubtotal = existing.unitPrice * newQty;
      const newDiscountAmount = (newSubtotal * existing.discountPercent) / 100;
      const newTotal = newSubtotal - newDiscountAmount;

      updated[duplicateIndex] = {
        ...existing,
        quantity: newQty,
        discountAmount: newDiscountAmount,
        total: newTotal,
        locked: true, // make it uneditable
      };

      setLineItems(updated);
      console.log("Merged Duplicate Line Items:", updated);
      showToast(
        "info",
        "Duplicate Merged",
        "Same product found, quantity merged & row locked"
      );
      resetLineForm();
      return;
    }

    // New line
    const newItem: LineItem = {
      id: Date.now(),
      locked: false,
      ...baseData,
    };

    const newList = [...lineItems, newItem];
    setLineItems(newList);
    console.log("Added Line Item:", newItem);
    showToast("success", "Added", "Line item added successfully");
    resetLineForm();
  };

  const handleEditRow = (rowData: LineItem, rowIndex: number) => {
    if (rowData.locked) {
      showToast(
        "warn",
        "Locked",
        "This row is locked and cannot be edited (duplicate merge)."
      );
      return;
    }
    setSelectedCategory(rowData.categoryId);
    setSelectedSubCategory(rowData.subCategoryId);
    setProductDescription(rowData.productDescription);
    setUnitPrice(rowData.unitPrice.toString());
    setQuantity(rowData.quantity.toString());
    setDiscountPercent(rowData.discountPercent.toString());
    setEditingIndex(rowIndex);
    showToast("info", "Editing", "You are editing the selected line");
  };

  const handleDeleteRow = (rowIndex: number) => {
    const newList = lineItems.filter((_, idx) => idx !== rowIndex);
    setLineItems(newList);
    console.log("After Delete, Line Items:", newList);
    showToast("success", "Deleted", "Line item deleted");
  };

  // Summary Calculations
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

  const handleSave = () => {
    if (!selectedSupplierId || !selectedBranchId) {
      showToast("warn", "Validation", "Please select Supplier & Branch");
      return;
    }
    if (lineItems.length === 0) {
      showToast("warn", "Validation", "Please add at least one line item");
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

    console.log("== PURCHASE ORDER PAYLOAD ==", payload);
    showToast("success", "Saved", "Payload logged to console");
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
            |
            <div className="flex gap-2">
              <p className="font-semibold">Payment Status</p>
              <p className="text-gray-600">Pending</p>
            </div>
            |
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
                onChange={(e) => setSelectedSubCategory(e.value)}
              />
            </div>
            <div className="flex-1">
              <InputText
                placeholder="Product Description"
                className="w-full"
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <InputText
                placeholder="Unit Price"
                className="w-full"
                value={unitPrice}
                onChange={handleNumericChange(setUnitPrice)}
              />
            </div>
            <div className="flex-1">
              <InputText
                placeholder="Quantity"
                className="w-full"
                value={quantity}
                onChange={handleNumericChange(setQuantity)}
              />
            </div>
            <div className="flex-1">
              <InputText
                placeholder="Discount %"
                className="w-full"
                value={discountPercent}
                onChange={handleNumericChange(setDiscountPercent)}
              />
            </div>
            <Button
              icon={<Check size={18} />}
              onClick={handleAddOrUpdateLine}
              loading={loading}
            />
          </div>

          {/* Table */}
          <div className="mt-3">
            <DataTable
              value={lineItems}
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
                body={(rowData, options) => (
                  <Button
                    icon={<Pencil size={16} />}
                    text
                    rounded
                    disabled={rowData.locked}
                    onClick={() =>
                      handleEditRow(rowData as LineItem, options.rowIndex)
                    }
                  />
                )}
              />
              <Column
                header="Delete"
                body={(_, options) => (
                  <Button
                    icon={<Trash2 size={16} />}
                    text
                    rounded
                    severity="danger"
                    onClick={() => handleDeleteRow(options.rowIndex)}
                  />
                )}
              />
            </DataTable>
          </div>
        </div>
      </div>

      {/* Right Side 25% */}
      <div className="w-[25%] flex flex-col gap-2">
        {/* Supplier & Branch Details */}
        <div className="bg-white flex flex-col p-4 rounded-md shadow justify-between items-start gap-4">
          <div className="flex flex-col flex-1">
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
          <div className="flex flex-col flex-1">
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
            <Button label="Save" className="flex-1" onClick={handleSave} />
            <Button label="Download" className="flex-1" />
            <Button label="Print" className="flex-1" />
          </div>

          {/* Tax toggle + dropdown */}
          <div className="flex items-center justify-between mt-2">
            <span>Tax Enabled</span>
            <InputSwitch
              checked={taxEnabled}
              onChange={(e) => setTaxEnabled(e.value)}
            />
          </div>
          {taxEnabled && (
            <div className="mt-2">
              <Dropdown
                value={taxRate}
                options={taxOptions}
                onChange={(e) => setTaxRate(e.value)}
                className="w-full"
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
                  onChange={handleNumericChange(setPaymentFee)}
                  className="w-full"
                />
              </div>
              <div className="flex-1">
                <span className="block text-xs text-gray-600 mb-1">
                  Shipping Fee
                </span>
                <InputText
                  value={shippingFee}
                  onChange={handleNumericChange(setShippingFee)}
                  className="w-full"
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
