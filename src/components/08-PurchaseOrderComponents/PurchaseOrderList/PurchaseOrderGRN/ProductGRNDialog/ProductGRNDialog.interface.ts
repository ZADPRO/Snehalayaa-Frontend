import type { PurchaseOrderListItem } from "../../PurchaseOrderList.interface";

export interface ProductGRNDialogProps {
  selectedPO: PurchaseOrderListItem | null;
  receivedQty: number | null;
  onGRNSave: (items: any[]) => void;
  closeDialog: () => void;
}
