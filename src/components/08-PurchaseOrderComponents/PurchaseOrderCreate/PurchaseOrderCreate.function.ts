import axios from "axios";
import { baseURL, baseURLV2 } from "../../../utils/helper";
import type {
  Branch,
  Category,
  LineValidationResult,
  SubCategory,
  Supplier,
} from "./PurchaseOrderCreate.interface";
import api from "../../../utils/api";

export const fetchSupplier = async (): Promise<Supplier[]> => {
  const response = await axios.get(`${baseURL}/admin/suppliers/read`, {
    headers: {
      Authorization: localStorage.getItem("token") || "",
    },
  });

  if (response.data?.status) {
    return response.data.data;
  } else {
    throw new Error(response.data.message || "Failed to fetch Supplier");
  }
};

export const fetchBranch = async (): Promise<Branch[]> => {
  const response = await api.get(`${baseURLV2}/admin/settings/branches`);
  if (response.data?.status) {
    return response.data.data;
  } else {
    throw new Error(response.data.message || "Failed to fetch Branch");
  }
};

export const fetchCategories = async (): Promise<Category[]> => {
  const response = await api.get(`${baseURL}/admin/settings/categories`);
  if (response.data?.status) {
    return response.data.data;
  } else {
    throw new Error(response.data.message || "Failed to fetch categories");
  }
};

export const fetchSubCategories = async (): Promise<SubCategory[]> => {
  const token = localStorage.getItem("token") || "";
  const response = await axios.get(`${baseURL}/admin/settings/subcategories`, {
    headers: {
      Authorization: token,
    },
  });

  if (response.data?.status) {
    return response.data.data;
  } else {
    throw new Error(response.data.message || "Failed to fetch subcategories");
  }
};

export const showToastMsg = (
  toastRef: any,
  severity: any,
  summary: string,
  detail: string
) => {
  toastRef.current?.show({ severity, summary, detail, life: 2500 });
};

export const validateLine = (obj: {
  selectedCategory: number | null;
  selectedSubCategory: number | null;
  productDescription: string;
  unitPrice: string;
  quantity: string;
  discountPercent: string;
}): LineValidationResult => {
  const {
    selectedCategory,
    selectedSubCategory,
    productDescription,
    unitPrice,
    quantity,
  } = obj;

  if (!selectedCategory) return { valid: false, message: "Select Category" };
  if (!selectedSubCategory)
    return { valid: false, message: "Select SubCategory" };
  if (!productDescription.trim())
    return { valid: false, message: "Enter Description" };

  const uPrice = parseFloat(unitPrice);
  const qty = parseFloat(quantity);

  if (!uPrice || uPrice <= 0)
    return { valid: false, message: "Invalid Unit Price" };
  if (!qty || qty <= 0) return { valid: false, message: "Invalid Quantity" };

  return { valid: true, message: "" };
};

export const calculateLineTotal = (
  unitPrice: string,
  quantity: string,
  discountPercent: string
) => {
  const uPrice = parseFloat(unitPrice);
  const qty = parseFloat(quantity);
  const disc = discountPercent ? parseFloat(discountPercent) : 0;

  const subtotal = uPrice * qty;
  const discountAmount = (subtotal * disc) / 100;
  const total = subtotal - discountAmount;

  return { uPrice, qty, disc, discountAmount, total };
};

export const createPurchaseOrder = async (payload: any) => {
  const token = localStorage.getItem("token") || "";

  try {
    const response = await axios.post(
      `${baseURL}/admin/purchaseOrder/createPurchaseOrder`,
      payload,
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data?.status) {
      return response.data;
    } else {
      throw new Error(response.data.message || "Failed to create PO");
    }
  } catch (err: any) {
    console.error("❌ PO Create Error:", err);
    throw new Error(err.message || "Network error");
  }
};
