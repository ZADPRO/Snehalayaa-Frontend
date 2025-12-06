export interface BillItem {
  id: number;
  inward_id: number;
  bill_date: string;
  bill_no: string;
  bill_qty: string;
  taxable_value: string;
  tax_percent: string;
  tax_amount: string;
  invoice_value: string;
  created_at: string;
}

export interface BundleInwardItem {
  inward_id: number;
  po_id: number;
  po_record_id: number;
  po_number: string;

  po_date: string;
  supplier_id: number;
  location: string;

  po_value: string;
  receiving_type: string;
  remarks: string;

  po_qty: string;
  box_count: string;

  grn_date: string;
  grn_status: string;
  grn_value: string;

  bundle_status: string;
  transporter_name: string;
  created_date: string;
  created_at: string;
  updated_at: string | null;

  total: string; // from PurchaseOrders.total

  bills: BillItem[];
}

export interface BundleInOutResponse {
  status: boolean;
  token: string;
  data: BundleInwardItem[];
}
