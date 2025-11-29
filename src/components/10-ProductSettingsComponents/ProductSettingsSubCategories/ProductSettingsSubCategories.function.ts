import axios from "axios";
import { baseURL } from "../../../utils/helper";
import { saveAs } from "file-saver";
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import type { SubCategory } from "./ProductSettingsSubCategories.interface";

export const fetchSubCategories = async (): Promise<SubCategory[]> => {
  const token = localStorage.getItem("token") || "";
  const response = await axios.get(`${baseURL}/admin/settings/subcategories`, {
    headers: {
      Authorization: token,
    },
  });

  if (response.data?.status) {
    return response.data.data;
  } else {
    throw new Error(response.data.message || "Failed to fetch subcategories");
  }
};

export const deleteSubCategory = async (
  subCategoryId: number
): Promise<{ message: string; status: boolean }> => {
  const token = localStorage.getItem("token") || "";
  const url = `${baseURL}/admin/settings/subcategories/${subCategoryId}`;

  const response = await axios.delete(url, {
    headers: {
      Authorization: token,
    },
  });

  return response.data;
};

export const bulkDeleteSubCategories = async (
  subCategoriesId: number[]
): Promise<any> => {
  const token = localStorage.getItem("token") || "";
  const response = await axios.delete(
    `${baseURL}/admin/settings/subcategories`,
    {
      headers: { Authorization: token },
      data: {
        subCategoriesId,
      },
    }
  );
  console.log("response", response);
  return response.data;
};

export const exportCSV = (dtRef: React.RefObject<any>) => {
  dtRef.current?.exportCSV();
};

export const exportPdf = (categories: SubCategory[]) => {
  const doc = new jsPDF();
  autoTable(doc, {
    head: [["Code", "Name", "Created By", "Created At", "Status"]],
    body: categories.map((item) => [
      item.createdBy,
      item.createdAt,
      item.isActive ? "Active" : "Inactive",
    ]),
  });
  doc.save("categories.pdf");
};

export const exportExcel = (categories: SubCategory[]) => {
  const worksheet = XLSX.utils.json_to_sheet(
    categories.map((item) => ({
      CreatedBy: item.createdBy,
      CreatedAt: item.createdAt,
      Status: item.isActive ? "Active" : "Inactive",
    }))
  );
  const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
  });
  saveAs(blob, `categories_export_${new Date().getTime()}.xlsx`);
};
