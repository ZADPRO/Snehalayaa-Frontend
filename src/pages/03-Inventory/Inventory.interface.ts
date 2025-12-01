export interface InventoryImage {
  fileName: string;
  viewURL: string;
}

export interface InventoryProduct {
  id: number;
  barcode: string;
  productId: number;
  productName: string;

  grnId: number;
  grnNumber: string;
  poSupplierId: number | null;
  categoryId: number | null;
  categoryName: string;
  subCategoryId: number | null;
  subCategoryName: string;
  branchId: number | null;
  designId: number | null;
  designName: string;
  patternId: number | null;
  patternName: string;
  varientId: number | null;
  varientName: string;
  colorId: number | null;
  colorName: string;
  sizeId: number | null;
  sizeName: string;
  unitCost: string | number;
  totalAmount: string | number;
  marginPercent: string | number;
  discountPercent: string | number | null;
  discountAmount: string | number | null;

  supplierName: string;
  refBranchName: string;
  refBranchCode: string;

  createdAt: string;
  createdBy: string;
  images: InventoryImage[]; // NEW
}
