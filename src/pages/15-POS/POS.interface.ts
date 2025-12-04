export interface InventoryProduct {
  id: number;
  sku: string;
  productName: string;
  productId: number;
  unitCost: number;
  totalAmount: number;
  marginPercent: number;
  productBranchId: number;
  quantity: number;
  // Add any other fields you need
}
