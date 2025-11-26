import React, { useState, useRef } from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

import {
  FileSpreadsheet,
  FileDown,
  FileText,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";

import AddEditSettingsProducts from "./AddEditSettingsProducts/AddEditSettingsProducts";

const ProductSettingsProdCombo: React.FC = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const dt = useRef<DataTable<any>>(null);

  const tableData: any[] = [];

  const exportCSV = () => dt.current?.exportCSV();

  const exportExcel = () => {
    import("xlsx").then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(tableData);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
      const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      saveFile(
        excelBuffer,
        "Products.xlsx",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
    });
  };

  const exportPDF = () => {};

  const saveFile = (buffer: any, fileName: string, type: string) => {
    const blob = new Blob([buffer], { type });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  };

  const tableHeader = (
    <div className="flex justify-between items-center w-full">
      <div className="flex gap-2">
        <Button
          onClick={exportCSV}
          className="p-button-outlined"
          tooltip="Export CSV"
          icon={<FileText size={18} />}
        />

        <Button
          onClick={exportExcel}
          className="p-button-outlined"
          tooltip="Export Excel"
          icon={<FileSpreadsheet size={18} />}
        />

        <Button
          onClick={exportPDF}
          className="p-button-outlined"
          tooltip="Export PDF"
          icon={<FileDown size={18} />}
        />
      </div>

      <div className="flex gap-2">
        <Button
          onClick={() => setShowDialog(true)}
          className="p-button-success"
          tooltip="Add"
          icon={<Plus size={16} />}
        />

        <Button
          className="p-button-warning"
          tooltip="Edit"
          icon={<Pencil size={16} />}
        />

        <Button
          className="p-button-danger"
          tooltip="Delete"
          icon={<Trash2 size={16} />}
        />
      </div>
    </div>
  );

  return (
    <div>
      <DataTable
        ref={dt}
        value={tableData}
        showGridlines
        scrollable
        header={tableHeader}
        selectionMode="checkbox"
        selection={selectedRows}
        onSelectionChange={(e) => setSelectedRows(e.value)}
        dataKey="id"
      >
        <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />

        <Column field="sno" header="S.No" />
        <Column field="productName" header="Product Name" />
        <Column field="categories" header="Categories" />
        <Column field="subCategories" header="Sub Categories" />
        <Column field="hsn" header="HSN Code" />
        <Column field="tax" header="Tax %" />
        <Column field="productCode" header="Product Code" />
        <Column field="createdAt" header="Created At" />
        <Column field="createdBy" header="Created By" />
        <Column field="updatedAt" header="Updated At" />
        <Column field="updatedBy" header="Updated By" />
      </DataTable>

      <Dialog
        header="Add / Edit Product"
        visible={showDialog}
        maximizable
        modal
        className="w-[60vw] sm:w-[80vw]"
        onHide={() => setShowDialog(false)}
      >
        <AddEditSettingsProducts />
      </Dialog>
    </div>
  );
};

export default ProductSettingsProdCombo;
