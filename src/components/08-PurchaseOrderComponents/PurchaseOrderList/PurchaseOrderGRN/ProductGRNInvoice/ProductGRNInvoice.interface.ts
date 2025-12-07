import type { PurchaseOrderListItem } from "../../PurchaseOrderList.interface";

export interface ProductGRNDialogProps {
  selectedPO: PurchaseOrderListItem | null;
  closeDialog: () => void;
  bundleDetails: any;
}
