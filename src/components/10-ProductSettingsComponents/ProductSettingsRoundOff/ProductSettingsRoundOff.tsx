import React, { useEffect, useRef, useState } from "react";

import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import { Tooltip } from "primereact/tooltip";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Sidebar } from "primereact/sidebar";

import {
  Plus,
  Pencil,
  Trash2,
  FileSpreadsheet,
  FileText,
  FileSignature,
} from "lucide-react";

import AddEditRoundOff from "./AddEditRoundOff/AddEditRoundOff";
import { fetchRoundOffValues } from "./ProductSettingsRoundOff.function";

const ProductSettingsRoundOff: React.FC = () => {
  const toast = useRef<any>(null);

  const [visibleRight, setVisibleRight] = useState(false);

  const [roundOffList, setRoundOffList] = useState<any[]>([]);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [editRowData, setEditRowData] = useState(null);

  const [maxPriceColumns, setMaxPriceColumns] = useState(0);

  const isSingleSelected = selectedRows.length === 1;
  const isAnySelected = selectedRows.length > 0;

  // -----------------------------
  // Fetch Table Data
  // -----------------------------
  const fetchRoundOffData = async () => {
    try {
      const res = await fetchRoundOffValues();
      const list = res;

      setRoundOffList(list);

      // find the maximum prices length
      const maxLen = Math.max(...list.map((row: any) => row.prices.length));
      setMaxPriceColumns(maxLen);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRoundOffData();
  }, []);

  // -----------------------------
  // Toolbar Buttons
  // -----------------------------
  const leftToolbarTemplate = () => (
    <div className="flex gap-2">
      <Button
        icon={<Plus size={16} />}
        severity="success"
        tooltip="Add Round Off"
        onClick={() => {
          setEditRowData(null);
          setVisibleRight(true);
        }}
      />

      <Button
        icon={<Pencil size={16} />}
        severity="info"
        tooltip="Edit"
        disabled={!isSingleSelected}
        onClick={() => {
          setEditRowData(selectedRows[0]);
          setVisibleRight(true);
        }}
      />

      <Button
        icon={<Trash2 size={16} />}
        severity="danger"
        tooltip="Delete"
        disabled={!isAnySelected}
        onClick={() => {
          toast.current.show({
            severity: "info",
            summary: "Delete",
            detail: "Delete API coming next.",
          });
        }}
      />
    </div>
  );

  const rightToolbarTemplate = () => (
    <div className="flex gap-2 items-center">
      <Button
        icon={<FileText size={16} />}
        severity="secondary"
        tooltip="CSV"
      />
      <Button
        icon={<FileSpreadsheet size={16} />}
        severity="success"
        tooltip="Excel"
      />
      <Button
        icon={<FileSignature size={16} />}
        severity="danger"
        tooltip="PDF"
      />
    </div>
  );

  return (
    <div>
      <Toast ref={toast} />

      <Toolbar
        className="mb-2"
        left={leftToolbarTemplate}
        right={rightToolbarTemplate}
      />
      <Tooltip target=".p-button" position="left" />

      {/* TABLE */}
      <DataTable
        value={roundOffList}
        selectionMode="multiple"
        selection={selectedRows}
        onSelectionChange={(e) => setSelectedRows(e.value)}
        dataKey="id"
        showGridlines
        stripedRows
      >
        <Column
          selectionMode="multiple"
          headerClassName="align-start-header"
          headerStyle={{ textAlign: "center", justifyContent: "flex-start" }}
        />
        <Column field="id" header="S.No" />
        <Column field="fromRange" header="From" />
        <Column field="toRange" header="To" />
        {/* 🔥 DYNAMIC PRICE COLUMNS */}
        {Array.from({ length: maxPriceColumns }).map((_, index) => (
          <Column
            key={index}
            header={`Price ${index + 1}`}
            body={(row) => row.prices[index] ?? ""}
          />
        ))}
      </DataTable>

      {/* SIDEBAR */}
      <Sidebar
        visible={visibleRight}
        position="right"
        style={{ width: "50vw" }}
        onHide={() => setVisibleRight(false)}
      >
        <AddEditRoundOff
          editData={editRowData}
          onSuccess={() => {
            setVisibleRight(false);
            fetchRoundOffData();
          }}
        />
      </Sidebar>
    </div>
  );
};

export default ProductSettingsRoundOff;
