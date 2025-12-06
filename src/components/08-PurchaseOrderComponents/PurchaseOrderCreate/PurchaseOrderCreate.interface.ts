export interface Supplier {
  supplierId: number;
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
  supplierIsActive: boolean;
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

export interface Branch {
  refBranchName: string;
  refBranchCode: string;
  refLocation: string;
  refMobile: string;
  refEmail: string;
  isMainBranch: boolean;
  isActive: boolean;
  refBTId: number;
  refBranchId: number;
  isOnline: boolean;
  isOffline: boolean;
  floors: any;
}

export interface Section {
  refSectionId: number;
  sectionName: string;
  sectionCode: string;
  categoryId: number;
  refSubCategoryId: number;
}

export interface Floor {
  refFloorId: number;
  floorName: string;
  floorCode: string;
  sections: Section[];
}

export interface Category {
  refCategoryId: number;
  categoryName: string;
  categoryCode: string;
  profitMargin: any;
  isActive: boolean;
  isDelete: boolean;
  createdAt: string;
  createdBy: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface SubCategory {
  refSubCategoryId: number;
  subCategoryName: string;
  subCategoryCode: string;
  isActive: boolean;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  isDelete: boolean;
  refCategoryId: number;
}

export interface LineItem {
  id: number;
  categoryId: number;
  subCategoryId: number;
  productDescription: string;
  unitPrice: number;
  quantity: number;
  discountPercent: number;
  discountAmount: number;
  total: number;
  locked?: boolean;
}

export interface LineValidationResult {
  valid: boolean;
  message?: string;
}

export interface BranchDetails {
  createdAt: string;
  createdBy: string;
  isActive: boolean;
  isDelete: boolean;
  isMainBranch: boolean;
  refBTId: number;
  refBranchCode: string;
  refBranchId: number;
  refBranchName: string;
  refBranchDoorNo?: string;
  refBranchStreet?: string;
  refBranchCity?: string;
  refBranchState?: string;
  refBranchPincode?: string;
  refEmail: string;
  refLocation: string;
  refMobile: string;
  updatedAt: string;
  updatedBy: string;

  branchCompanyName?: string;
  branchContactPerson?: string;
  branchPhone?: string;
  branchCountry?: string;
}

export interface PartyDetails {
  createdAt: string;
  createdBy: string;
  creditedDays: number;
  emergencyContactName: string;
  emergencyContactNumber: string;
  isDelete: boolean;
  supplierBankACNumber: string;
  supplierBankName: string;
  supplierCity: string;
  supplierCode: string;
  supplierCompanyName: string;
  supplierContactNumber: string;
  supplierCountry: string;
  supplierDoorNumber: string;
  supplierEmail: string;
  supplierGSTNumber: string;
  supplierIFSC: string;
  supplierId: number;
  supplierIsActive: string;
  supplierName: string;
  supplierPaymentTerms: string;
  supplierState: string;
  supplierStreet: string;
  supplierUPI: string;
  updatedAt: string;
  updatedBy: string;
}

export interface PurchaseOrderItem {
  category: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
}

export interface PurchaseOrderSummary {
  subTotal: string;
  taxPercentage: string;
  taxAmount: string;
  totalAmount: string;
}

export interface PurchaseOrderProps {
  from: any;
  to: any;
  invoiceNumber: any;
  logoBase64: any;
  items?: any[];
  summary: any;
}
