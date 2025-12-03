import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Toast } from "primereact/toast";
import React, { useEffect, useRef, useState } from "react";
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import { Pencil, Plus } from "lucide-react";
import { Sidebar } from "primereact/sidebar";
import { Dialog } from "primereact/dialog";

import backgroundImage from "../../assets/background/bg.png";
import { User } from "lucide-react";
import type { Attribute } from "./Attributes.interface";
import { fetchAttribute } from "./Attributes.function";
import PreviewForm from "../../components/13-AttributesComponents/PreviewForm";
import AddEditAttributes from "../../components/13-AttributesComponents/AddEditAttributes/AddEditAttributes";

const Attributes: React.FC = () => {
  const toast = useRef<Toast>(null);
  const dt = useRef<DataTable<Attribute[]>>(null);

  const [attributeSidebarVisible, setAttributeSidebarVisible] =
    useState<boolean>(false);
  const [attributePreviewForm, setAttributePreviewForm] =
    useState<boolean>(false);

  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [selectedAttributes, setSelectedAttributes] = useState<Attribute[]>([]);

  const editMode =
    Array.isArray(selectedAttributes) && selectedAttributes.length === 1;
  const selectedAttribute = editMode ? selectedAttributes[0] : null;

  const [previewAttributes, setPreviewAttributes] = useState<Attribute[]>([]);

  const loadAttributes = async () => {
    try {
      const data = await fetchAttribute();
      setAttributes(data);
    } catch (error: any) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: error.message || "Failed to load attributes",
        life: 3000,
      });
    }
  };

  const onAddClick = () => {
    setAttributeSidebarVisible(true);
  };

  const onPreviewClick = async () => {
    try {
      const data = await fetchAttribute();
      console.log("Preview Form Data:", data);
      setPreviewAttributes(data); // ✅ store in state
      setAttributePreviewForm(true); // open dialog
    } catch (error: any) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: error.message || "Failed to fetch preview data",
        life: 3000,
      });
    }
  };

  const leftToolbarTemplate = () => (
    <div className="flex gap-2">
      <Button
        icon={<Plus size={16} strokeWidth={2} />}
        severity="success"
        tooltip="Add Attribute"
        // disabled={isAnySelected}
        tooltipOptions={{ position: "left" }}
        onClick={onAddClick}
      />
      <Button
        icon={<Pencil size={16} strokeWidth={2} />}
        severity="info"
        tooltip="Edit Attribute"
        tooltipOptions={{ position: "left" }}
        disabled={selectedAttributes.length !== 1} // ✅ only enable if exactly 1 selected
        onClick={() => setAttributeSidebarVisible(true)}
      />

      <Button
        // severity="danger"
        tooltip="Preview Form"
        label="Preview Form"
        tooltipOptions={{ position: "left" }}
        // disabled={!isAnySelected}
        onClick={onPreviewClick}
      />
    </div>
  );

  // Initial load
  useEffect(() => {
    loadAttributes();
  }, []);

  return (
    <div>
      <div
        className="ps-container"
        style={{
          backgroundColor: "#f5f5f5",
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        <div className="ps-topbar">
          <div className="ps-left">
            <button
              className="ps-back-btn"
              onClick={() => window.history.back()}
            >
              Back
            </button>
          </div>

          <p className="uppercase font-semibold text-lg">Attributes</p>

          <div className="ps-right">
            <User size={32} color="#6f1e60" />
          </div>
        </div>
        <div className="p-3">
          <Toolbar left={leftToolbarTemplate} />

          <DataTable
            ref={dt}
            className="mt-2"
            value={attributes}
            selection={selectedAttributes[0] || null} // single selected attribute
            onSelectionChange={(e) =>
              setSelectedAttributes(e.value ? [e.value] : [])
            }
            dataKey="id"
            selectionMode="single"
            paginator
            showGridlines
            stripedRows
            rows={10}
            rowsPerPageOptions={[10, 20, 50]}
            responsiveLayout="scroll"
          >
            <Column
              selectionMode="single"
              header="#"
              headerStyle={{ textAlign: "center" }}
            />
            <Column header="S.No" body={(_, opts) => opts.rowIndex + 1} />
            <Column field="column_label" header="Label" sortable />
            <Column field="data_type" header="Data Type" sortable />
            <Column
              field="is_required"
              header="Required"
              body={(rowData) =>
                rowData.is_required ? (
                  <span className="text-green-500 font-semibold">Yes</span>
                ) : (
                  <span className="text-gray-500">No</span>
                )
              }
            />
            <Column field="type" header="Type" sortable />
            <Column
              field="isDelete"
              header="Status"
              body={(rowData) =>
                rowData.isDelete ? (
                  <span className="text-red-500 font-semibold">Deleted</span>
                ) : (
                  <span className="text-green-500 font-semibold">Active</span>
                )
              }
            />
            <Column field="createdBy" header="Created By" />
            <Column field="createdAt" header="Created At" />
          </DataTable>
        </div>
        <Toast ref={toast} />

        <Sidebar
          position="right"
          style={{ width: "50vw" }}
          header={selectedAttribute ? "Edit Attribute" : "Add Attribute"}
          visible={attributeSidebarVisible}
          onHide={() => setAttributeSidebarVisible(false)}
        >
          <AddEditAttributes
            selectedAttribute={selectedAttribute}
            onClose={() => {
              setAttributeSidebarVisible(false);
              setSelectedAttributes([]);
            }}
            reloadData={loadAttributes}
          />
        </Sidebar>

        <Dialog
          header="Preview"
          visible={attributePreviewForm}
          style={{ width: "70vw" }}
          onHide={() => setAttributePreviewForm(false)}
        >
          <PreviewForm attributes={previewAttributes} />
        </Dialog>
      </div>
    </div>
  );
};

export default Attributes;
