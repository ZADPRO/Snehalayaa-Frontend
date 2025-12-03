import React, { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { FloatLabel } from "primereact/floatlabel";

import type { SettingsAddEditAttributesProps } from "./AddEditAttributes.interface";
import {
  createProductField,
  updateProductField,
} from "./AddEditAttributes.function";

const AddEditAttributes: React.FC<SettingsAddEditAttributesProps> = ({
  selectedAttribute,
  onClose,
  reloadData,
}) => {
  const toast = useRef<Toast>(null);

  const [formData, setFormData] = useState({
    column_name: "",
    column_label: "",
    data_type: "",
    is_required: false,
    type: "DYNAMIC",
  });

  const dataTypeOptions = [
    { label: "Text", value: "TEXT" },
    { label: "Number", value: "INT" },
    { label: "Textarea", value: "TEXTAREA" },
    { label: "Date", value: "DATE" },
    { label: "Image", value: "IMAGE" },
    { label: "Boolean", value: "BOOLEAN" },
    { label: "Dropdown", value: "DROPDOWN" },
    { label: "MultiSelect", value: "MULTISELECT" },
  ];

  useEffect(() => {
    if (selectedAttribute) {
      setFormData({
        column_name: selectedAttribute.column_name || "",
        column_label: selectedAttribute.column_label || "",
        data_type: selectedAttribute.data_type || "",
        is_required: selectedAttribute.is_required || false,
        type: selectedAttribute.type || "DYNAMIC",
      });
    }
  }, [selectedAttribute]);

  const isEditable = formData.type === "DYNAMIC";

  const handleLabelChange = (value: string) => {
    if (!isEditable) return;
    const slug = value
      .toLowerCase()
      .replace(/[^a-z0-9_]+/g, "_")
      .replace(/^_+|_+$/g, "");
    setFormData((prev) => ({
      ...prev,
      column_label: value,
      column_name: slug,
    }));
  };

  const handleChange = (key: string, value: any) => {
    if (!isEditable) return;
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmitForm = async () => {
    try {
      if (!isEditable) {
        toast.current?.show({
          severity: "warn",
          summary: "Not Editable",
          detail: "This attribute is system generated and cannot be edited.",
          life: 4000,
        });
        return;
      }

      if (!formData.column_label || !formData.data_type) {
        toast.current?.show({
          severity: "warn",
          summary: "Missing Fields",
          detail: "Please fill all required fields.",
        });
        return;
      }

      const payload = {
        ...formData,
        is_required: Boolean(formData.is_required),
      };

      if (selectedAttribute?.id) {
        await updateProductField(selectedAttribute.id, payload);
      } else {
        await createProductField(payload);
      }

      reloadData();
      onClose();
    } catch (err: any) {
      console.error(err);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Something went wrong.",
      });
    }
  };

  return (
    <div className="p-2">
      <Toast ref={toast} />

      <div className="flex gap-3 mt-3">
        <div className="flex-1">
          <FloatLabel className="always-float">
            <InputText
              id="column_label"
              value={formData.column_label}
              className="w-full"
              onChange={(e) => handleLabelChange(e.target.value)}
              disabled={!isEditable}
            />
            <label htmlFor="column_label">Label</label>
          </FloatLabel>
        </div>

        <div className="flex-1">
          <FloatLabel className="always-float">
            <Dropdown
              id="data_type"
              value={formData.data_type}
              options={dataTypeOptions}
              onChange={(e) => handleChange("data_type", e.value)}
              className="w-full"
              disabled={!isEditable}
            />
            <label htmlFor="data_type">Data Type</label>
          </FloatLabel>
        </div>
      </div>

      <div className="mt-3">
        <FloatLabel className="always-float">
          <InputText
            id="column_name"
            value={formData.column_name}
            className="w-full"
            disabled
          />
          <label htmlFor="column_name">Column Name (Auto)</label>
        </FloatLabel>
      </div>

      <div className="flex items-center gap-2 mt-4">
        <Checkbox
          inputId="is_required"
          checked={formData.is_required}
          onChange={(e) => handleChange("is_required", e.checked)}
          disabled={!isEditable}
        />
        <label htmlFor="is_required">Is Required</label>
      </div>

      <div className="flex justify-end gap-2 mt-5">
        <Button label="Cancel" severity="secondary" onClick={onClose} />
        <Button
          label={selectedAttribute ? "Update" : "Save"}
          onClick={handleSubmitForm}
          disabled={!isEditable}
        />
      </div>
    </div>
  );
};

export default AddEditAttributes;
