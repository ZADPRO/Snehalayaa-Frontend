export interface Supplier {
  supplierId?: number;
  supplierName: string;
  supplierCompanyName: string;
  supplierCode: string;
  supplierEmail: string;
  supplierGSTNumber: string;
  supplierPaymentTerms: string;
  supplierBankACNumber: string;
  supplierIFSC: string;
  supplierBankName: string;
  supplierUPI: string;
  supplierIsActive: any;
  supplierContactNumber: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  supplierDoorNumber: string;
  supplierStreet: string;
  supplierCity: string;
  supplierState: string;
  supplierCountry: string;
  creditedDays: number;
  pincode: string;
}

export interface SupplierStatusOptions {
  name: string;
  isActive: boolean;
}

export interface SupplierFormData {
  supplierName: string;
  supplierCompanyName: string;
  supplierCode: string;
  supplierEmail: string;
  supplierGSTNumber: string;
  supplierPaymentTerms: string;
  supplierBankACNumber: string;
  supplierIFSC: string;
  supplierBankName: string;
  supplierUPI: string;
  selectedStatus: SupplierStatusOptions | null;
  supplierContactNumber: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  supplierDoorNumber: string;
  supplierStreet: string;
  supplierCity: string;
  supplierState: string;
  supplierCountry: string;
  creditedDays: number;
  pincode: string;
}

export interface SettingsAddEditSupplierProps {
  selectedSupplier: Supplier | null;
  onClose: () => void;
  reloadData: () => void;
}
