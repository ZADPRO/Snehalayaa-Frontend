export interface PurchaseOrderListItem {
  id: number;
  po_number: string;

  supplierId: number;
  supplierName: string;
  creditedDays: number;
  supplierCity: string;
  branchid: number;
  refBranchId: number;
  refBranchCode: string;

  taxEnabled: boolean;
  taxRate: string;
  taxAmount: string;
  subTotal: string;
  total: string;

  status: string;
  createdAt: string;
  createdBy: string;

  totalorderedqty: number;
  totalreceivedqty: number;
  isfullyclosed: boolean;
}

export interface PurchaseOrderListResponse {
  status: boolean;
  data: PurchaseOrderListItem[];
}
