export interface Category {
  refCategoryId: number;
  categoryName: string;
  categoryCode: string;
  profitMargin: string;
  isActive: boolean;
  isDelete: boolean;
  createdAt: string;
  createdBy: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface DeleteCategoryResponse {
  message: string;
  status: boolean;
  confirmationNeeded?: boolean;
  subcategories?: SubCategory[];
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
