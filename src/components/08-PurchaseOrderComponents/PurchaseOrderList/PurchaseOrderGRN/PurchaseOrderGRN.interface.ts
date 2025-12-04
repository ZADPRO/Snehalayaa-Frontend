export interface GRNItemResponse {
  grnItemId: number;
  grnId: number;
  purchaseOrderId: number;

  supplierId: number;
  supplierName: string;

  branchid: number;
  branchCode: string;

  poNumber: string;
  grnDate: string;

  lineNo: string;
  refNo: string;

  productId: number;
  productName: string;

  designId: number;
  designName: string;

  patternId: number;
  patternName: string;

  varientId: number;
  varientName: string; // YOU SAID → need to check only with varientName

  colorId: number;
  colorName: string;

  sizeId: number;
  sizeName: string;

  cost: string;
  profitPercent: string;
  total: string;

  quantity: number;
  sku: string;

  productBranchId: number;

  itemcreatedat: string;
  itemupdatedat: string | null;
}

export interface Category {
  refCategoryId: number;
  categoryName: string;
  categoryCode: string;
  profitMargin: any;
  isActive: boolean;
  isDelete: boolean;
  createdAt: string;
  createdBy: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface SubCategory {
  refSubCategoryId: number;
  subCategoryName: string;
  subCategoryCode: string;
  isActive: boolean;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  isDelete: boolean;
  refCategoryId: number;
}

export interface ProductItem {
  id: number;
  categoryId: number;
  subCategoryId: number;
  productName: string;
  hsnCode: string;
  taxPercentage: string;
  productCode: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string | null;
  updatedBy: string | null;
  isDelete: boolean;
  categoryName: string;
  subCategoryName: string;
}

export interface DesignItem {
  id: number;
  designName: string;
  isDelete: boolean;
  createdAt: string;
  createdBy: string;
  updatedAt: string | null;
  updatedBy: string | null;
}

export interface DesignItem {
  id: number;
  designName: string;
  isDelete: boolean;
  createdAt: string;
  createdBy: string;
  updatedAt: string | null;
  updatedBy: string | null;
}

export interface ColorItem {
  id: number;
  colorName: string;
  isDelete: boolean;
  createdAt: string;
  createdBy: string;
  updatedAt: string | null;
  updatedBy: string | null;
}

export interface SizeItem {
  id: number;
  sizeName: string;
  isDelete: boolean;
  createdAt: string;
  createdBy: string;
  updatedAt: string | null;
  updatedBy: string | null;
}

export interface VariantItem {
  id: number;
  VarientName: string;
  isDelete: boolean;
  createdAt: string;
  createdBy: string;
  updatedAt: string | null;
  updatedBy: string | null;
}

export interface PatternItem {
  id: number;
  PatternName: string;
  isDelete: boolean;
  createdAt: string;
  createdBy: string;
  updatedAt: string | null;
  updatedBy: string | null;
}

export interface GRNRow {
  sNo: number;
  lineNo: string;
  refNo: string;
  design: string;
  pattern: string;
  variant: string;
  color: string;
  size: string;
  profitPercent: number | null;
}

export interface GRNSavePayload {
  poId: number;
  supplierId: number;
  lineNo: string;
  cost: number | null;
  profitPercent: number | null;
  sellingPrice: number | null;
  items: GRNRow[];
}

export interface ProductGRNDialogProps {
  selectedPO: {
    id: number;
    supplierId: number;
    supplierName: string;
    totalorderedqty: number;
    totalreceivedqty: number;
    [key: string]: any;
  } | null;

  receivedQty: number;
  closeDialog: () => void;
}
