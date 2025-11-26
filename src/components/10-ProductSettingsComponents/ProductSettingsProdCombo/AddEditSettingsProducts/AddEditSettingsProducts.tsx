import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import React from "react";

const AddEditSettingsProducts: React.FC = () => {
  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-4 mt-2">
        <div className="flex-1">
          <Dropdown className="w-full" placeholder="Select Category" />
        </div>

        <div className="flex-1">
          <Dropdown className="w-full" placeholder="Select Sub-Category" />
        </div>

        <div className="flex-1">
          <InputText className="w-full" placeholder="Enter Product Name" />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 mt-4">
        <div className="flex-1">
          <InputText className="w-full" placeholder="Enter HSN Code" />
        </div>

        <div className="flex-1">
          <Dropdown className="w-full" placeholder="Select Tax %" />
        </div>

        <div className="flex-1">
          <InputText
            className="w-full"
            placeholder="Product Code (auto generated)"
          />
        </div>
      </div>

      <div className="flex mt-4 justify-content-end">
        <div className="flex gap-3">
          <Button label="Clear" outlined />
          <Button label="Add Product" className="p-button-primary" />
        </div>
      </div>
    </div>
  );
};

export default AddEditSettingsProducts;
