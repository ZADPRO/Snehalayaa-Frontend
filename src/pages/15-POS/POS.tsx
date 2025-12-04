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

import { scanSKUService } from "./POS.function";

const paymentOptions = [
  { label: "Cash", value: "cash" },
  { label: "Online", value: "online" },
  { label: "Card", value: "card" },
  { label: "Return", value: "return" },
];

const POS: React.FC = () => {
  const [sku, setSku] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showSidebar, setShowSidebar] = useState(false);

  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

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

  const totalAmount = products.reduce(
    (sum, p) =>
      sum + (p.price * p.qty - (p.price * p.qty * p.discountPercent) / 100),
    0
  );

  // ================================
  // SCAN SKU
  // ================================
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
          return;
        }

        if (!isFound) {
          showPrimeAlert(
            `This product belongs to branch ${product.productBranchId}, not your branch.`
          );
        }

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

  // ================================
  // DELETE ROW
  // ================================
  const deleteRow = (rowData: any) => {
    setProducts(products.filter((p) => p.id !== rowData.id));
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

  // ================================
  // ALERT
  // ================================
  const showPrimeAlert = (msg: string) => {
    setAlertMessage(msg);
    setShowAlert(true);
  };

  // ================================
  // PAYMENT HANDLING
  // ================================
  const handlePaymentChange = (method: string, value: any) => {
    setPaymentValues((prev: any) => ({
      ...prev,
      [method]: value,
    }));
  };

  const totalPaid =
    (paymentValues.cash || 0) +
    (paymentValues.online || 0) +
    (paymentValues.card || 0) +
    (paymentValues.return || 0);

  const balance = totalPaid - totalAmount;

  // ================================
  // RENDER
  // ================================
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
              <Column field="discountPercent" header="Discount %" />
              <Column header="Delete" body={deleteButtonTemplate} />
            </DataTable>
          </div>

          {/* FOOTER */}
          <div className="bg-white p-4 rounded shadow space-y-3 mt-auto">
            <div className="flex gap-3">
              <InputText placeholder="Enter Customer Name" className="w-full" />
              <Button
                label="Add Customer"
                className="p-button-info"
                onClick={() => setShowCustomerDialog(true)}
              />
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
        className="p-4"
      >
        <h3 className="font-semibold mb-4">Payment</h3>

        <b>Total Amount: {totalAmount}</b>

        <p className="mt-3">Select Payment Methods</p>
        <MultiSelect
          value={selectedPaymentMethods}
          options={paymentOptions}
          onChange={(e) => setSelectedPaymentMethods(e.value)}
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
            />
          </div>
        ))}

        <p className="mt-3 font-semibold">
          Balance / Change:{" "}
          <span className={balance >= 0 ? "text-green-600" : "text-red-600"}>
            {balance}
          </span>
        </p>

        <Button label="Save Order" className="w-full mt-4 p-button-success" />
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

      <Dialog
        header="Add Customer"
        visible={showCustomerDialog}
        onHide={() => setShowCustomerDialog(false)}
        style={{ width: "30vw" }}
      >
        <div className="space-y-5">
          {/* First Name */}
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

          {/* Last Name */}
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

          {/* Mobile */}
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

          {/* Email optional */}
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

          {/* District optional */}
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
    </div>
  );
};

export default POS;
