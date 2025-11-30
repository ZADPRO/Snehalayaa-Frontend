import { Toast } from "primereact/toast";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Toolbar } from "primereact/toolbar";
import { Tooltip } from "primereact/tooltip";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Sidebar } from "primereact/sidebar";
import type { Employee } from "./ViewDeleteEmployees.interface";
import { fetchEmployees, deleteEmployee } from "./ViewDeleteEmployees.function";
import AddEditEmployees from "./AddEditEmployees/AddEditEmployees";

const ViewDeleteEmployees: React.FC = () => {
  const [employee, setEmployee] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee[]>([]);
  const [visibleRight, setVisibleRight] = useState<boolean>(false);
  const toast = useRef<Toast>(null);

  const editMode =
    Array.isArray(selectedEmployee) && selectedEmployee.length === 1;
  const selectedEmployees = editMode ? selectedEmployee[0] : null;

  const isSingleSelected = selectedEmployee.length === 1;
  const isAnySelected = selectedEmployee.length > 0;

  const load = async () => {
    try {
      const data = await fetchEmployees();
      console.log("data", data);
      setEmployee(data);
    } catch (err: any) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: err.message || "Failed to load categories",
        life: 3000,
      });
    }
  };
  useEffect(() => {
    load();
  }, []);

  const handleDelete = async () => {
    if (!selectedEmployee.length) return;

    const categoryToDelete = selectedEmployee[0];
    try {
      const res = await deleteEmployee(categoryToDelete.RefUserId);
      if (res.status) {
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: res.message,
        });
        setSelectedEmployee([]);
        load();
      } else if (res.confirmationNeeded) {
        toast.current?.show({
          severity: "warn",
          summary: "Needs Confirmation",
          detail: res.message,
        });
        // You can implement subcategory confirmation UI here if needed
      }
    } catch (err: any) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: err.message || "Failed to delete",
      });
    }
  };

  const leftToolbarTemplate = () => (
    <div className="flex gap-2">
      <Button
        icon={<Plus size={16} strokeWidth={2} />}
        severity="success"
        tooltip="Add Employee"
        disabled={isAnySelected}
        tooltipOptions={{ position: "left" }}
        onClick={() => setVisibleRight(true)}
      />
      <Button
        icon={<Pencil size={16} strokeWidth={2} />}
        severity="info"
        tooltip="Edit Employee"
        tooltipOptions={{ position: "left" }}
        disabled={!isSingleSelected}
        onClick={() => setVisibleRight(true)}
      />
      <Button
        icon={<Trash2 size={16} strokeWidth={2} />}
        severity="danger"
        tooltip="Delete Employee(s)"
        tooltipOptions={{ position: "left" }}
        disabled={!isAnySelected}
        onClick={handleDelete}
      />
    </div>
  );

  return (
    <div className="">
      <Toast ref={toast} />
      <Toolbar className="mb-2" left={leftToolbarTemplate} />
      <Tooltip target=".p-button" position="left" />

      <DataTable
        // ref={dt}
        id="employee-table"
        value={employee}
        selection={selectedEmployee}
        onSelectionChange={(e) => setSelectedEmployee(e.value as Employee[])}
        dataKey="RefUserId"
        selectionMode="multiple"
        paginator
        showGridlines
        stripedRows
        rows={10}
        rowsPerPageOptions={[5, 10, 20]}
        responsiveLayout="scroll"
      >
        <Column
          selectionMode="multiple"
          headerStyle={{ textAlign: "center" }}
        />
        <Column header="SNo" body={(_, opts) => opts.rowIndex + 1} />

        <Column field="RefUserFName" header="Name" sortable />
        <Column field="RefUserCustId" header="User CustId" sortable />
        <Column field="RefUserDesignation" header="Designation" />
        <Column field="email" header="Email" />
        <Column field="RefUserStatus" header="Status" />
      </DataTable>

      <Sidebar
        visible={visibleRight}
        position="right"
        header={editMode ? "Edit Employee" : "Add Employee"}
        onHide={() => {
          setVisibleRight(false);
          setSelectedEmployee([]);
        }}
        style={{ width: "50vw" }}
      >
        <AddEditEmployees
          selectedEmployees={selectedEmployees}
          onClose={() => setVisibleRight(false)}
          reloadData={load}
        />
      </Sidebar>
    </div>
  );
};

export default ViewDeleteEmployees;
