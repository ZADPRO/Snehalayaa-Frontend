import React, { useEffect, useRef, useState } from "react";
import type { ProductGRNDialogProps } from "./ProductGRNDialog.interface";

import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Trash2 } from "lucide-react";

import {
  fetchCategories,
  fetchSubCategories,
} from "../../../PurchaseOrderCreate/PurchaseOrderCreate.function";
import { getProducts } from "../../../../10-ProductSettingsComponents/ProductSettingsProdCombo/ProductSettingsProdCombo.function";
import { getMasterList } from "../../../../10-ProductSettingsComponents/ProductSettingsDesignColorSize/ProductSettingsDesignColorSize.function";

import type {
  Category,
  SubCategory,
  ProductItem,
  GRNRow,
} from "../PurchaseOrderGRN.interface";

const ProductGRNDialog: React.FC<ProductGRNDialogProps> = ({
  selectedPO,
  receivedQty,
}) => {
  const toast = useRef<Toast>(null);

  // MASTER DROPDOWNS
  const [categoryDetails, setCategoryDetails] = useState<Category[]>([]);
  const [subCategoryDetails, setSubCategoryDetails] = useState<SubCategory[]>(
    []
  );
  const [productDetails, setProductDetails] = useState<ProductItem[]>([]);

  // MASTER LISTS (string values only)
  const [designList, setDesignList] = useState<string[]>([]);
  const [patternList, setPatternList] = useState<string[]>([]);
  const [variantList, setVariantList] = useState<string[]>([]);
  const [colorList, setColorList] = useState<string[]>([]);
  const [sizeList, setSizeList] = useState<string[]>([]);

  // FORM FIELDS
  const [category, setCategory] = useState<any>(null);
  const [subCategory, setSubCategory] = useState<any>(null);
  const [product, setProduct] = useState<any>(null);

  const [brand] = useState("Snehalayaa");
  const [hsn, setHsn] = useState("");
  const [lineNo, setLineNo] = useState("");
  const [cost, setCost] = useState<number>(0);
  const [profit, setProfit] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);

  const [rows, setRows] = useState<GRNRow[]>([]);

  // LOAD MASTER DATA
  const loadMaster = async () => {
    try {
      const cats = await fetchCategories();
      const subs = await fetchSubCategories();
      const prods = await getProducts();

      const designs = await getMasterList("design");
      const patterns = await getMasterList("patterns");
      const variants = await getMasterList("varient");
      const colors = await getMasterList("color");
      const sizes = await getMasterList("size");

      setCategoryDetails(cats);
      setSubCategoryDetails(subs);
      setProductDetails(prods);

      setDesignList(designs.map((d: any) => d.designName));
      setPatternList(patterns.map((d: any) => d.PatternName));
      setVariantList(variants.map((d: any) => d.VarientName));
      setColorList(colors.map((d: any) => d.colorName));
      setSizeList(sizes.map((d: any) => d.sizeName));
    } catch (err: any) {
      toast.current?.show({
        severity: "error",
        summary: "Failed",
        detail: err.message || "Could not load master data",
      });
    }
  };

  useEffect(() => {
    loadMaster();
  }, []);

  // AUTO-SET HSN WHEN PRODUCT SELECTED
  useEffect(() => {
    if (!product) return;
    const selected = productDetails.find((p) => p.id === product);
    setHsn(selected?.hsnCode || "");
  }, [product]);

  // GENERATE ROWS WHEN QUANTITY CHANGES
  useEffect(() => {
    if (!quantity || quantity <= 0) {
      setRows([]);
      return;
    }

    const newRows = Array.from({ length: quantity }).map((_, i) => ({
      sNo: i + 1,
      lineNo: lineNo || "",
      refNo: "",
      cost,
      profitPercent: profit,
      total: calculateTotal(cost, profit),
      design: "",
      pattern: "",
      variant: "",
      color: "",
      size: "",
    }));

    setRows(newRows);
  }, [quantity, lineNo, cost, profit]);

  // HELPER
  const calculateTotal = (cost: number, profitPercent: number) => {
    return Number((cost + (cost * profitPercent) / 100).toFixed(2));
  };

  // UPDATE ROW FIELD
  const updateRow = (index: number, field: string, value: any) => {
    setRows((prev) =>
      prev.map((row, i) => {
        if (i !== index) return row;

        const updated: any = { ...row, [field]: value };

        // Recalculate total when cost or profit changes
        if (field === "cost" || field === "profitPercent") {
          updated.total = calculateTotal(updated.cost, updated.profitPercent);
        }

        return updated;
      })
    );
  };

  // DELETE ROW
  const deleteRow = (index: number) => {
    const updated = rows.filter((_, i) => i !== index);
    setRows(updated.map((r, i) => ({ ...r, sNo: i + 1 })));
  };

  const remainingQty = (receivedQty ?? 0) - rows.length;

  // SAVE ALL
  const handleSave = () => {
    if (rows.length === 0) {
      toast.current?.show({
        severity: "warn",
        summary: "Missing",
        detail: "Enter quantity first",
      });
      return;
    }

    const payload = {
      poId: selectedPO?.id ?? 0,
      supplierId: selectedPO?.supplierId ?? 0,
      items: rows,
    };

    console.log("🔥 FINAL GRN PAYLOAD:", payload);

    toast.current?.show({
      severity: "success",
      summary: "Success",
      detail: "GRN saved",
    });

    setRows([]);
    setQuantity(0);
  };

  return (
    <div className="w-full h-full">
      <Toast ref={toast} />

      {/* TOP DROPDOWNS */}
      <div className="flex gap-3">
        <Dropdown
          placeholder="Category"
          className="w-full flex-1"
          options={categoryDetails}
          optionLabel="categoryName"
          optionValue="refCategoryId"
          filter
          value={category}
          onChange={(e) => setCategory(e.value)}
        />

        <Dropdown
          placeholder="Sub Category"
          className="w-full flex-1"
          options={subCategoryDetails.filter(
            (s) => s.refCategoryId === category
          )}
          optionLabel="subCategoryName"
          optionValue="refSubCategoryId"
          filter
          value={subCategory}
          onChange={(e) => setSubCategory(e.value)}
        />

        <Dropdown
          placeholder="Product"
          className="w-full flex-1"
          options={productDetails.filter(
            (p) => p.categoryId === category && p.subCategoryId === subCategory
          )}
          optionLabel="productName"
          optionValue="id"
          filter
          value={product}
          onChange={(e) => setProduct(e.value)}
        />

        <InputText
          value={brand}
          disabled
          className="w-full flex-1 bg-gray-200"
        />
        <InputText value={hsn} disabled className="w-full flex-1" />
      </div>

      {/* SECOND ROW */}
      <div className="flex gap-3 mt-3">
        <InputText
          placeholder="Line No"
          className="w-full flex-1"
          value={lineNo}
          onChange={(e) => setLineNo(e.target.value)}
        />

        <InputNumber
          placeholder="Cost"
          className="w-full flex-1"
          value={cost}
          onValueChange={(e: any) => setCost(e.value ?? 0)}
        />

        <InputNumber
          placeholder="Profit %"
          className="w-full flex-1"
          value={profit}
          mode="decimal"
          minFractionDigits={1}
          maxFractionDigits={2}
          onValueChange={(e: any) => setProfit(e.value ?? 0)}
        />

        <InputNumber
          placeholder="Quantity"
          className="w-full flex-1"
          value={quantity}
          max={receivedQty ?? undefined}
          onValueChange={(e: any) => {
            const q = e.value || 0;
            if (q > (receivedQty ?? 0)) {
              toast.current?.show({
                severity: "warn",
                summary: "Exceeded",
                detail: `Max allowed: ${receivedQty}`,
              });
              return;
            }
            setQuantity(q);
          }}
        />
      </div>

      {/* Remaining Qty */}
      <div className="flex justify-between mt-3 mb-3">
        <p>
          Remaining Qty: <b>{remainingQty}</b>
        </p>

        <div className="flex gap-3">
          <Button label="Preview All" />
          <Button label="Save All" onClick={handleSave} />
        </div>
      </div>

      {/* TABLE */}
      <DataTable value={rows} scrollable showGridlines>
        <Column header="S.No" body={(r) => r.sNo} />

        {/* EDITABLE LINE NO */}
        <Column
          header="Line No"
          body={(r, opts) => (
            <InputText
              value={r.lineNo}
              className="w-full"
              onChange={(e) =>
                updateRow(opts.rowIndex, "lineNo", e.target.value)
              }
            />
          )}
        />

        {/* REF NO */}
        <Column
          header="Ref No"
          body={(r, opts) => (
            <InputText
              value={r.refNo}
              className="w-full"
              onChange={(e) =>
                updateRow(opts.rowIndex, "refNo", e.target.value)
              }
            />
          )}
        />

        {/* ROW COST (Editable) */}
        <Column
          header="Cost"
          body={(r, opts) => (
            <InputNumber
              value={r.cost}
              className="w-full"
              onValueChange={(e) =>
                updateRow(opts.rowIndex, "cost", e.value ?? 0)
              }
            />
          )}
        />

        {/* ROW PROFIT (Editable) */}
        <Column
          header="Profit %"
          body={(r, opts) => (
            <InputNumber
              value={r.profitPercent}
              mode="decimal"
              minFractionDigits={1}
              maxFractionDigits={2}
              className="w-full"
              onValueChange={(e) =>
                updateRow(opts.rowIndex, "profitPercent", e.value ?? 0)
              }
            />
          )}
        />

        {/* TOTAL (auto-calculated) */}
        <Column header="Total" body={(r) => r.total} />

        {/* DESIGN */}
        <Column
          header="Design"
          body={(r, opts) => (
            <Dropdown
              options={designList}
              value={r.design}
              editable
              filter
              className="w-full"
              onChange={(e) => updateRow(opts.rowIndex, "design", e.value)}
            />
          )}
        />

        {/* PATTERN */}
        <Column
          header="Pattern"
          body={(r, opts) => (
            <Dropdown
              options={patternList}
              editable
              filter
              value={r.pattern}
              className="w-full"
              onChange={(e) => updateRow(opts.rowIndex, "pattern", e.value)}
            />
          )}
        />

        {/* VARIANT */}
        <Column
          header="Variant"
          body={(r, opts) => (
            <Dropdown
              options={variantList}
              editable
              filter
              value={r.variant}
              className="w-full"
              onChange={(e) => updateRow(opts.rowIndex, "variant", e.value)}
            />
          )}
        />

        {/* COLOR */}
        <Column
          header="Color"
          body={(r, opts) => (
            <Dropdown
              options={colorList}
              editable
              filter
              value={r.color}
              className="w-full"
              onChange={(e) => updateRow(opts.rowIndex, "color", e.value)}
            />
          )}
        />

        {/* SIZE */}
        <Column
          header="Size"
          body={(r, opts) => (
            <Dropdown
              options={sizeList}
              editable
              filter
              value={r.size}
              className="w-full"
              onChange={(e) => updateRow(opts.rowIndex, "size", e.value)}
            />
          )}
        />

        {/* DELETE */}
        <Column
          header="Delete"
          body={(_, opts) => (
            <Button
              text
              severity="danger"
              icon={<Trash2 size={16} />}
              onClick={() => deleteRow(opts.rowIndex)}
            />
          )}
        />
      </DataTable>
    </div>
  );
};

export default ProductGRNDialog;
