import { Pencil, Plus, Trash2, FileSpreadsheet } from "lucide-react";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useState } from "react";
import {
  createMaster,
  deleteMaster,
  getMasterList,
  updateMaster,
} from "./ProductSettingsDesignColorSize.function";

const TableBox = ({ title }: { title: string }) => {
  const [items, setItems] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const type = title.toLowerCase();

  const loadData = async () => {
    try {
      const data = await getMasterList(type);
      const formatted = data.map((item: any) => ({
        id: item.id,
        name: item[`${type}Name`] || item.name,
        createdAt: item.createdAt,
        createdBy: item.createdBy,
      }));
      setItems(formatted);
    } catch (err) {
      console.error(`${title} load error`, err);
    }
  };

  const handleSave = async () => {
    if (!inputValue.trim()) return;

    try {
      if (editIndex !== null) {
        await updateMaster(type, items[editIndex].id, inputValue);
      } else {
        await createMaster(type, inputValue);
      }

      loadData();
      setDialogVisible(false);
      setInputValue("");
      setEditIndex(null);
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  const handleEdit = (rowData: any, index: number) => {
    setEditIndex(index);
    setInputValue(rowData.name);
    setDialogVisible(true);
  };

  const handleDelete = async () => {
    if (selectedIds.length === 0) return;
    await deleteMaster(type, selectedIds);
    loadData();
    setSelectedIds([]);
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="flex-1">
      <div className="flex items-center justify-between">
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
            // onClick={exportCSV}
          />
          <Button
            icon={<Plus size={16} />}
            severity="success"
            tooltip={`Add new ${title}`}
            onClick={() => setDialogVisible(true)}
          />
          <Button
            icon={<Pencil size={16} />}
            severity="info"
            tooltip={`Edit Selected ${title}`}
            disabled={selectedIds.length !== 1}
            onClick={() => {
              const index = items.findIndex((i) => i.id === selectedIds[0]);
              handleEdit(items[index], index);
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

      <DataTable
        value={filteredItems}
        showGridlines
        stripedRows
        scrollable
        scrollHeight="200px"
        className="mt-3"
        selectionMode="multiple"
        selection={selectedIds.map((id) => items.find((i) => i.id === id))}
        onSelectionChange={(e) =>
          setSelectedIds(e.value.map((row: any) => row.id))
        }
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

const ProductSettingsDesignColorSize: React.FC = () => {
  return (
    <div>
      <div className="flex gap-3">
        <TableBox title="Design" />
        <Divider layout="vertical" />
        <TableBox title="Color" />
      </div>
      <Divider />
      <div className="flex gap-3 mt-3">
        <TableBox title="Brand" />
        <Divider layout="vertical" />
        <TableBox title="Size" />
      </div>
    </div>
  );
};

export default ProductSettingsDesignColorSize;
