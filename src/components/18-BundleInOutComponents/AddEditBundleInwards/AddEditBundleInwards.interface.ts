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
