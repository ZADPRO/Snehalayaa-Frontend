import type { BundleInwardItem } from "../../../pages/18-BundleInOut/BundleInOut.interface";

export interface BillItem {
  _id: number | null;
  billDate: Date | null;
  billNo: string;
  billQty: number;
  taxableValue: number;
  taxPercent: number;
  taxAmount: number;
  invoiceValue: number;
}

export interface FormState {
  poId: number | null;
  poDate: Date | null;
  supplierId: number | null;
  location: string;
  poValue: number;
  receivingType: string;
  remarks: string;
  poQty: number;
  boxCount: number;

  billList: BillItem[];
  billForm: BillItem & { _id: number | null };

  grnDate: Date | null;
  grnStatus: string;
  grnValue: number;
  bundleStatus: string;
  transporterName: string;
  createdDate: Date | null;
}

export interface AddEditProps {
  editData?: BundleInwardItem | null;
  onSuccess: () => void;
}
