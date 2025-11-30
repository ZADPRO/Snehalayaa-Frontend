export interface Employee {
  RefUserId: number;
  RefUserCustId: string;
  RefUserFName: string;
  RefUserLName: string;
  RefUserDesignation: string;
  RefUserStatus: string;
  RefRTId: number;
  RefUserBranchId: number;
  username: string;
  email: string;
  mobile: string;
  role: string;

  doorNumber: string;
  streetName: string;
  city: string;
  state: string;
  branch: string;

  CreatedAt: string;
  CreatedBy: string;
  UpdatedAt: string;
  UpdatedBy: string;
  isDelete: boolean;
}

export interface SettingsAddEditEmployeeProps {
  selectedEmployees: Employee | null;
  onClose: () => void;
  reloadData: () => void;
}
