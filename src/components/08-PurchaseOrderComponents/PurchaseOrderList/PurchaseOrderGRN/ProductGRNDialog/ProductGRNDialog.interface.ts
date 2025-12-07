import type { PurchaseOrderListItem } from "../../PurchaseOrderList.interface";

export interface ProductGRNDialogProps {
  selectedPO: PurchaseOrderListItem | null;
  receivedQty: number | null;
  quantityInMeters: "yes" | "no" | null;
  clothType: "sarees" | "readymade" | null;
  onGRNSave: (payload: {
    poId: number;
    supplierId: number;
    branchId: number;
    items: any[];
  }) => void;
  closeDialog: () => void;
}

export interface OptionItem {
  label: string;
  value: number;
}

export interface RoundOffRule {
  fromRange: string;
  toRange: string;
  prices: number[];
}
