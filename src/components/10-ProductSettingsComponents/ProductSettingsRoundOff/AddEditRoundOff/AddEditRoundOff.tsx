import React, { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Check } from "lucide-react";

import type { AddEditRoundOffProps } from "./AddEditRoundOff.interface";
import { createRoundOff, updateRoundOff } from "./AddEditRoundOff.function";

const AddEditRoundOff: React.FC<AddEditRoundOffProps> = ({
  editData,
  onSuccess,
}) => {
  const toast = useRef<any>(null);

  const [fromRange, setFromRange] = useState<string>("");
  const [toRange, setToRange] = useState<string>("");
  const [addPrice, setAddPrice] = useState<string>("");

  const [tableData, setTableData] = useState<any[]>([]);

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const isRangeLocked = tableData.length > 0;

  const allowOnlyNumbers = (value: string) => value.replace(/[^0-9]/g, "");

  // -----------------------------
  useEffect(() => {
    if (editData) {
      setFromRange(String(editData.fromRange));
      setToRange(String(editData.toRange));

      setTableData(
        editData.prices.map((p: number, index: number) => ({
          id: index + 1,
          price: p,
          fromRange: editData.fromRange,
          toRange: editData.toRange,
        }))
      );
    }
  }, [editData]);

  const isAddButtonDisabled = () => {
    const from = Number(fromRange);
    const to = Number(toRange);
    const price = Number(addPrice);

    if (!from || !to || !price) return true;
    if (from >= to) return true;
    if (price < from || price > to) return true;

    return false;
  };

  const handleAdd = () => {
    const from = Number(fromRange);
    const to = Number(toRange);
    const price = Number(addPrice);

    const isDuplicate = tableData.some(
      (row) => row.price === price && row.id !== editingId
    );

    if (isDuplicate) {
      toast.current.show({
        severity: "error",
        summary: "Duplicate",
        detail: "Price already exists.",
      });
      return;
    }

    if (isEditing && editingId !== null) {
      const updated = tableData.map((row) =>
        row.id === editingId ? { ...row, price } : row
      );
      setTableData(updated);
      setIsEditing(false);
      setEditingId(null);
      setAddPrice("");
      return;
    }

    const newRow = {
      id: tableData.length + 1,
      price,
      fromRange: from,
      toRange: to,
    };

    setTableData([...tableData, newRow]);
    setAddPrice("");
  };

  const handleDelete = (rowData: any) => {
    const updated = tableData.filter((row) => row.id !== rowData.id);
    setTableData(updated);

    if (updated.length === 0) {
      setFromRange("");
      setToRange("");
    }
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        id: editData?.id || undefined,
        fromRange: String(fromRange),
        toRange: String(toRange),
        prices: tableData.map((r) => r.price),
      };

      if (editData) {
        await updateRoundOff(payload);
      } else {
        await createRoundOff(payload);
      }

      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Saved successfully",
      });

      onSuccess();
    } catch (err) {
      console.error(err);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to save",
      });
    }
  };

  const editTemplate = (rowData: any) => (
    <Button
      icon="pi pi-pencil"
      rounded
      text
      onClick={() => {
        setAddPrice(String(rowData.price));
        setIsEditing(true);
        setEditingId(rowData.id);
      }}
    />
  );

  const deleteTemplate = (rowData: any) => (
    <Button
      icon="pi pi-trash"
      rounded
      text
      severity="danger"
      onClick={() => handleDelete(rowData)}
    />
  );

  return (
    <div>
      <Toast ref={toast} />

      {/* Range */}
      <div className="flex mt-3 gap-3">
        <div className="flex-1">
          <FloatLabel className="always-float">
            <InputText
              disabled={isRangeLocked}
              value={fromRange}
              className="w-full"
              onChange={(e) => setFromRange(allowOnlyNumbers(e.target.value))}
            />
            <label>From Range</label>
          </FloatLabel>
        </div>

        <div className="flex-1">
          <FloatLabel className="always-float">
            <InputText
              disabled={isRangeLocked}
              value={toRange}
              className="w-full"
              onChange={(e) => setToRange(allowOnlyNumbers(e.target.value))}
            />
            <label>To Range</label>
          </FloatLabel>
        </div>
      </div>

      {/* Price */}
      <div className="flex mt-3 gap-3">
        <div className="flex-1">
          <FloatLabel className="always-float">
            <InputText
              value={addPrice}
              className="w-full"
              onChange={(e) => setAddPrice(allowOnlyNumbers(e.target.value))}
            />
            <label>Add Price</label>
          </FloatLabel>
        </div>

        <div className="flex-1 flex justify-end gap-3">
          <Button
            label={isEditing ? "Update" : "Add"}
            disabled={isAddButtonDisabled()}
            onClick={handleAdd}
          />
          <Button
            label="Clear"
            severity="danger"
            onClick={() => {
              setTableData([]);
              setAddPrice("");
              setFromRange("");
              setToRange("");
              setIsEditing(false);
              setEditingId(null);
            }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="mt-4">
        <DataTable value={tableData} showGridlines stripedRows>
          <Column field="id" header="S.No" />
          <Column field="fromRange" header="From" />
          <Column field="toRange" header="To" />
          <Column field="price" header="Price" />
          <Column header="Edit" body={editTemplate} />
          <Column header="Delete" body={deleteTemplate} />
        </DataTable>
      </div>

      {/* Submit */}
      <div className="fixed bottom-0 left-0 w-full shadow-md p-4 text-right">
        <Button
          icon={<Check />}
          className="bg-[#8e5ea8] border-none"
          onClick={handleSubmit}
        />
      </div>
    </div>
  );
};

export default AddEditRoundOff;
