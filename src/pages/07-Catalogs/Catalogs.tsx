import React, { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { User } from "lucide-react";

import backgroundImage from "../../assets/background/bg.png";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { Eye } from "lucide-react";

import type {
  Branch,
  Category,
  SubCategory,
  Supplier,
} from "../../components/08-PurchaseOrderComponents/PurchaseOrderCreate/PurchaseOrderCreate.interface";
import {
  fetchBranch,
  fetchCategories,
  fetchSubCategories,
  fetchSupplier,
} from "../../components/08-PurchaseOrderComponents/PurchaseOrderCreate/PurchaseOrderCreate.function";
import { fetchInventoryProductBySKU } from "../../components/03-InventoryComponents/InventoryProductDetails/InventoryProductDetails.function";
import type { InventoryProduct } from "../03-Inventory/Inventory.interface";
import { fetchAllInventoryProducts } from "./Catalogs.function";
import ViewEditProducts from "../../components/07-CatalogComponents/ViewEditProducts/ViewEditProducts";

const Catalogs: React.FC = () => {
  const toast = useRef<Toast>(null);

  const [loading, setLoading] = useState(false);
  const [inventoryProductDetails, setInventoryProductDetails] = useState<
    InventoryProduct[]
  >([]);

  // Dropdown data
  const [categoryDetails, setCategoryDetails] = useState<Category[]>([]);
  const [subCategoryDetails, setSubCategoryDetails] = useState<SubCategory[]>(
    []
  );
  const [supplierDetails, setSupplierDetails] = useState<Supplier[]>([]);
  const [branchDetails, setBranchDetails] = useState<Branch[]>([]);

  // Selected filters
  const [categoryFilter, setCategoryFilter] = useState<number | null>(null);
  const [subCategoryFilter, setSubCategoryFilter] = useState<number | null>(
    null
  );
  const [supplierFilter, setSupplierFilter] = useState<number | null>(null);
  const [branchFilter, setBranchFilter] = useState<number | null>(null);
  const [globalFilter, setGlobalFilter] = useState("");

  const [viewDialogVisible, setViewDialogVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<InventoryProduct | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setInventoryProductDetails(await fetchAllInventoryProducts());
      setCategoryDetails(await fetchCategories());
      setSubCategoryDetails(await fetchSubCategories());
      setSupplierDetails(await fetchSupplier());
      setBranchDetails(await fetchBranch());
    } catch (err: any) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: err.message || "Failed to load inventory",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // --- FILTER LOGIC ---
  const filteredInventory = inventoryProductDetails.filter((item) => {
    return (
      (categoryFilter ? item.categoryId === categoryFilter : true) &&
      (subCategoryFilter ? item.subCategoryId === subCategoryFilter : true) &&
      (supplierFilter ? item.poSupplierId === supplierFilter : true) &&
      (branchFilter ? item.branchId === branchFilter : true) &&
      (globalFilter
        ? JSON.stringify(item)
            .toLowerCase()
            .includes(globalFilter.toLowerCase())
        : true)
    );
  });

  // Fallback renderer: "-" when value is empty
  const fallback = (val: any) =>
    val === null || val === "" || val === undefined ? "-" : val;

  const viewTemplate = (row: InventoryProduct) => {
    return (
      <button
        onClick={async () => {
          try {
            const data = await fetchInventoryProductBySKU(row.barcode);
            setSelectedProduct(data);
            setViewDialogVisible(true);
          } catch (err: any) {
            toast.current?.show({
              severity: "error",
              summary: "Error",
              detail: err.message,
            });
          }
        }}
        className="p-2 rounded hover:bg-gray-200"
      >
        <Eye size={15} color="#6f1e60" />
      </button>
    );
  };

  return (
    <div>
      <div
        className="ps-container"
        style={{
          backgroundColor: "#f5f5f5",
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        <div className="ps-topbar">
          <div className="ps-left">
            <button
              className="ps-back-btn"
              onClick={() => window.history.back()}
            >
              Back
            </button>
          </div>

          <p className="uppercase font-semibold text-lg">Catalogs</p>

          <div className="ps-right">
            <User size={32} color="#6f1e60" />
          </div>
        </div>

        <Toast ref={toast} />

        <div className="p-3">
          {/* FILTER AREA */}
          <div className="flex gap-3 mb-3">
            {/* CATEGORY */}
            <Dropdown
              placeholder="Category"
              className="flex-1 w-full"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.value)}
              options={categoryDetails.map((c) => ({
                label: c.categoryName,
                value: c.refCategoryId,
              }))}
              showClear
            />

            {/* SUB CATEGORY — AUTO FILTERED BY CATEGORY */}
            <Dropdown
              placeholder="Sub Category"
              className="flex-1 w-full"
              value={subCategoryFilter}
              onChange={(e) => setSubCategoryFilter(e.value)}
              options={subCategoryDetails
                .filter(
                  (sc) => !categoryFilter || sc.refCategoryId === categoryFilter
                )
                .map((s) => ({
                  label: s.subCategoryName,
                  value: s.refSubCategoryId,
                }))}
              disabled={!categoryFilter}
              showClear
            />

            {/* SUPPLIER */}
            <Dropdown
              placeholder="Supplier"
              className="flex-1 w-full"
              value={supplierFilter}
              onChange={(e) => setSupplierFilter(e.value)}
              options={supplierDetails.map((s) => ({
                label: s.supplierName,
                value: s.supplierId,
              }))}
              showClear
            />

            {/* BRANCH */}
            <Dropdown
              placeholder="Branch"
              className="flex-1 w-full"
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.value)}
              options={branchDetails.map((b) => ({
                label: b.refBranchName,
                value: b.refBranchId,
              }))}
              showClear
            />

            {/* GLOBAL SEARCH */}
            <InputText
              placeholder="Search..."
              className="w-full flex-1"
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
          </div>

          {/* DATATABLE */}
          <DataTable
            value={filteredInventory}
            loading={loading}
            paginator
            rows={15}
            showGridlines
            stripedRows
            rowsPerPageOptions={[15, 30, 50]}
          >
            <Column header="S.No" body={(_, opts) => opts.rowIndex + 1} />
            <Column header="View" body={viewTemplate} />

            <Column field="refBranchCode" header="Unit" />
            <Column field="productName" header="Product Name" />

            <Column field="barcode" header="Barcode" sortable />
            <Column field="grnNumber" header="GRN Number" sortable />

            <Column header="Design" body={(row) => fallback(row.designName)} />
            <Column
              header="Pattern"
              body={(row) => fallback(row.patternName)}
            />
            <Column
              header="Variant"
              body={(row) => fallback(row.varientName)}
            />
            <Column header="Color" body={(row) => fallback(row.colorName)} />
            <Column header="Size" body={(row) => fallback(row.sizeName)} />
            <Column field="supplierName" header="Supplier Name" />

            <Column field="unitCost" header="Unit Cost" sortable />
            <Column field="totalAmount" header="Total Amount" sortable />
            <Column field="discountPercent" header="Discount %" />
            <Column field="discountAmount" header="Discount Amount" />
            <Column field="marginPercent" header="Margin %" sortable />
          </DataTable>
        </div>
      </div>
      <Dialog
        header="Product Details"
        visible={viewDialogVisible}
        onHide={() => setViewDialogVisible(false)}
        maximizable
        style={{ width: "60vw" }}
      >
        <ViewEditProducts product={selectedProduct} />
      </Dialog>
    </div>
  );
};

export default Catalogs;
