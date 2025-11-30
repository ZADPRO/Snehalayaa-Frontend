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
