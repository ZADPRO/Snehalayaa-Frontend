import React, { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { Pencil, Plus, Trash2, FileSpreadsheet } from "lucide-react";

import {
  getMasterList,
  createMaster,
  updateMaster,
  deleteMaster,
} from "./ProductSettingsPatternVarient.function";
import { Divider } from "primereact/divider";

const TableBox = ({ title }: { title: string }) => {
  const lowercase = title.toLowerCase(); // "pattern", "varient"

  const endpoint =
    lowercase === "pattern"
      ? "patterns"
      : lowercase === "varient"
      ? "varient"
      : "";

  const [items, setItems] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [search, setSearch] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const loadData = async () => {
    try {
      const data = await getMasterList(endpoint);

      const formatted = data.map((item: any) => ({
        id: item.id,
        name:
          item.PatternName ||
          item.VarientName ||
          item[`${endpoint}Name`] ||
          item.name,
        createdAt: item.createdAt,
        createdBy: item.createdBy,
      }));

      setItems(formatted);
    } catch (error) {
      console.error(`Failed to load ${title}`, error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async () => {
    if (!inputValue.trim()) return;

    try {
      if (editIndex !== null) {
        await updateMaster(endpoint, items[editIndex].id, inputValue);
      } else {
        await createMaster(endpoint, inputValue);
      }

      loadData();
      setDialogVisible(false);
      setInputValue("");
      setEditIndex(null);
    } catch (err) {
      console.error(`Failed to save ${title}`, err);
    }
  };

  const handleDelete = async () => {
    if (!selectedIds.length) return;

    await deleteMaster(endpoint, selectedIds);
    loadData();
    setSelectedIds([]);
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const exportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Name", ...items.map((i) => i.name)].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.href = encodedUri;
    link.download = `${title}.csv`;
    link.click();
  };

  return (
    <div className="flex-1">
      {/* Header Row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <p>{title}</p>

          <InputText
            placeholder={`Search ${title}`}
            className="w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Button
            icon={<FileSpreadsheet size={16} />}
            severity="secondary"
            tooltip={`Export ${title} as CSV`}
            onClick={exportCSV}
          />

          <Button
            icon={<Plus size={16} />}
            severity="success"
            tooltip={`Add ${title}`}
            onClick={() => setDialogVisible(true)}
          />

          <Button
            icon={<Pencil size={16} />}
            severity="info"
            tooltip={`Edit Selected ${title}`}
            disabled={selectedIds.length !== 1}
            onClick={() => {
              const index = items.findIndex((i) => i.id === selectedIds[0]);
              setEditIndex(index);
              setInputValue(items[index].name);
              setDialogVisible(true);
            }}
          />

          <Button
            icon={<Trash2 size={16} />}
            severity="danger"
            tooltip={`Delete Selected ${title}`}
            disabled={selectedIds.length === 0}
            onClick={handleDelete}
          />
        </div>
      </div>

      {/* Table */}
      <DataTable
        value={filteredItems}
        selectionMode="multiple"
        selection={items.filter((i) => selectedIds.includes(i.id))}
        onSelectionChange={(e) =>
          setSelectedIds(e.value.map((row: any) => row.id))
        }
        showGridlines
        stripedRows
        scrollable
      >
        <Column
          selectionMode="multiple"
          headerClassName="align-start-header"
          headerStyle={{ textAlign: "center", justifyContent: "flex-start" }}
        />
        <Column header="S.No" body={(_, opts) => opts.rowIndex + 1} />
        <Column field="name" header={`${title} Name`} sortable />
        <Column field="createdAt" header="Created At" sortable />
        <Column field="createdBy" header="Created By" sortable />
      </DataTable>

      {/* Dialog */}
      <Dialog
        header={editIndex !== null ? `Edit ${title}` : `Add ${title}`}
        visible={dialogVisible}
        style={{ width: "30vw" }}
        onHide={() => {
          setDialogVisible(false);
          setInputValue("");
          setEditIndex(null);
        }}
      >
        <div className="flex flex-col gap-3">
          <label>{title} Name</label>

          <InputText
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`Enter ${title} name`}
          />

          <Button label="Save" onClick={handleSave} />
        </div>
      </Dialog>
    </div>
  );
};

const ProductSettingsPatternVarient: React.FC = () => {
  return (
    <div className="flex gap-3">
      <TableBox title="Pattern" />
      <Divider layout="vertical" />
      <TableBox title="Varient" />
    </div>
  );
};

export default ProductSettingsPatternVarient;
