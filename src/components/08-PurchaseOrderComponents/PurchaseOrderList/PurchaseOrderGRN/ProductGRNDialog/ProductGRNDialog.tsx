import React, { useEffect, useRef, useState, createRef } from "react";
import type { RefObject } from "react";

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
} from "../PurchaseOrderGRN.interface";

const LAST_NAV_COL_INDEX = 9;

type OptionItem = {
  label: string;
  value: number;
};

const ProductGRNDialog: React.FC<ProductGRNDialogProps> = ({
  selectedPO,
  receivedQty,
  closeDialog,
  onGRNSave,
}) => {
  const toast = useRef<Toast>(null);
  const cellRefs = useRef<RefObject<any>[][]>([]);

  // MASTER
  const [categoryDetails, setCategoryDetails] = useState<Category[]>([]);
  const [subCategoryDetails, setSubCategoryDetails] = useState<SubCategory[]>(
    []
  );
  const [productDetails, setProductDetails] = useState<ProductItem[]>([]);

  const [designList, setDesignList] = useState<OptionItem[]>([]);
  const [patternList, setPatternList] = useState<OptionItem[]>([]);
  const [variantList, setVariantList] = useState<OptionItem[]>([]);
  const [colorList, setColorList] = useState<OptionItem[]>([]);
  const [sizeList, setSizeList] = useState<OptionItem[]>([]);

  // FORM
  const [category, setCategory] = useState<any>(null);
  const [subCategory, setSubCategory] = useState<any>(null);
  const [product, setProduct] = useState<any>(null);

  const [brand] = useState("Snehalayaa");
  const [hsn, setHsn] = useState("");
  const [lineNo, setLineNo] = useState("");
  const [cost, setCost] = useState<number>(0);
  const [profit, setProfit] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);

  const [rows, setRows] = useState<any[]>([]);

  // --------------------------------------------------------------------------
  // 🔥 FIX: Converts string typed in editable dropdown → correct numeric ID
  // --------------------------------------------------------------------------

  const normalizeDropdownValue = (list: OptionItem[], value: any) => {
    if (value == null) return null;

    // Already numeric → OK
    if (typeof value === "number") return value;

    // Typed label → convert text to ID
    const match = list.find(
      (o) => o.label.toLowerCase() === String(value).toLowerCase()
    );

    return match?.value ?? null;
  };

  // --------------------------------------------------------------------------

  const getCellRef = (rowIndex: number, colIndex: number): RefObject<any> => {
    if (!cellRefs.current[rowIndex]) {
      cellRefs.current[rowIndex] = [];
    }
    if (!cellRefs.current[rowIndex][colIndex]) {
      cellRefs.current[rowIndex][colIndex] = createRef<any>();
    }
    return cellRefs.current[rowIndex][colIndex];
  };

  const calculateTotal = (c: number, p: number) =>
    Number((c + (c * p) / 100).toFixed(2));

  const mapOptionToObject = (list: OptionItem[], id: number | null) => {
    if (id == null) return { id: null, name: "" };
    const opt = list.find((o) => o.value === id);
    return { id, name: opt?.label ?? "" };
  };

  // --------------------------------------------------------------------------
  // Load master data
  // --------------------------------------------------------------------------

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

      setDesignList(
        designs.map((d: any) => ({ label: d.designName, value: d.id }))
      );
      setPatternList(
        patterns.map((d: any) => ({ label: d.PatternName, value: d.id }))
      );
      setVariantList(
        variants.map((d: any) => ({ label: d.VarientName, value: d.id }))
      );
      setColorList(
        colors.map((d: any) => ({ label: d.colorName, value: d.id }))
      );
      setSizeList(sizes.map((d: any) => ({ label: d.sizeName, value: d.id })));
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

  // Set HSN automatically
  useEffect(() => {
    if (!product) return;
    const selectedProd = productDetails.find((p) => p.id === product);
    setHsn(selectedProd?.hsnCode || "");
  }, [product, productDetails]);

  // Auto-generate rows
  useEffect(() => {
    if (!quantity || quantity <= 0) {
      setRows([]);
      cellRefs.current = [];
      return;
    }

    const newRows = Array.from({ length: quantity }).map((_, i) => ({
      sNo: i + 1,
      lineNo,
      refNo: "",
      cost,
      profitPercent: profit,
      total: calculateTotal(cost, profit),
      design: null,
      pattern: null,
      variant: null,
      color: null,
      size: null,
    }));

    setRows(newRows);
  }, [quantity, lineNo, cost, profit]);

  const updateRow = (index: number, field: string, value: any) => {
    setRows((prev) =>
      prev.map((row, i) => {
        if (i !== index) return row;

        const updated = { ...row, [field]: value };

        if (field === "cost" || field === "profitPercent") {
          updated.total = calculateTotal(updated.cost, updated.profitPercent);
        }

        return updated;
      })
    );
  };

  const deleteRow = (index: number) => {
    const updated = rows
      .filter((_, i) => i !== index)
      .map((r, i) => ({ ...r, sNo: i + 1 }));

    setRows(updated);

    cellRefs.current = updated.map(() =>
      Array(LAST_NAV_COL_INDEX + 1)
        .fill(null)
        .map(() => createRef<any>())
    );
  };

  const remainingQty = (receivedQty ?? 0) - rows.length;

  // --------------------------------------------------------------------------
  // Save final GRN payload
  // --------------------------------------------------------------------------

  const handleSave = () => {
    if (rows.length === 0) {
      toast.current?.show({
        severity: "warn",
        summary: "Missing",
        detail: "Enter quantity first",
      });
      return;
    }

    const prodInfo = productDetails.find((p) => p.id === product);

    const items = rows.map((r) => ({
      ...r,
      productId: product,
      productName: prodInfo?.productName ?? "",
      design: mapOptionToObject(designList, r.design),
      pattern: mapOptionToObject(patternList, r.pattern),
      variant: mapOptionToObject(variantList, r.variant),
      color: mapOptionToObject(colorList, r.color),
      size: mapOptionToObject(sizeList, r.size),
    }));

    const payload = {
      poId: selectedPO?.id,
      supplierId: selectedPO?.supplierId,
      items,
    };

    console.log("🔥 FINAL GRN PAYLOAD:", payload);
    onGRNSave(payload);

    toast.current?.show({
      severity: "success",
      summary: "Success",
      detail: "GRN saved",
    });

    setRows([]);
    setQuantity(0);
    closeDialog();
  };

  // --------------------------------------------------------------------------
  // Keyboard Navigation
  // --------------------------------------------------------------------------

  const handleKeyNavigation = (
    e: any,
    rowIndex: number,
    colIndex: number,
    isDropdown = false
  ) => {
    if (e.key !== "Enter") return;
    e.preventDefault();

    const ref = getCellRef(rowIndex, colIndex).current;

    if (isDropdown) {
      const isOpen = ref?.overlayVisible ?? !!ref?.panel?.element?.offsetParent;

      if (!isOpen) {
        ref?.show?.();
        return;
      }
    }

    let nextRow = rowIndex;
    let nextCol = colIndex + 1;

    if (nextCol > LAST_NAV_COL_INDEX) {
      nextRow++;
      nextCol = 0;
    }

    if (nextRow >= rows.length) return;

    getCellRef(nextRow, nextCol).current?.focus?.();
  };

  // --------------------------------------------------------------------------
  // RENDER
  // --------------------------------------------------------------------------

  return (
    <div className="w-full h-full">
      <Toast ref={toast} />

      {/* TOP FILTERS */}
      <div className="flex gap-3">
        <Dropdown
          placeholder="Category"
          options={categoryDetails}
          optionLabel="categoryName"
          optionValue="refCategoryId"
          value={category}
          onChange={(e) => setCategory(e.value)}
          className="w-full flex-1"
          filter
        />

        <Dropdown
          placeholder="Sub Category"
          options={subCategoryDetails.filter(
            (s) => s.refCategoryId === category
          )}
          optionLabel="subCategoryName"
          optionValue="refSubCategoryId"
          value={subCategory}
          onChange={(e) => setSubCategory(e.value)}
          className="w-full flex-1"
          filter
        />

        <Dropdown
          placeholder="Product"
          options={productDetails.filter(
            (p) => p.categoryId === category && p.subCategoryId === subCategory
          )}
          optionLabel="productName"
          optionValue="id"
          value={product}
          onChange={(e) => setProduct(e.value)}
          className="w-full flex-1"
          filter
        />

        <InputText value={brand} disabled className="w-full flex-1" />
        <InputText value={hsn} disabled className="w-full flex-1" />
      </div>

      {/* COST / QTY */}
      <div className="flex gap-3 mt-3">
        <InputText
          placeholder="Line No"
          value={lineNo}
          onChange={(e) => setLineNo(e.target.value)}
          className="w-full flex-1"
        />

        <InputNumber
          placeholder="Cost"
          value={cost}
          onValueChange={(e) => setCost(e.value ?? 0)}
          className="w-full flex-1"
        />

        <InputNumber
          placeholder="Profit %"
          value={profit}
          onValueChange={(e) => setProfit(e.value ?? 0)}
          className="w-full flex-1"
        />

        <InputNumber
          placeholder="Quantity"
          value={quantity}
          max={receivedQty}
          onValueChange={(e) => {
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
          className="w-full flex-1"
        />
      </div>

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

        {/* LINE NO */}
        <Column
          header="Line No"
          body={(r, opts) => (
            <InputText
              ref={getCellRef(opts.rowIndex, 0)}
              value={r.lineNo}
              onChange={(e) =>
                updateRow(opts.rowIndex, "lineNo", e.target.value)
              }
              onKeyDown={(e) => handleKeyNavigation(e, opts.rowIndex, 0)}
              className="w-full"
            />
          )}
        />

        {/* REF NO */}
        <Column
          header="Ref No"
          body={(r, opts) => (
            <InputText
              ref={getCellRef(opts.rowIndex, 1)}
              value={r.refNo}
              onChange={(e) =>
                updateRow(opts.rowIndex, "refNo", e.target.value)
              }
              onKeyDown={(e) => handleKeyNavigation(e, opts.rowIndex, 1)}
              className="w-full"
            />
          )}
        />

        {/* COST */}
        <Column
          header="Cost"
          body={(r, opts) => (
            <InputNumber
              ref={getCellRef(opts.rowIndex, 2)}
              value={r.cost}
              onValueChange={(e) =>
                updateRow(opts.rowIndex, "cost", e.value ?? 0)
              }
              onKeyDown={(e) => handleKeyNavigation(e, opts.rowIndex, 2)}
              className="w-full"
            />
          )}
        />

        {/* PROFIT */}
        <Column
          header="Profit %"
          body={(r, opts) => (
            <InputNumber
              ref={getCellRef(opts.rowIndex, 3)}
              value={r.profitPercent}
              mode="decimal"
              minFractionDigits={1}
              maxFractionDigits={2}
              onValueChange={(e) =>
                updateRow(opts.rowIndex, "profitPercent", e.value ?? 0)
              }
              onKeyDown={(e) => handleKeyNavigation(e, opts.rowIndex, 3)}
              className="w-full"
            />
          )}
        />

        {/* TOTAL */}
        <Column
          header="Total"
          body={(r, opts) => (
            <InputText
              ref={getCellRef(opts.rowIndex, 4)}
              value={String(r.total || "")}
              onChange={(e) =>
                updateRow(
                  opts.rowIndex,
                  "total",
                  parseFloat(e.target.value) || 0
                )
              }
              onKeyDown={(e) => handleKeyNavigation(e, opts.rowIndex, 4)}
              className="w-full"
            />
          )}
        />

        {/* DESIGN */}
        <Column
          header="Design"
          body={(r, opts) => (
            <Dropdown
              ref={getCellRef(opts.rowIndex, 5)}
              options={designList}
              optionLabel="label"
              optionValue="value"
              value={r.design}
              editable
              filter
              onChange={(e) =>
                updateRow(
                  opts.rowIndex,
                  "design",
                  normalizeDropdownValue(designList, e.value)
                )
              }
              onKeyDown={(e) => handleKeyNavigation(e, opts.rowIndex, 5, true)}
              className="w-full"
            />
          )}
        />

        {/* PATTERN */}
        <Column
          header="Pattern"
          body={(r, opts) => (
            <Dropdown
              ref={getCellRef(opts.rowIndex, 6)}
              options={patternList}
              optionLabel="label"
              optionValue="value"
              value={r.pattern}
              editable
              filter
              onChange={(e) =>
                updateRow(
                  opts.rowIndex,
                  "pattern",
                  normalizeDropdownValue(patternList, e.value)
                )
              }
              onKeyDown={(e) => handleKeyNavigation(e, opts.rowIndex, 6, true)}
              className="w-full"
            />
          )}
        />

        {/* VARIANT */}
        <Column
          header="Variant"
          body={(r, opts) => (
            <Dropdown
              ref={getCellRef(opts.rowIndex, 7)}
              options={variantList}
              optionLabel="label"
              optionValue="value"
              value={r.variant}
              editable
              filter
              onChange={(e) =>
                updateRow(
                  opts.rowIndex,
                  "variant",
                  normalizeDropdownValue(variantList, e.value)
                )
              }
              onKeyDown={(e) => handleKeyNavigation(e, opts.rowIndex, 7, true)}
              className="w-full"
            />
          )}
        />

        {/* COLOR */}
        <Column
          header="Color"
          body={(r, opts) => (
            <Dropdown
              ref={getCellRef(opts.rowIndex, 8)}
              options={colorList}
              optionLabel="label"
              optionValue="value"
              value={r.color}
              editable
              filter
              onChange={(e) =>
                updateRow(
                  opts.rowIndex,
                  "color",
                  normalizeDropdownValue(colorList, e.value)
                )
              }
              onKeyDown={(e) => handleKeyNavigation(e, opts.rowIndex, 8, true)}
              className="w-full"
            />
          )}
        />

        {/* SIZE */}
        <Column
          header="Size"
          body={(r, opts) => (
            <Dropdown
              ref={getCellRef(opts.rowIndex, 9)}
              options={sizeList}
              optionLabel="label"
              optionValue="value"
              value={r.size}
              editable
              filter
              onChange={(e) =>
                updateRow(
                  opts.rowIndex,
                  "size",
                  normalizeDropdownValue(sizeList, e.value)
                )
              }
              onKeyDown={(e) => handleKeyNavigation(e, opts.rowIndex, 9, true)}
              className="w-full"
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
