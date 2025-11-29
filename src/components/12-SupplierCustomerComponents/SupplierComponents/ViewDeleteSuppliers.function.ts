import axios from "axios";
import { baseURL } from "../../../utils/helper";
import { saveAs } from "file-saver";
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import type { Supplier } from "./ViewDeleteSuppliers.interface";

export const fetchSupplier = async (): Promise<Supplier[]> => {
  const response = await axios.get(`${baseURL}/admin/suppliers/read`, {
    headers: {
      Authorization: localStorage.getItem("token") || "",
    },
  });

  if (response.data?.status) {
    return response.data.data;
  } else {
    throw new Error(response.data.message || "Failed to fetch Supplier");
  }
};

export const deleteSupplier = async (
  supplierId: number,
  forceDelete: boolean = false
): Promise<any> => {
  const token = localStorage.getItem("token") || "";
  const url = `${baseURL}/admin/suppliers/delete/${supplierId}${
    forceDelete ? "?forceDelete=true" : ""
  }`;

  const response = await axios.delete(url, {
    headers: { Authorization: token },
  });

  return response.data;
};
export const exportCSV = (dtRef: React.RefObject<any>) => {
  dtRef.current?.exportCSV();
};

export const exportPdf = (suppliers: Supplier[]) => {
  const doc = new jsPDF();
  autoTable(doc, {
    head: [["Code", "Name", "Company Name", "Contact Number", "Status"]],
    body: suppliers.map((item) => [
      item.supplierCode,
      item.supplierName,
      item.supplierCompanyName,
      item.supplierContactNumber,
      item.supplierIsActive ? "Active" : "Inactive",
    ]),
  });
  doc.save("suppliers.pdf");
};

export const exportExcel = (suppliers: Supplier[]) => {
  const worksheet = XLSX.utils.json_to_sheet(
    suppliers.map((item) => ({
      Code: item.supplierCode,
      Name: item.supplierName,
      CompanyName: item.supplierCompanyName,
      ContactNumber: item.supplierContactNumber,
      Status: item.supplierIsActive ? "Active" : "Inactive",
    }))
  );
  const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
  });
  saveAs(blob, `categories_export_${new Date().getTime()}.xlsx`);
};

export const deleteSuppliers = async (
  supplierIds: number[],
  isDelete: boolean = true // default true = soft delete, false = restore
): Promise<any> => {
  const token = localStorage.getItem("token") || "";

  const response = await axios.post(
    `${baseURL}/admin/suppliers/delete/bulk`,
    {
      ids: supplierIds,
      isDelete,
    },
    {
      headers: { Authorization: token },
    }
  );

  return response.data;
};
