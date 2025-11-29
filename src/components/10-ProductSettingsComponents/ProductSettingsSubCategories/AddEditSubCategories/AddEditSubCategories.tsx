import React, { useEffect, useRef, useState } from "react";

import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";

import type {
  CategoryOption,
  SettingsAddEditSubCategoryProps,
  SubCategory,
  SubCategoryFormData,
  SubCategoryStatusOptions,
} from "./AddEditSubCategories.interface";
import {
  createSubCategory,
  fetchCategories,
  updateSubCategory,
} from "./AddEditSubCategories.function";
import { Check } from "lucide-react";

const AddEditSubCategories: React.FC<SettingsAddEditSubCategoryProps> = ({
  selectedSubCategory,
  onClose,
  reloadData,
}) => {
  const toast = useRef<Toast>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>([]);

  const isEditMode = !!selectedSubCategory;

  const [formData, setFormData] = useState<SubCategoryFormData>({
    refCategoryId: 0,
    subCategoryName: "",
    subCategoryCode: "",
    selectedStatus: { name: "Active", isActive: true },
  });

  const statusOptions: SubCategoryStatusOptions[] = [
    { name: "Active", isActive: true },
    { name: "Inactive", isActive: false },
  ];

  useEffect(() => {
    if (selectedSubCategory) {
      console.log("selectedSubCategory", selectedSubCategory);
      setFormData({
        refCategoryId: selectedSubCategory.refCategoryId ?? 0,
        subCategoryName: selectedSubCategory.subCategoryName,
        subCategoryCode: selectedSubCategory.subCategoryCode,
        selectedStatus: selectedSubCategory.isActive
          ? { name: "Active", isActive: true }
          : { name: "Inactive", isActive: false },
      });
    }
  }, [selectedSubCategory]);

  const handleInputChange = (
    field: keyof SubCategoryFormData,
    value: string | number | SubCategoryStatusOptions | null
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categories = await fetchCategories();

        const mappedCategories = categories.map((cat: any) => ({
          refCategoryId: cat.refCategoryId,
          categoryName: cat.categoryName || cat.subCategoryName || "Unnamed",
        }));

        setCategoryOptions(mappedCategories);
      } catch (err: any) {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: err.message || "Failed to load categories",
          life: 3000,
        });
      }
    };

    loadCategories();
  }, []);

  const handleSubmit = async () => {
    if (!formData.subCategoryName) {
      toast.current?.show({
        severity: "warn",
        summary: "Validation",
        detail: "Please fill all required fields",
        life: 3000,
      });
      return;
    }

    const payload: Partial<SubCategory> = {
      refCategoryId: formData.refCategoryId,
      subCategoryName: formData.subCategoryName,
      subCategoryCode: formData.subCategoryCode,
      isActive: formData.selectedStatus?.isActive ?? true,
    };

    if (isEditMode) {
      payload.refSubCategoryId = selectedSubCategory.refSubCategoryId;
    }

    try {
      setIsSubmitting(true);

      const result = isEditMode
        ? await updateSubCategory(payload)
        : await createSubCategory(payload);

      console.log("result", result);
      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: isEditMode
          ? "Sub-category updated successfully"
          : "Sub-category created successfully",
        life: 3000,
      });

      onClose();
      reloadData();
    } catch (err: any) {
      let errorMessage = "Operation failed";

      if (err.response) {
        if (err.response.status === 409) {
          errorMessage =
            "Duplicate sub-category found. Please use a different name or code.";
        } else if (err.response.status === 400) {
          errorMessage = err.response.data?.message || "Invalid request data.";
        } else {
          errorMessage = err.response.data?.message || err.message;
        }
      } else {
        errorMessage = err.message || "Network error";
      }

      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: errorMessage,
        life: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-3">
      <Toast ref={toast} />

      <div className="">
        <div className="flex gap-3 mt-3">
          <div className="flex-1">
            <FloatLabel className="always-float">
              <Dropdown
                id="refCategoryId"
                className="w-full"
                value={formData.refCategoryId}
                options={categoryOptions}
                onChange={(e) => handleInputChange("refCategoryId", e.value)}
                optionLabel="categoryName"
                optionValue="refCategoryId"
                placeholder="Select Category"
              />

              <label htmlFor="refCategoryId">Category</label>
            </FloatLabel>
          </div>
          <div className="flex-1">
            <FloatLabel className="always-float">
              <InputText
                id="subCategoryName"
                value={formData.subCategoryName}
                className="w-full"
                onChange={(e) =>
                  handleInputChange("subCategoryName", e.target.value)
                }
              />
              <label htmlFor="subCategoryName">Sub-category Name</label>
            </FloatLabel>
          </div>
        </div>

        <div className="flex gap-3 mt-3">
          <div className="flex-1">
            <FloatLabel className="always-float">
              <InputText
                id="subCategoryCode"
                value={formData.subCategoryCode}
                className="w-full"
                onChange={(e) =>
                  handleInputChange("subCategoryCode", e.target.value)
                }
              />
              <label htmlFor="subCategoryCode">Sub-category Code</label>
            </FloatLabel>
          </div>
          <div className="flex-1">
            <FloatLabel className="always-float">
              <Dropdown
                id="selectedStatus"
                className="w-full"
                value={formData.selectedStatus}
                options={statusOptions}
                onChange={(e) => handleInputChange("selectedStatus", e.value)}
                optionLabel="name"
                placeholder="Select"
              />
              <label htmlFor="selectedStatus">Status</label>
            </FloatLabel>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 w-full shadow-md p-4 text-right z-10">
          <Button
            label={isEditMode ? "Update" : "Save"}
            icon={<Check />}
            className="bg-[#8e5ea8] border-none gap-2"
            onClick={handleSubmit}
            loading={isSubmitting}
            disabled={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
};

export default AddEditSubCategories;
