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
