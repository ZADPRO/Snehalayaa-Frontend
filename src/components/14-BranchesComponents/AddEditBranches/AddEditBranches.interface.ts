export interface Branch {
  refBranchId?: number;
  refBranchName: string;
  refBranchCode: string;
  refLocation: string;
  refMobile: string;
  refEmail: string;
  isMainBranch: boolean;
  isActive: boolean;
  refBTId?: number;
  isOnline: boolean;
  isOffline: boolean;
  refBranchDoorNo?: string;
  refBranchStreet?: string;
  refBranchCity?: string;
  refBranchState?: string;
  refBranchPincode?: string;
  floors: Floor[];
}

export interface BranchFormData {
  refBranchName: string;
  refBranchCode: string;
  refLocation: string;
  refMobile: string;
  refEmail: string;
  isMainBranch: boolean;
  isOnline: boolean;
  isOffline: boolean;
  refBranchDoorNo?: string;
  refBranchStreet?: string;
  refBranchCity?: string;
  refBranchState?: string;
  refBranchPincode?: string;
  selectedStatus: BranchStatusOptions | null;
  floors: Floor[];
}

export interface BranchStatusOptions {
  name: string;
  isActive: boolean;
}

export interface Section {
  sectionName: string;
  sectionCode: string;
  categoryId: number;
  refSubCategoryId: number;
}

export interface Floor {
  floorName: string;
  floorCode: string;
  sections: Section[];
}
export interface Category {
  refCategoryId: number;
  categoryName: string;
}

export interface SubCategory {
  refSubCategoryId: number;
  subCategoryName: string;
  refCategoryId: number;
  isDelete: boolean;
}

export interface SettingsAddEditBranchProps {
  selectedBranches: Branch | null;
  onClose: () => void;
  reloadData: () => void;
  categories: Category[];
  subCategories: SubCategory[];
}

export interface FloorForm {
  refFloorName: string;
  refFloorOrder: number;
  isActive: boolean;
  sections: SectionForm[];
}

export interface SectionForm {
  refSectionName: string;
  refSectionCode: string;
  isActive: boolean;
}
