import React, { useEffect, useRef, useState, createRef } from "react";
import type { RefObject } from "react";

import type {
  OptionItem,
  ProductGRNDialogProps,
} from "./ProductGRNDialog.interface";

import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Trash2 } from "lucide-react";
import { FloatLabel } from "primereact/floatlabel";

import { getProducts } from "../../../../10-ProductSettingsComponents/ProductSettingsProdCombo/ProductSettingsProdCombo.function";
import { getMasterList } from "../../../../10-ProductSettingsComponents/ProductSettingsDesignColorSize/ProductSettingsDesignColorSize.function";

import type { ProductItem } from "../PurchaseOrderGRN.interface";
import api from "../../../../../utils/api";
import { baseURL } from "../../../../../utils/helper";
import {
  mapOptionToObject,
  validateBeforeSave,
  type RoundOffRule,
} from "./ProductGRNDialog.function";

const LAST_NAV_COL_INDEX = 6; // adapt if you change columns

const ProductGRNDialog: React.FC<ProductGRNDialogProps> = ({
  selectedPO,
  receivedQty,
  quantityInMeters,
  clothType,
  closeDialog,
  onGRNSave,
}) => {
  console.log("quantityInMeters", quantityInMeters);
  console.log("clothType", clothType);
  console.log("selectedPO", selectedPO);
  const toast = useRef<Toast>(null);
  const cellRefs = useRef<RefObject<any>[][]>([]);

  // master lists
  const [productDetails, setProductDetails] = useState<ProductItem[]>([]);
  const [patternList, setPatternList] = useState<OptionItem[]>([]);
  const [variantList, setVariantList] = useState<OptionItem[]>([]);
  const [colorList, setColorList] = useState<OptionItem[]>([]);
  const [sizeList, setSizeList] = useState<OptionItem[]>([]);

  // parent selections (Option A - apply to all rows)
  const [selectedPattern, setSelectedPattern] = useState<number | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<number | null>(null);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  useEffect(() => {
    setSelectedSize(1);
  }, []);
  // qty in meters parent boolean
  // const [qtyInMeters, setQtyInMeters] = useState<"yes" | "no">("no");

  const applyRoundOff = (mrp: number) => {
    if (!roundOffRules || roundOffRules.length === 0) return mrp;

    for (const rule of roundOffRules) {
      const from = Number(rule.fromRange || 0);
      const to = Number(rule.toRange || Number.POSITIVE_INFINITY);

      if (mrp >= from && mrp <= to) {
        // PRICES ARRAY MUST BE ASCENDING
        const sortedPrices = [...rule.prices].sort((a, b) => a - b);

        // Always take NEXT HIGHER value
        const next = sortedPrices.find((p) => p > mrp);

        // If no higher price exists, fallback to the highest one
        return next ?? sortedPrices[sortedPrices.length - 1];
      }
    }

    return mrp;
  };

  const [taxRate, setTaxRate] = useState<number>(0);

  // inputs
  const [product, setProduct] = useState<number | null>(null);
  const [brand] = useState("Snehalayaa");
  const [hsn, setHsn] = useState("");
  const [lineNo, setLineNo] = useState("");
  const [cost, setCost] = useState<number>(0);
  const [profit, setProfit] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);

  // rows and round-off rules
  const [rows, setRows] = useState<any[]>([]);
  const [roundOffRules, setRoundOffRules] = useState<RoundOffRule[]>([]);

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

  const loadMaster = async () => {
    try {
      const prods = await getProducts();
      const patterns = await getMasterList("patterns");
      const variants = await getMasterList("varient");
      const colors = await getMasterList("color");
      const sizes = await getMasterList("size");

      setProductDetails(prods);

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

  const fetchRoundOff = async () => {
    try {
      const res = await api.get(`${baseURL}/admin/settings/round-off`);
      if (res.data?.status) {
        const rules = (res.data.data || []).map((r: any) => ({
          ...r,
          prices: (r.prices || [])
            .map((p: any) => Number(p))
            .sort((a: number, b: number) => a - b),
        }));
        console.log("rules", rules);
        setRoundOffRules(rules);
      }
    } catch (err) {
      console.error("Failed to fetch round off rules", err);
    }
  };

  useEffect(() => {
    loadMaster();
    fetchRoundOff();
  }, []);

  useEffect(() => {
    if (!product) {
      setHsn("");
      return;
    }
    const selectedProd = productDetails.find((p) => p.id === product);
    setHsn(selectedProd?.hsnCode || "");
  }, [product, productDetails]);

  useEffect(() => {
    if (!quantity || quantity <= 0) {
      setRows([]);
      return;
    }

    const maxAllowed = receivedQty ?? Number.POSITIVE_INFINITY;
    const qtyToCreate = Math.min(quantity, maxAllowed);

    // ✅ SAREES → GROUPED (SINGLE ROW)
    if (clothType === "sarees") {
      const row = {
        sNo: 1,
        lineNo: lineNo || "",
        refNo: "COMMON",
        cost,
        profitPercent: profit,
        total: calculateTotal(cost, profit),
        meterQty: quantityInMeters === "yes" ? qtyToCreate : null,
        quantity: qtyToCreate,
        roundOff: applyRoundOff(calculateTotal(cost, profit)),
      };

      setRows([row]);
      return;
    }

    // ✅ READYMADE → INDIVIDUAL ROWS
    const newRows = Array.from({ length: qtyToCreate }).map((_, i) => ({
      sNo: i + 1,
      lineNo: lineNo || "",
      refNo: "",
      cost,
      profitPercent: profit,
      total: calculateTotal(cost, profit),
      size: selectedSize, // ✅ SIZE AS COLUMN
      roundOff: applyRoundOff(calculateTotal(cost, profit)),
    }));

    setRows(newRows);
  }, [
    quantity,
    lineNo,
    cost,
    profit,
    quantityInMeters,
    clothType,
    selectedSize,
  ]);

  const updateRow = (index: number, field: string, value: any) => {
    setRows((prev) =>
      prev.map((row, i) => {
        if (i !== index) return row;

        const updated = { ...row, [field]: value };

        if (field === "cost" || field === "profitPercent") {
          // ensure numeric
          updated.cost = Number(updated.cost) || 0;
          updated.profitPercent = Number(updated.profitPercent) || 0;
          const rawMRP = calculateTotal(updated.cost, updated.profitPercent);
          updated.total = rawMRP;
          updated.roundOff = applyRoundOff(rawMRP);
        }

        if (field === "meterQty") {
          updated.meterQty = Number(value) || 0;
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

    // recreate refs
    cellRefs.current = updated.map(() =>
      Array(LAST_NAV_COL_INDEX + 1)
        .fill(null)
        .map(() => createRef<any>())
    );
  };

  const remainingQty = (receivedQty ?? 0) - rows.length;

  // keyboard navigation: Enter moves to next cell (left->right, top->down)
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
        // open the dropdown panel if possible
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

    const nextRef = getCellRef(nextRow, nextCol).current;
    nextRef?.focus?.();
  };

  // handle save (send payload to parent)
  const handleSave = () => {
    const valid = validateBeforeSave({
      product,
      lineNo,
      cost,
      profit,
      selectedPattern,
      selectedVariant,
      selectedColor,
      selectedSize,
      rows,
      quantity,
      receivedQty,
      quantityInMeters,
    });

    if (!valid.ok) {
      toast.current?.show({
        severity: "warn",
        summary: "Validation",
        detail: valid.message,
      });
      return;
    }

    const prodInfo = productDetails.find((p) => p.id === product);

    let items: any[] = [];

    // ✅ READYMADE → USE EXISTING ROWS DIRECTLY
    if (clothType === "readymade") {
      items = rows.map((r) => ({
        ...r,
        productId: product,
        productName: prodInfo?.productName ?? "",
        pattern: mapOptionToObject(patternList, selectedPattern),
        variant: mapOptionToObject(variantList, selectedVariant),
        color: mapOptionToObject(colorList, r.color),
        size: mapOptionToObject(sizeList, r.size),
        meterQty: quantityInMeters === "yes" ? Number(r.meterQty || 0) : null,
      }));
    }

    // ✅ SAREES → GENERATE INDIVIDUAL ROWS FROM GROUPED ENTRY
    if (clothType === "sarees") {
      const baseRow = rows[0]; // grouped row
      const qty = baseRow.quantity || quantity;

      items = Array.from({ length: qty }).map((_, i) => ({
        sNo: i + 1,
        lineNo: baseRow.lineNo,
        refNo: `${baseRow.refNo || "SAREE"}-${i + 1}`,
        cost: baseRow.cost,
        profitPercent: baseRow.profitPercent,
        total: baseRow.total,
        roundOff: baseRow.roundOff,

        productId: product,
        productName: prodInfo?.productName ?? "",

        pattern: mapOptionToObject(patternList, selectedPattern),
        variant: mapOptionToObject(variantList, selectedVariant),
        color: mapOptionToObject(colorList, selectedColor),
        size: mapOptionToObject(sizeList, selectedSize),

        meterQty:
          quantityInMeters === "yes" ? Number(baseRow.meterQty || 0) : null,
      }));
    }

    const payload = {
      poId: selectedPO!.id,
      supplierId: selectedPO!.supplierId,
      branchId: selectedPO!.branchid,

      taxRate: String(taxRate),
      taxAmount: String(
        (items.reduce((s, r) => s + r.total, 0) * taxRate) / 100
      ),
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
    setLineNo("");
    setCost(0);
    setProfit(0);
    closeDialog();
  };

  return (
    <div className="w-full h-full mt-3">
      <Toast ref={toast} />

      {/* Top row: product / brand / hsn */}
      <div className="flex gap-3">
        <FloatLabel className="flex-1 always-float">
          <Dropdown
            id="product"
            options={productDetails}
            optionLabel="productName"
            optionValue="id"
            value={product}
            onChange={(e) => setProduct(e.value)}
            className="w-full"
            filter
          />
          <label htmlFor="product">Product</label>
        </FloatLabel>

        <FloatLabel className="flex-1 always-float">
          <InputText id="brand" value={brand} disabled className="w-full" />
          <label htmlFor="brand">Brand</label>
        </FloatLabel>

        <FloatLabel className="flex-1 always-float">
          <InputText id="hsn" value={hsn} className="w-full" />
          <label htmlFor="hsn">HSN</label>
        </FloatLabel>

        <FloatLabel className="flex-1 always-float">
          <InputText
            id="lineNo"
            value={lineNo}
            onChange={(e) => setLineNo(e.target.value)}
            className="w-full"
          />
          <label htmlFor="lineNo">Line No</label>
        </FloatLabel>

        <FloatLabel className="flex-1 always-float">
          <InputNumber
            id="cost"
            value={cost}
            onValueChange={(e) => setCost(e.value ?? 0)}
            className="w-full"
          />
          <label htmlFor="cost">Cost</label>
        </FloatLabel>

        <FloatLabel className="flex-1 always-float">
          <Dropdown
            value={taxRate}
            onChange={(e) => setTaxRate(e.value)}
            options={[
              { label: "0%", value: 0 },
              { label: "2%", value: 2 },
              { label: "2.5%", value: 2.5 },
              { label: "5%", value: 5 },
              { label: "8%", value: 8 },
              { label: "12%", value: 12 },
              { label: "18%", value: 18 },
            ]}
            className="w-full"
          />
          <label>Tax %</label>
        </FloatLabel>
      </div>

      {/* second row: lineNo / cost / profit / quantity */}
      <div className="flex gap-3 mt-3">
        <FloatLabel className="flex-1 always-float">
          <InputNumber
            id="profit"
            value={profit}
            onValueChange={(e) => setProfit(e.value ?? 0)}
            mode="decimal"
            useGrouping={false}
            minFractionDigits={0}
            maxFractionDigits={2}
            className="w-full"
          />

          <label htmlFor="profit">Margin %</label>
        </FloatLabel>
        <FloatLabel className="flex-1 always-float">
          <InputNumber
            id="quantity"
            value={quantity}
            max={receivedQty ?? undefined}
            onValueChange={(e) => {
              const q = e.value || 0;
              if (receivedQty != null && q > receivedQty) {
                toast.current?.show({
                  severity: "warn",
                  summary: "Exceeded",
                  detail: `Max allowed: ${receivedQty}`,
                });
                return;
              }
              setQuantity(q);
            }}
            className="w-full"
          />
          <label htmlFor="quantity">Quantity</label>
        </FloatLabel>

        <FloatLabel className="flex-1 always-float">
          <Dropdown
            id="pattern"
            options={patternList}
            optionLabel="label"
            optionValue="value"
            value={selectedPattern}
            onChange={(e) => setSelectedPattern(e.value)}
            className="w-full"
            filter
          />
          <label htmlFor="pattern">Pattern</label>
        </FloatLabel>

        <FloatLabel className="flex-1 always-float">
          <Dropdown
            id="variant"
            options={variantList}
            optionLabel="label"
            optionValue="value"
            value={selectedVariant}
            onChange={(e) => setSelectedVariant(e.value)}
            className="w-full"
            filter
          />
          <label htmlFor="variant">Variant</label>
        </FloatLabel>

        <FloatLabel className="flex-1 always-float">
          <Dropdown
            id="color"
            options={colorList}
            optionLabel="label"
            optionValue="value"
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.value)}
            className="w-full"
            filter
          />
          <label htmlFor="color">Color</label>
        </FloatLabel>
      </div>

      <div className="flex justify-between items-center gap-3 mt-3">
        <div>
          <p>
            Remaining Qty: <b>{remainingQty}</b>
          </p>
        </div>

        <div className="flex gap-3">
          <Button label="Save All" onClick={handleSave} />
        </div>
      </div>
      {/* TABLE */}
      <div className="mt-3">
        <DataTable
          value={rows}
          scrollable
          showGridlines
          responsiveLayout="scroll"
        >
          <Column header="S.No" body={(r) => r.sNo} style={{ width: "4rem" }} />

          {/* LINE NO */}
          {clothType === "readymade" && (
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
          )}

          {/* REF NO */}
          <Column
            header="Ref No"
            body={(r, opts) => (
              <InputText
                value={clothType === "sarees" ? "COMMON" : r.refNo}
                disabled={clothType === "sarees"}
                onChange={(e) =>
                  updateRow(opts.rowIndex, "refNo", e.target.value)
                }
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
            header="Margin %"
            body={(r, opts) => (
              <InputNumber
                ref={getCellRef(opts.rowIndex, 3)}
                value={r.profitPercent}
                mode="decimal"
                useGrouping={false}
                minFractionDigits={0}
                maxFractionDigits={2}
                onValueChange={(e) =>
                  updateRow(opts.rowIndex, "profitPercent", e.value ?? 0)
                }
                onKeyDown={(e) => handleKeyNavigation(e, opts.rowIndex, 3)}
                className="w-full"
              />
            )}
          />

          {/* TOTAL (MRP) - read only */}
          <Column
            header="MRP"
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

          {clothType === "readymade" && (
            <Column
              header="Color"
              body={(r, opts) => (
                <Dropdown
                  value={r.color}
                  options={colorList}
                  optionLabel="label"
                  optionValue="value"
                  onChange={(e) => updateRow(opts.rowIndex, "color", e.value)}
                  className="w-full"
                />
              )}
            />
          )}

          {clothType === "readymade" && (
            <Column
              header="Size"
              body={(r, opts) => (
                <Dropdown
                  value={r.size}
                  options={sizeList}
                  optionLabel="label"
                  optionValue="value"
                  onChange={(e) => updateRow(opts.rowIndex, "size", e.value)}
                  className="w-full"
                />
              )}
            />
          )}

          {quantityInMeters === "yes" && (
            <Column
              header="Meter Qty"
              body={(r, opts) => (
                <InputNumber
                  value={r.meterQty}
                  onValueChange={(e) =>
                    updateRow(opts.rowIndex, "meterQty", e.value ?? 0)
                  }
                  className="w-full"
                />
              )}
            />
          )}

          {/* Round Off */}
          <Column
            header="Round Off"
            body={(r) => (
              <InputText
                value={String(r.roundOff ?? "")}
                className="w-full"
                readOnly
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
    </div>
  );
};

export default ProductGRNDialog;
