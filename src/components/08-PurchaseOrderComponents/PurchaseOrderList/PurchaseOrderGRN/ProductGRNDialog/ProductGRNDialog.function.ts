import axios from "axios";
import type { RefObject } from "react";
import { baseURL } from "../../../../../utils/helper";

export type RoundOffRule = {
  fromRange: string;
  toRange: string;
  prices: number[];
};

export const calculateTotal = (c: number, p: number) =>
  Number((c + (c * p) / 100).toFixed(2));

export const applyRoundOff = (mrp: number, roundOffRules: RoundOffRule[]) => {
  if (!roundOffRules?.length) return mrp;

  for (const rule of roundOffRules) {
    const from = Number(rule.fromRange || 0);
    const to = Number(rule.toRange || Number.POSITIVE_INFINITY);

    if (mrp >= from && mrp <= to) {
      const sortedPrices = [...rule.prices].sort((a, b) => a - b);
      return sortedPrices.find((p) => p > mrp) ?? sortedPrices.at(-1)!;
    }
  }
  return mrp;
};

export const mapOptionToObject = (list: any[], id: number | null) => {
  if (!id) return { id: null, name: "" };
  const opt = list.find((o) => o.value === id);
  return { id, name: opt?.label ?? "" };
};

export const validateBeforeSave = (
  args: any
): { ok: boolean; message?: string } => {
  const {
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
    qtyInMeters,
  } = args;

  if (!product) return { ok: false, message: "Select a product." };
  if (!lineNo) return { ok: false, message: "Line No required." };
  if (cost <= 0) return { ok: false, message: "Cost must be > 0." };
  if (profit < 0) return { ok: false, message: "Profit cannot be negative." };
  if (!selectedPattern) return { ok: false, message: "Select pattern." };
  if (!selectedVariant) return { ok: false, message: "Select variant." };
  if (!selectedColor) return { ok: false, message: "Select color." };
  if (!selectedSize) return { ok: false, message: "Select size." };
  if (!rows.length)
    return { ok: false, message: "Enter quantity to create rows." };

  for (let i = 0; i < rows.length; i++) {
    if (qtyInMeters === "yes" && (!rows[i].meterQty || rows[i].meterQty <= 0)) {
      return {
        ok: false,
        message: `Row ${i + 1}: Meter Qty required`,
      };
    }
  }

  if (receivedQty && quantity > receivedQty)
    return {
      ok: false,
      message: `Quantity exceeds received qty (${receivedQty})`,
    };

  return { ok: true };
};

export const getCellRef = (
  cellRefs: React.MutableRefObject<RefObject<any>[][]>,
  rowIndex: number,
  colIndex: number,
  createRef: () => RefObject<any>
) => {
  if (!cellRefs.current[rowIndex]) cellRefs.current[rowIndex] = [];
  if (!cellRefs.current[rowIndex][colIndex])
    cellRefs.current[rowIndex][colIndex] = createRef();
  return cellRefs.current[rowIndex][colIndex];
};

export const getBundleDetails = async (poId: number) => {
  const token = localStorage.getItem("token") || "";

  const response = await axios.get(
    `${baseURL}/admin/products/getBundleByPO/${poId}`, // ✅ PASS ID HERE
    {
      headers: {
        Authorization: token,
      },
    }
  );

  if (response.data?.status) {
    return response.data.data[0];
  }

  throw new Error(response.data?.message || "Failed to fetch bundle details");
};
