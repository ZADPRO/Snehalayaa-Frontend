import React, { type JSX } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { FloatLabel } from "primereact/floatlabel";
import type { Attribute } from "../../pages/13-Attributes/Attributes.interface";

interface PreviewFormProps {
  attributes: Attribute[];
}

const PreviewForm: React.FC<PreviewFormProps> = ({ attributes }) => {
  if (!attributes || attributes.length === 0) {
    return <p>No attributes to preview</p>;
  }

  const staticDropdownOptions = [
    { name: "Option 1", value: 1 },
    { name: "Option 2", value: 2 },
    { name: "Option 3", value: 3 },
  ];

  const renderField = (attr: Attribute) => {
    const label = attr.column_label + (attr.is_required ? " *" : "");
    const placeholder =
      attr.data_type === "DROPDOWN"
        ? `Select ${attr.column_label}`
        : `Enter ${attr.column_label}`;

    switch (attr.data_type) {
      case "TEXT":
      case "INT":
        return (
          <div className="flex-1">
            <FloatLabel className="always-float">
              <InputText
                value=""
                placeholder={placeholder}
                className="w-full"
                disabled
              />
              <label>{label}</label>
            </FloatLabel>
          </div>
        );

      case "DATE":
        return (
          <div className="flex-1">
            <FloatLabel className="always-float">
              <Calendar
                value={null}
                placeholder={placeholder}
                showIcon
                className="w-full"
                disabled
              />
              <label>{label}</label>
            </FloatLabel>
          </div>
        );

      case "TEXTAREA":
        return (
          <div className="w-full mt-3">
            <FloatLabel className="always-float">
              <textarea
                placeholder={placeholder}
                className="w-full p-2 border rounded"
                disabled
              />
              <label>{label}</label>
            </FloatLabel>
          </div>
        );

      case "IMAGE":
        return (
          <div className="w-full mt-3">
            <label className="block mb-1">{label}</label>
            <div className="border rounded p-2 bg-gray-100 text-center">
              Image Placeholder
            </div>
          </div>
        );

      case "BOOLEAN":
        return (
          <div className="flex-1 mt-3">
            <label className="flex items-center gap-2">
              <input type="checkbox" disabled />
              {label}
            </label>
          </div>
        );

      case "DROPDOWN":
        return (
          <div className="flex-1">
            <FloatLabel className="always-float">
              <Dropdown
                value={null}
                options={staticDropdownOptions}
                optionLabel="name"
                placeholder={placeholder}
                className="w-full"
                disabled
              />
              <label>{label}</label>
            </FloatLabel>
          </div>
        );

      default:
        return null;
    }
  };

  // Arrange fields in rows of 2 columns except IMAGE/TEXTAREA
  const rows: JSX.Element[] = [];
  let tempRow: JSX.Element[] = [];

  attributes.forEach((attr) => {
    const element = renderField(attr);
    if (!element) return; // skip nulls

    if (attr.data_type === "IMAGE" || attr.data_type === "TEXTAREA") {
      if (tempRow.length) {
        rows.push(
          <div className="flex gap-3 mt-3" key={rows.length}>
            {tempRow}
          </div>
        );
        tempRow = [];
      }
      rows.push(
        <div className="flex gap-3 mt-3" key={rows.length}>
          {element}
        </div>
      );
    } else {
      tempRow.push(element);
      if (tempRow.length === 2) {
        rows.push(
          <div className="flex gap-3 mt-3" key={rows.length}>
            {tempRow}
          </div>
        );
        tempRow = [];
      }
    }
  });

  if (tempRow.length) {
    rows.push(
      <div className="flex gap-3 mt-3" key={rows.length}>
        {tempRow}
      </div>
    );
  }

  return <div>{rows}</div>;
};

export default PreviewForm;
