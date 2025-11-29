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

export interface CategoryStatusOptions {
  name: string;
  isActive: boolean;
}

export interface CategoryFormData {
  categoryName: string;
  categoryCode: string;
  selectedStatus: CategoryStatusOptions | null;
  profitMargin: any;
}

export interface SettingsAddEditCategoriesProps {
  selectedCategory?: Category | null;
  onClose: () => void;
  reloadData: () => void;
}
