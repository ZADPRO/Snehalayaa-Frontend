export interface SubCategory {
  createdAt: string;
  createdBy: string;
  isActive: boolean;
  isDelete: boolean;
  refCategoryId: any;
  refSubCategoryId: number;
  subCategoryCode: string;
  subCategoryName: string;
  updatedAt: string;
  updatedBy: string;
}

export interface Category {
  refCategoryId: number;
  categoryName: string;
  categoryCode: string;
}

export interface SubCategoryStatusOptions {
  name: string;
  isActive: boolean;
}

export interface SubCategoryFormData {
  refCategoryId: any;
  subCategoryName: string;
  subCategoryCode: string;
  selectedStatus: SubCategoryStatusOptions | null;
}

export interface SettingsAddEditSubCategoryProps {
  selectedSubCategory: SubCategory | null;
  onClose: () => void;
  reloadData: () => void;
}

export interface CategoryOption {
  refCategoryId: number;
  categoryName: string;
}
