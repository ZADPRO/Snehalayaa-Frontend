import React, { useState } from "react";
import backgroundImage from "../../assets/background/bg.png";
import { User, Trash2 } from "lucide-react";

import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";
import { Dialog } from "primereact/dialog";
import { MultiSelect } from "primereact/multiselect";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Divider } from "primereact/divider";

import { scanSKUService } from "./POS.function";
import { fetchEmployees } from "../../components/12-SupplierCustomerComponents/EmployeeComponents/ViewDeleteEmployees.function";

const paymentOptions = [
  { label: "Cash", value: "cash" },
  { label: "Online", value: "online" },
  { label: "Card", value: "card" },
  { label: "Return", value: "return" },
];

type ReturnStage = "none" | "original" | "replacement" | "done";

const POS: React.FC = () => {
  const [sku, setSku] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showSidebar, setShowSidebar] = useState(false);

  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  // Employee Dialog
  const [showEmployeeDialog, setShowEmployeeDialog] = useState(false);
  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

  // Customer Dialog
  const [showCustomerDialog, setShowCustomerDialog] = useState(false);
  const [customerData, setCustomerData] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    email: "",
    district: "",
  });

  // Payment
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<any[]>(
    []
  );
  const [paymentValues, setPaymentValues] = useState<any>({});

  // Return flow
  const [isReturnMode, setIsReturnMode] = useState(false);
  const [returnStage, setReturnStage] = useState<ReturnStage>("none");
  const [returnOriginalProduct, setReturnOriginalProduct] = useState<any>(null);
  const [returnReplacementProduct, setReturnReplacementProduct] =
    useState<any>(null);

  const totalAmount = products.reduce(
    (sum, p) =>
      sum + (p.price * p.qty - (p.price * p.qty * p.discountPercent) / 100),
    0
  );

  const totalPaid =
    (paymentValues.cash || 0) +
    (paymentValues.online || 0) +
    (paymentValues.card || 0) +
    (paymentValues.return || 0); // return will stay 0, but kept for consistency

  const balance = totalPaid - totalAmount;

  const showPrimeAlert = (msg: string) => {
    setAlertMessage(msg);
    setShowAlert(true);
  };

  const handleScan = async (e: any) => {
    if (e.key === "Enter") {
      const skuValue = e.target.value.trim();
      if (!skuValue) return;

      try {
        const result = await scanSKUService(skuValue);
        const product = result.data;
        const isFound = result.isFound;

        if (!product) {
          showPrimeAlert("SKU not found in database");
          setSku("");
          return;
        }

        if (!isFound) {
          // keep same behaviour: show warning but still allow
          showPrimeAlert(
            `This product belongs to branch ${product.productBranchId}, not your branch.`
          );
        }

        // ✅ RETURN MODE FLOW
        if (
          isReturnMode &&
          (returnStage === "original" || returnStage === "replacement")
        ) {
          if (returnStage === "original") {
            // First product scanned for return (original)
            setReturnOriginalProduct(product);
            showPrimeAlert(
              `Original product captured (₹${Number(
                product.unitCost
              )}). Now scan the replacement product.`
            );
            setReturnStage("replacement");
            setSku("");
            return;
          }

          if (returnStage === "replacement") {
            if (!returnOriginalProduct) {
              showPrimeAlert(
                "Original product not captured. Please scan again."
              );
              setSku("");
              return;
            }

            const originalPrice = Number(returnOriginalProduct.unitCost || 0);
            const replacementPrice = Number(product.unitCost || 0);

            if (replacementPrice !== originalPrice) {
              showPrimeAlert(
                `Replacement product price (₹${replacementPrice}) must match original price (₹${originalPrice}).`
              );
              setSku("");
              return;
            }

            // ✅ Price matched → accept replacement product as sale line
            setReturnReplacementProduct(product);
            setSelectedProduct(product);

            setProducts((prev) => [
              ...prev,
              {
                id: prev.length + 1,
                sku: product.barcode,
                name: product.productName,
                price: Number(product.unitCost),
                qty: product.quantity ?? 1,
                discountPercent: 0,
              },
            ]);

            setReturnStage("done");
            showPrimeAlert(
              "✅ Return validated. Replacement product added to bill."
            );
            setSku("");
            return;
          }
        }

        // ✅ NORMAL FLOW (non-return or return already done)
        setSelectedProduct(product);

        setProducts((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            sku: product.barcode,
            name: product.productName,
            price: Number(product.unitCost),
            qty: product.quantity ?? 1,
            discountPercent: 0,
          },
        ]);
      } catch (err) {
        showPrimeAlert("Error scanning SKU");
      }

      setSku("");
    }
  };

  const deleteRow = (rowData: any) => {
    const filtered = products.filter((p) => p.id !== rowData.id);

    const reIndexed = filtered.map((item, index) => ({
      ...item,
      id: index + 1,
    }));

    setProducts(reIndexed);
  };

  const deleteButtonTemplate = (rowData: any) => (
    <Button
      icon={<Trash2 size={16} />}
      severity="danger"
      onClick={() => deleteRow(rowData)}
      rounded
      text
    />
  );

  const handlePaymentChange = (method: string, value: any) => {
    setPaymentValues((prev: any) => ({
      ...prev,
      [method]: value,
    }));
  };

  const resetPOS = () => {
    setProducts([]);
    setSelectedProduct(null);
    setCustomerData({
      firstName: "",
      lastName: "",
      mobile: "",
      email: "",
      district: "",
    });
    setSelectedEmployee(null);
    setSelectedPaymentMethods([]);
    setPaymentValues({});
    setSku("");

    // reset return flow
    setIsReturnMode(false);
    setReturnStage("none");
    setReturnOriginalProduct(null);
    setReturnReplacementProduct(null);

    setShowSidebar(false);
  };

  const updateDiscount = (id: number, discount: number) => {
    const updated = products.map((item) => {
      if (item.id === id) {
        return { ...item, discountPercent: discount };
      }
      return item;
    });

    setProducts(updated);
  };

  const openEmployeeDialog = async () => {
    try {
      const list = await fetchEmployees();
      setEmployees(list);
      setShowEmployeeDialog(true);
    } catch {
      showPrimeAlert("Failed to load employees");
    }
  };

  const saveOrder = () => {
    if (!products.length) {
      showPrimeAlert("No products added");
      return;
    }

    // ✅ BLOCK NEGATIVE BALANCE
    if (balance < 0) {
      showPrimeAlert(
        "Balance amount is negative. Please collect full payment before proceeding."
      );
      return;
    }

    // ✅ In return mode, ensure flow is completed
    if (isReturnMode && returnStage !== "done") {
      showPrimeAlert(
        "Return flow is not completed. Please scan original and replacement products."
      );
      return;
    }

    const payload = {
      customer: customerData,
      employee: selectedEmployee
        ? {
            id: selectedEmployee.RefUserId,
            name: `${selectedEmployee.RefUserFName} ${selectedEmployee.RefUserLName}`,
            designation: selectedEmployee.RefUserDesignation,
            branchId: selectedEmployee.RefUserBranchId,
            mobile: selectedEmployee.mobile,
          }
        : null,

      items: products.map((p) => ({
        sku: p.sku,
        productName: p.name,
        qty: p.qty,
        unitPrice: p.price,
        discountPercent: p.discountPercent,
        total: p.price * p.qty - (p.price * p.qty * p.discountPercent) / 100,
      })),

      returnInfo: isReturnMode
        ? {
            original: returnOriginalProduct
              ? {
                  sku: returnOriginalProduct.barcode,
                  productName: returnOriginalProduct.productName,
                  price: Number(returnOriginalProduct.unitCost || 0),
                }
              : null,
            replacement: returnReplacementProduct
              ? {
                  sku: returnReplacementProduct.barcode,
                  productName: returnReplacementProduct.productName,
                  price: Number(returnReplacementProduct.unitCost || 0),
                }
              : null,
          }
        : null,

      payment: {
        methods: selectedPaymentMethods,
        values: paymentValues,
        totalPaid,
        balance,
      },

      summary: {
        totalAmount,
        totalItems: products.length,
        isReturn: isReturnMode,
      },
    };

    console.log("FINAL PAYLOAD TO SAVE:", payload);

    showPrimeAlert("Order Saved Successfully");
    resetPOS();
  };

  return (
    <div
      className="ps-container"
      style={{
        backgroundColor: "#f5f5f5",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
      }}
    >
      {/* TOP BAR */}
      <div className="ps-topbar flex items-center justify-between p-3 bg-white shadow">
        <button className="ps-back-btn" onClick={() => window.history.back()}>
          Back
        </button>

        <p className="uppercase font-semibold text-lg">POS</p>

        <User size={32} color="#6f1e60" />
      </div>

      {/* MAIN LAYOUT */}
      <div className="flex p-3 gap-3">
        {/* LEFT SECTION */}
        <div className="w-[70%] flex flex-col h-[calc(100vh-90px)] space-y-4">
          {/* Scan SKU */}
          <FloatLabel className="always-float">
            <InputText
              value={sku}
              className="w-full"
              onChange={(e) => setSku(e.target.value)}
              onKeyDown={handleScan}
            />
            <label>Scan SKU</label>
          </FloatLabel>

          {/* Table */}
          <div className="flex-1 overflow-auto">
            <DataTable
              value={products}
              showGridlines
              scrollable
              scrollHeight="100%"
            >
              <Column field="id" header="S.No" />
              <Column field="sku" header="SKU" />
              <Column field="name" header="Name" />
              <Column field="price" header="Price" />
              <Column field="qty" header="Qty" />
              <Column
                header="Discount %"
                body={(rowData) => (
                  <InputNumber
                    value={rowData.discountPercent}
                    onValueChange={(e) =>
                      updateDiscount(rowData.id, e.value || 0)
                    }
                    min={0}
                    max={100}
                  />
                )}
              />
              <Column
                header="Total Price"
                body={(row) =>
                  (
                    row.price * row.qty -
                    (row.price * row.qty * row.discountPercent) / 100
                  ).toFixed(2)
                }
              />

              <Column header="Delete" body={deleteButtonTemplate} />
            </DataTable>
          </div>

          {/* FOOTER */}
          <div className="bg-white p-4 rounded shadow space-y-3 mt-auto">
            <div className="flex gap-3">
              <div className="flex gap-3">
                <InputText
                  placeholder="Enter Customer Name"
                  className="w-full"
                />
                <Button
                  label="Add Customer"
                  className="p-button-info"
                  onClick={() => setShowCustomerDialog(true)}
                />
                <Button
                  label="Add Employee"
                  className="p-button-secondary"
                  onClick={() => openEmployeeDialog()}
                />
              </div>
            </div>

            <p>
              <b>Total Purchase Amount:</b> {totalAmount}
            </p>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="w-[30%] space-y-4">
          <div className="bg-white p-4 rounded shadow">
            <p className="font-semibold text-lg">Product Summary</p>

            {selectedProduct ? (
              <div className="mt-3 space-y-2">
                {/* Images */}
                {selectedProduct.images?.length > 0 ? (
                  <div className="flex gap-2 overflow-x-auto">
                    {selectedProduct.images.map((img: any, index: number) => (
                      <img
                        key={index}
                        src={img.viewURL}
                        alt={img.fileName}
                        className="w-24 h-24 rounded object-cover"
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No images available</p>
                )}

                {/* Details */}
                <p>
                  <b>Name:</b> {selectedProduct.productName}
                </p>
                <p>
                  <b>SKU:</b> {selectedProduct.barcode}
                </p>
                <p>
                  <b>Category:</b> {selectedProduct.categoryName}
                </p>
                <p>
                  <b>Sub-Category:</b> {selectedProduct.subCategoryName}
                </p>
                <p>
                  <b>Design:</b> {selectedProduct.designName}
                </p>
                <p>
                  <b>Pattern:</b> {selectedProduct.patternName}
                </p>
                <p>
                  <b>Color:</b> {selectedProduct.colorName}
                </p>
                <p>
                  <b>Size:</b> {selectedProduct.sizeName}
                </p>
                <p>
                  <b>Cost:</b> {selectedProduct.unitCost}
                </p>
              </div>
            ) : (
              <p className="text-gray-400 text-sm mt-3">
                Scan a product to view details.
              </p>
            )}
          </div>

          <Button
            label="Save & Proceed for Receipt"
            className="w-full p-button-success"
            onClick={() => setShowSidebar(true)}
          />
        </div>
      </div>

      {/* SIDEBAR */}
      <Sidebar
        visible={showSidebar}
        position="right"
        onHide={() => setShowSidebar(false)}
        style={{ width: "50vw" }}
        header="Payment"
        className="p-2"
      >
        <Divider />
        <b>Total Amount: {totalAmount}</b>

        <p className="mt-3">Select Payment Methods</p>
        <MultiSelect
          value={selectedPaymentMethods}
          options={paymentOptions}
          onChange={(e) => {
            setSelectedPaymentMethods(e.value);

            if (e.value.includes("return")) {
              setIsReturnMode(true);
              setReturnStage("original");
              setReturnOriginalProduct(null);
              setReturnReplacementProduct(null);
              showPrimeAlert(
                "Return selected. Please scan the original product being returned."
              );
            } else {
              setIsReturnMode(false);
              setReturnStage("none");
              setReturnOriginalProduct(null);
              setReturnReplacementProduct(null);
            }
          }}
          display="chip"
          className="w-full"
        />

        {selectedPaymentMethods.map((method: string) => (
          <div key={method} className="mt-3">
            <p className="mb-1 capitalize">{method} Amount</p>
            <InputNumber
              className="w-full"
              value={paymentValues[method] || 0}
              onValueChange={(e) => handlePaymentChange(method, e.value)}
              disabled={method === "return"} // ✅ no manual return amount
            />
          </div>
        ))}

        <p className="mt-3 font-semibold">
          Balance / Change:{" "}
          <span className={balance >= 0 ? "text-green-600" : "text-red-600"}>
            {balance}
          </span>
        </p>

        <Button
          label="Save Order"
          className="w-full mt-4 p-button-success"
          onClick={saveOrder}
        />
      </Sidebar>

      {/* ALERT DIALOG */}
      <Dialog
        header="Alert"
        visible={showAlert}
        onHide={() => setShowAlert(false)}
        footer={<Button label="OK" onClick={() => setShowAlert(false)} />}
      >
        <p>{alertMessage}</p>
      </Dialog>

      {/* CUSTOMER DIALOG */}
      <Dialog
        header="Add Customer"
        visible={showCustomerDialog}
        onHide={() => setShowCustomerDialog(false)}
        style={{ width: "30vw" }}
      >
        <div className="space-y-5 mt-3">
          <FloatLabel className="always-float">
            <InputText
              value={customerData.firstName}
              className="w-full"
              onChange={(e) =>
                setCustomerData({ ...customerData, firstName: e.target.value })
              }
            />
            <label>First Name</label>
          </FloatLabel>

          <FloatLabel className="always-float">
            <InputText
              value={customerData.lastName}
              className="w-full"
              onChange={(e) =>
                setCustomerData({ ...customerData, lastName: e.target.value })
              }
            />
            <label>Last Name</label>
          </FloatLabel>

          <FloatLabel className="always-float">
            <InputText
              value={customerData.mobile}
              className="w-full"
              onChange={(e) =>
                setCustomerData({ ...customerData, mobile: e.target.value })
              }
            />
            <label>Mobile Number</label>
          </FloatLabel>

          <FloatLabel className="always-float">
            <InputText
              value={customerData.email}
              className="w-full"
              onChange={(e) =>
                setCustomerData({ ...customerData, email: e.target.value })
              }
            />
            <label>Email (Optional)</label>
          </FloatLabel>

          <FloatLabel className="always-float">
            <InputText
              value={customerData.district}
              className="w-full"
              onChange={(e) =>
                setCustomerData({ ...customerData, district: e.target.value })
              }
            />
            <label>District (Optional)</label>
          </FloatLabel>

          <Button
            label="Save Customer"
            className="w-full p-button-success"
            onClick={() => setShowCustomerDialog(false)}
          />
        </div>
      </Dialog>

      {/* EMPLOYEE DIALOG */}
      <Dialog
        header="Select Employee"
        visible={showEmployeeDialog}
        onHide={() => setShowEmployeeDialog(false)}
        style={{ width: "30vw" }}
      >
        <div className="space-y-4 mt-3">
          <FloatLabel className="always-float">
            <select
              className="p-inputtext p-component w-full p-2 border rounded"
              value={selectedEmployee?.RefUserId || ""}
              onChange={(e) => {
                const emp = employees.find(
                  (item) => item.RefUserId === Number(e.target.value)
                );
                setSelectedEmployee(emp);
              }}
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp.RefUserId} value={emp.RefUserId}>
                  {emp.RefUserFName} {emp.RefUserLName} -{" "}
                  {emp.RefUserDesignation}
                </option>
              ))}
            </select>

            <label>Select Employee</label>
          </FloatLabel>

          <Button
            label="Save Employee"
            className="w-full p-button-success"
            onClick={() => setShowEmployeeDialog(false)}
          />
        </div>
      </Dialog>
    </div>
  );
};

export default POS;
