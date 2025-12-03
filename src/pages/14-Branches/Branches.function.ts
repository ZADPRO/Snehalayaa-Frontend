import { saveAs } from "file-saver";
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { baseURL, baseURLV2 } from "../../utils/helper";
import api from "../../utils/api";
import type { Branch } from "./Branches.interface";

// Fetch all branches
export const fetchBranch = async (): Promise<Branch[]> => {
  const response = await api.get(`${baseURLV2}/admin/settings/branches`);
  if (response.data?.status) {
    return response.data.data;
  } else {
    throw new Error(response.data.message || "Failed to fetch Branch");
  }
};

// Delete a branch (with optional force delete)
export const deleteBranch = async (
  refBranchId: number,
  forceDelete: boolean = false
): Promise<any> => {
  const url = `${baseURL}/admin/settings/branches/${refBranchId}${
    forceDelete ? "?forceDelete=true" : ""
  }`;
  const response = await api.delete(url);
  return response.data;
};

// Export branches as CSV
export const exportCSV = (dtRef: React.RefObject<any>) => {
  dtRef.current?.exportCSV();
};

// Export branches as PDF
export const exportPdf = (branches: Branch[]) => {
  const doc = new jsPDF();
  autoTable(doc, {
    head: [
      [
        "Code",
        "Name",
        "Location",
        "Contact Number",
        "Email",
        "is Main Branch",
        "Status",
      ],
    ],
    body: branches.map((item) => [
      item.refBranchCode,
      item.refBranchName,
      item.refLocation,
      item.refMobile,
      item.refEmail,
      item.isMainBranch ? "Yes" : "No",
      item.isActive ? "Active" : "Inactive",
    ]),
  });
  doc.save("branches.pdf");
};

// Export branches as Excel
export const exportExcel = (branches: Branch[]) => {
  const worksheet = XLSX.utils.json_to_sheet(
    branches.map((item) => ({
      Code: item.refBranchCode,
      Name: item.refBranchName,
      Location: item.refLocation,
      ContactNumber: item.refMobile,
      Email: item.refEmail,
      isMainBranch: item.isMainBranch ? "Yes" : "No",
      Status: item.isActive ? "Active" : "Inactive",
    }))
  );

  const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
  });
  saveAs(blob, `branches_export_${new Date().getTime()}.xlsx`);
};
