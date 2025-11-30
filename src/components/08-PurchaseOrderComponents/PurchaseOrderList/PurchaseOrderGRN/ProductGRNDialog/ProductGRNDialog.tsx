import React, {
  useEffect,
  useRef,
  useState,
  createRef,
  RefObject,
} from "react";
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
  // GRNRow, // we’ll just use `any` rows to avoid interface mismatch
} from "../PurchaseOrderGRN.interface";

const LAST_NAV_COL_INDEX = 9; // LineNo..Size = 0..9

type OptionItem = {
  label: string;
  value: number;
};

const ProductGRNDialog: React.FC<ProductGRNDialogProps> = ({
  selectedPO,
  receivedQty,
}) => {
  const toast = useRef<Toast>(null);

  /**
   * cellRefs[rowIndex][colIndex] -> RefObject<any>
   * Created lazily via getCellRef to avoid timing issues.
   */
  const cellRefs = useRef<RefObject<any>[][]>([]);

  // MASTER DROPDOWNS
  const [categoryDetails, setCategoryDetails] = useState<Category[]>([]);
  const [subCategoryDetails, setSubCategoryDetails] = useState<SubCategory[]>(
    []
  );
  const [productDetails, setProductDetails] = useState<ProductItem[]>([]);

  // MASTER LISTS (ID + label)
  const [designList, setDesignList] = useState<OptionItem[]>([]);
  const [patternList, setPatternList] = useState<OptionItem[]>([]);
  const [variantList, setVariantList] = useState<OptionItem[]>([]);
  const [colorList, setColorList] = useState<OptionItem[]>([]);
  const [sizeList, setSizeList] = useState<OptionItem[]>([]);

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

  // use `any` to keep flexible fields (designId, etc.)
  const [rows, setRows] = useState<any[]>([]);

  /* ---------- HELPERS ---------- */

  // Lazily ensure a ref exists for given cell
  const getCellRef = (rowIndex: number, colIndex: number): RefObject<any> => {
    if (!cellRefs.current[rowIndex]) {
      cellRefs.current[rowIndex] = [];
    }
    if (!cellRefs.current[rowIndex][colIndex]) {
      cellRefs.current[rowIndex][colIndex] = createRef<any>();
    }
    return cellRefs.current[rowIndex][colIndex];
  };

  const calculateTotal = (c: number, p: number) => {
    return Number((c + (c * p) / 100).toFixed(2));
  };

  /* ---------- LOAD MASTER DATA ---------- */

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

      // Map to {label, value} using id + name
      setDesignList(
        designs.map((d: any) => ({
          label: d.designName,
          value: d.id,
        }))
      );

      setPatternList(
        patterns.map((d: any) => ({
          label: d.PatternName,
          value: d.id,
        }))
      );

      setVariantList(
        variants.map((d: any) => ({
          label: d.VarientName,
          value: d.id,
        }))
      );

      setColorList(
        colors.map((d: any) => ({
          label: d.colorName,
          value: d.id,
        }))
      );

      setSizeList(
        sizes.map((d: any) => ({
          label: d.sizeName,
          value: d.id,
        }))
      );
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

  /* ---------- AUTO SET HSN ---------- */

  useEffect(() => {
    if (!product) return;
    const selected = productDetails.find((p) => p.id === product);
    setHsn(selected?.hsnCode || "");
  }, [product, productDetails]);

  /* ---------- GENERATE ROWS WHEN QUANTITY / MAIN FIELDS CHANGE ---------- */

  useEffect(() => {
    if (!quantity || quantity <= 0) {
      setRows([]);
      cellRefs.current = [];
      return;
    }

    const newRows = Array.from({ length: quantity }).map((_, i) => ({
      sNo: i + 1,
      lineNo: lineNo || "",
      refNo: "",
      cost,
      profitPercent: profit,
      total: calculateTotal(cost, profit),
      // store IDs for design-related fields
      design: null as number | null,
      pattern: null as number | null,
      variant: null as number | null,
      color: null as number | null,
      size: null as number | null,
    }));

    setRows(newRows);
    // refs will be created lazily by getCellRef
  }, [quantity, lineNo, cost, profit]);

  /* ---------- UPDATE ROW FIELD ---------- */

  const updateRow = (index: number, field: string, value: any) => {
    setRows((prev) =>
      prev.map((row, i) => {
        if (i !== index) return row;

        const updated: any = { ...row, [field]: value };

        // Recalculate total if cost or profit changed
        if (field === "cost" || field === "profitPercent") {
          const c = Number(updated.cost || 0);
          const p = Number(updated.profitPercent || 0);
          updated.total = calculateTotal(c, p);
        }

        return updated;
      })
    );
  };

  /* ---------- DELETE ROW ---------- */

  const deleteRow = (index: number) => {
    const updated = rows.filter((_, i) => i !== index);
    setRows(updated.map((r, i) => ({ ...r, sNo: i + 1 })));
    // refs will adjust lazily next render
  };

  const remainingQty = (receivedQty ?? 0) - rows.length;

  /* ---------- SAVE ---------- */

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
    cellRefs.current = [];
  };

  /* ---------- KEYBOARD NAVIGATION ---------- */

  const handleKeyNavigation = (
    e: React.KeyboardEvent,
    rowIndex: number,
    colIndex: number,
    isDropdown = false
  ) => {
    if (e.key !== "Enter") return;
    e.preventDefault();

    const refObj = getCellRef(rowIndex, colIndex);
    const refInstance = refObj.current;

    // For Dropdowns: first Enter -> open; second Enter -> move next
    if (isDropdown) {
      const isOpen =
        refInstance?.overlayVisible ??
        !!refInstance?.panel?.element?.offsetParent;

      if (!isOpen) {
        refInstance?.show?.();
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

    const nextRefInstance = getCellRef(nextRow, nextCol).current;
    nextRefInstance?.focus?.();
  };

  /* ---------- RENDER ---------- */

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

        <InputText value={brand} disabled className="w-full flex-1" />
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

        {/* LINE NO */}
        <Column
          header="Line No"
          body={(r, opts) => (
            <InputText
              ref={getCellRef(opts.rowIndex, 0)}
              value={r.lineNo}
              onKeyDown={(e) => handleKeyNavigation(e, opts.rowIndex, 0)}
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
              ref={getCellRef(opts.rowIndex, 1)}
              value={r.refNo}
              onKeyDown={(e) => handleKeyNavigation(e, opts.rowIndex, 1)}
              className="w-full"
              onChange={(e) =>
                updateRow(opts.rowIndex, "refNo", e.target.value)
              }
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
              className="w-full"
              onKeyDown={(e) => handleKeyNavigation(e, opts.rowIndex, 2)}
              onValueChange={(e) =>
                updateRow(opts.rowIndex, "cost", e.value ?? 0)
              }
            />
          )}
        />

        {/* PROFIT % */}
        <Column
          header="Profit %"
          body={(r, opts) => (
            <InputNumber
              ref={getCellRef(opts.rowIndex, 3)}
              value={r.profitPercent}
              mode="decimal"
              minFractionDigits={1}
              maxFractionDigits={2}
              className="w-full"
              onKeyDown={(e) => handleKeyNavigation(e, opts.rowIndex, 3)}
              onValueChange={(e) =>
                updateRow(opts.rowIndex, "profitPercent", e.value ?? 0)
              }
            />
          )}
        />

        {/* TOTAL (editable InputText) */}
        <Column
          header="Total"
          body={(r, opts) => (
            <InputText
              ref={getCellRef(opts.rowIndex, 4)}
              value={String(r.total ?? "")}
              onKeyDown={(e) => handleKeyNavigation(e, opts.rowIndex, 4)}
              className="w-full"
              onChange={(e) =>
                updateRow(
                  opts.rowIndex,
                  "total",
                  parseFloat(e.target.value) || 0
                )
              }
            />
          )}
        />

        {/* DESIGN (stores ID) */}
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
              className="w-full"
              onKeyDown={(e) => handleKeyNavigation(e, opts.rowIndex, 5, true)}
              onChange={(e) => updateRow(opts.rowIndex, "design", e.value)}
            />
          )}
        />

        {/* PATTERN (stores ID) */}
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
              className="w-full"
              onKeyDown={(e) => handleKeyNavigation(e, opts.rowIndex, 6, true)}
              onChange={(e) => updateRow(opts.rowIndex, "pattern", e.value)}
            />
          )}
        />

        {/* VARIANT (stores ID) */}
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
              className="w-full"
              onKeyDown={(e) => handleKeyNavigation(e, opts.rowIndex, 7, true)}
              onChange={(e) => updateRow(opts.rowIndex, "variant", e.value)}
            />
          )}
        />

        {/* COLOR (stores ID) */}
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
              className="w-full"
              onKeyDown={(e) => handleKeyNavigation(e, opts.rowIndex, 8, true)}
              onChange={(e) => updateRow(opts.rowIndex, "color", e.value)}
            />
          )}
        />

        {/* SIZE (stores ID) */}
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
              className="w-full"
              onKeyDown={(e) => handleKeyNavigation(e, opts.rowIndex, 9, true)}
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
