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

export interface EmployeeStatusOptions {
  name: string;
  refUserStatus: string;
}

export interface EmployeeFormData {
  branchId: number;
  roleTypeId: number;
  RefUserCustId: string;
  designation: string;
  firstName: string;
  lastName: string;
  selectedStatus: EmployeeStatusOptions | null;
  city: string;
  doorNumber: string;
  refRTId: number;
  email: string;
  mobile: string;
  state: string;
  streetName: string;
  username: string;
  selectedRoleType?: EmployeeRoleType | null;
  selectedBranch?: EmployeeBranch | null;
}

export interface SettingsAddEditEmployeeProps {
  selectedEmployees: Employee | null;
  onClose: () => void;
  reloadData: () => void;
}

export interface EmployeeRoleType {
  refRTId: number;
  refRTName: string;
}

export interface EmployeeBranch {
  refBranchId: number;
  refBranchName: string;
}
