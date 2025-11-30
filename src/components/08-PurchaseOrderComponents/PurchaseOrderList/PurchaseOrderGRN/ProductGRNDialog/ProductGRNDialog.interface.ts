import type { PurchaseOrderListItem } from "../../PurchaseOrderList.interface";

export interface ProductGRNDialogProps {
  selectedPO: PurchaseOrderListItem | null;
  receivedQty: number | null;
  onGRNSave: (payload: {
    poId: number;
    supplierId: number;
    branchId: number;
    items: any[];
  }) => void;
  closeDialog: () => void;
}
