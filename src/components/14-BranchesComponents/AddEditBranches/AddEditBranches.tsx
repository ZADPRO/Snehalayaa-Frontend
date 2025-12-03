import React, { useEffect, useRef, useState } from "react";
import type {
  Branch,
  BranchFormData,
  BranchStatusOptions,
  SettingsAddEditBranchProps,
} from "./AddEditBranches.interface";
import { Toast } from "primereact/toast";
import { createBranch, updateBranch } from "./AddEditBranches.function";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Check, Plus, Trash2 } from "lucide-react";

interface Section {
  sectionName: string;
  sectionCode: string;
  categoryId: any;
  refSubCategoryId: any;
}

interface Floor {
  floorName: string;
  floorCode: string;
  sections: Section[];
}

const AddEditBranches: React.FC<SettingsAddEditBranchProps> = ({
  selectedBranches,
  categories,
  subCategories,
  onClose,
  reloadData,
}) => {
  const toast = useRef<Toast>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [floors, setFloors] = useState<Floor[]>([]);

  const [formData, setFormData] = useState<BranchFormData>({
    refBranchName: "",
    refBranchCode: "",
    refLocation: "",
    refMobile: "",
    refEmail: "",
    isMainBranch: false,
    isOnline: false,
    isOffline: true,
    refBranchDoorNo: "",
    refBranchStreet: "",
    refBranchCity: "",
    refBranchState: "",
    refBranchPincode: "",
    selectedStatus: { name: "Active", isActive: true },
    floors: [],
  });

  const statusOptions: BranchStatusOptions[] = [
    { name: "Active", isActive: true },
    { name: "Inactive", isActive: false },
  ];

  useEffect(() => {
    if (selectedBranches) {
      console.log(
        "SettingsAddEditBranch.tsx / selectedBranches / 98 -------------------  ",
        selectedBranches
      );

      const mappedFloors = (selectedBranches.floors || []).map(
        (floor: Floor) => ({
          ...floor,
          sections: (floor.sections || []).map((section: Section) => ({
            ...section,
            // Ensure IDs align with dropdown options
            categoryId: section.categoryId || null,
            refSubCategoryId: section.refSubCategoryId || null,
          })),
        })
      );
      console.log("mappedFloors", mappedFloors);

      setFormData({
        refBranchName: selectedBranches.refBranchName,
        refBranchCode: selectedBranches.refBranchCode,
        refLocation: selectedBranches.refLocation,
        refMobile: selectedBranches.refMobile,
        refEmail: selectedBranches.refEmail,
        isMainBranch: selectedBranches.isMainBranch,
        isOnline: selectedBranches.isOnline,
        isOffline: selectedBranches.isOffline,
        refBranchDoorNo: selectedBranches.refBranchDoorNo || "",
        refBranchStreet: selectedBranches.refBranchStreet || "",
        refBranchCity: selectedBranches.refBranchCity || "",
        refBranchState: selectedBranches.refBranchState || "",
        refBranchPincode: selectedBranches.refBranchPincode || "",
        selectedStatus: selectedBranches.isActive
          ? { name: "Active", isActive: true }
          : { name: "Inactive", isActive: false },
        floors: mappedFloors,
      });

      setFloors(mappedFloors);
    } else {
      setFloors([]);
      setFormData({
        refBranchName: "",
        refBranchCode: "",
        refLocation: "",
        refMobile: "",
        refEmail: "",
        isMainBranch: false,
        isOnline: false,
        isOffline: true,
        selectedStatus: { name: "Active", isActive: true },
        floors: [],
      });
    }
  }, [selectedBranches]);

  const handleInputChange = (
    field: keyof BranchFormData,
    value: string | BranchStatusOptions | null
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };
  const handleAddFloor = () => {
    setFloors([
      ...floors,
      {
        floorName: "",
        floorCode: "",
        sections: [],
      },
    ]);
  };

  const handleFloorChange = (
    index: number,
    key: "floorName" | "floorCode",
    value: string
  ) => {
    const updated = [...floors];
    updated[index][key] = value;
    setFloors(updated);
  };

  const handleAddSection = (floorIndex: number) => {
    const updated = [...floors];
    updated[floorIndex].sections.push({
      sectionName: "",
      sectionCode: "",
      categoryId: null,
      refSubCategoryId: null,
    });
    setFloors(updated);
  };

  const handleSectionChange = (
    floorIndex: number,
    sectionIndex: number,
    key: keyof Section,
    value: string | number | null
  ) => {
    const updated = [...floors];
    updated[floorIndex].sections[sectionIndex][key] = value as any;
    setFloors(updated);
  };

  useEffect(() => {
    setFormData((prev) => ({ ...prev, floors }));
  }, [floors]);

  const handleSubmit = async () => {
    if (!formData.refBranchName) {
      toast.current?.show({
        severity: "warn",
        summary: "Validation",
        detail: "Please fill all required fields",
        life: 3000,
      });
      return;
    }

    const payload: Partial<Branch> = {
      refBranchName: formData.refBranchName,
      refBranchCode: formData.refBranchCode,
      refLocation: formData.refLocation,
      refMobile: formData.refMobile,
      refEmail: formData.refEmail,
      isMainBranch: formData.isMainBranch,
      isActive: formData.selectedStatus?.isActive ?? false,
      isOnline: formData.isOnline,
      isOffline: formData.isOffline,
      refBranchDoorNo: formData.refBranchDoorNo,
      refBranchStreet: formData.refBranchStreet,
      refBranchCity: formData.refBranchCity,
      refBranchState: formData.refBranchState,
      refBranchPincode: formData.refBranchPincode,
      floors: floors,
    };

    if (selectedBranches) payload.refBranchId = selectedBranches.refBranchId;

    try {
      setIsSubmitting(true);
      const result = selectedBranches
        ? await updateBranch(payload)
        : await createBranch(payload);

      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: result.message || "Operation successful",
        life: 3000,
      });

      onClose();
      reloadData();
    } catch (err: any) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: err.message || "Operation failed",
        life: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const booleanOptions = [
    { label: "Yes", value: true },
    { label: "No", value: false },
  ];

  const handleDeleteFloor = (floorIndex: number) => {
    const updated = floors.filter((_, index) => index !== floorIndex);
    setFloors(updated);
  };

  const handleDeleteSection = (floorIndex: number, sectionIndex: number) => {
    const updated = [...floors];
    updated[floorIndex].sections = updated[floorIndex].sections.filter(
      (_, index) => index !== sectionIndex
    );
    setFloors(updated);
  };

  return (
    <div className="">
      <Toast ref={toast} />
      <div className="">
        <p>Basic Details</p>
        <div className="flex gap-3 mt-3">
          <div className="flex-1">
            <FloatLabel className="always-float">
              <InputText
                id="refBranchName"
                value={formData.refBranchName}
                className="w-full"
                onChange={(e) =>
                  handleInputChange("refBranchName", e.target.value)
                }
              />
              <label htmlFor="refBranchName">Branch Name</label>
            </FloatLabel>
          </div>
          <div className="flex-1">
            <FloatLabel className="always-float">
              <InputText
                id="refBranchCode"
                value={formData.refBranchCode}
                className="w-full"
                onChange={(e) =>
                  handleInputChange("refBranchCode", e.target.value)
                }
              />
              <label htmlFor="refBranchCode">Branch code</label>
            </FloatLabel>
          </div>
        </div>

        <p className="mt-2">Communication Details</p>
        <div className="flex gap-3 mt-3">
          <div className="flex-1">
            <FloatLabel className="always-float">
              <InputText
                id="refBranchDoorNo"
                value={formData.refBranchDoorNo || ""}
                className="w-full"
                onChange={(e) =>
                  handleInputChange("refBranchDoorNo", e.target.value)
                }
              />
              <label htmlFor="refBranchDoorNo">Branch Door No</label>
            </FloatLabel>
          </div>
          <div className="flex-1">
            <FloatLabel className="always-float">
              <InputText
                id="refBranchStreet"
                value={formData.refBranchStreet || ""}
                className="w-full"
                onChange={(e) =>
                  handleInputChange("refBranchStreet", e.target.value)
                }
              />
              <label htmlFor="refBranchStreet">Branch Street</label>
            </FloatLabel>
          </div>
        </div>
        <div className="flex gap-3 mt-3">
          <div className="flex-1">
            <FloatLabel className="always-float">
              <InputText
                id="refBranchCity"
                value={formData.refBranchCity || ""}
                className="w-full"
                onChange={(e) =>
                  handleInputChange("refBranchCity", e.target.value)
                }
              />
              <label htmlFor="refBranchCity">Branch City</label>
            </FloatLabel>
          </div>
          <div className="flex-1">
            <FloatLabel className="always-float">
              <InputText
                id="refBranchState"
                value={formData.refBranchState || ""}
                className="w-full"
                onChange={(e) =>
                  handleInputChange("refBranchState", e.target.value)
                }
              />
              <label htmlFor="refBranchState">Branch State</label>
            </FloatLabel>
          </div>
        </div>
        <div className="flex gap-3 mt-3">
          <div className="flex-1">
            <FloatLabel className="always-float">
              <InputText
                id="refBranchPincode"
                value={formData.refBranchPincode || ""}
                className="w-full"
                keyfilter={"int"}
                maxLength={6}
                onChange={(e) =>
                  handleInputChange(
                    "refBranchPincode",
                    e.target.value.slice(0, 6)
                  )
                }
              />
              <label htmlFor="refBranchPincode">Pincode</label>
            </FloatLabel>
          </div>
          <div className="flex-1"></div>
        </div>
        <p className="mt-2">Other Details</p>
        <div className="flex gap-3 mt-3">
          <div className="flex-1">
            <FloatLabel className="always-float">
              <InputText
                id="refMobile"
                keyfilter={"int"}
                value={formData.refMobile}
                className="w-full"
                maxLength={10}
                onChange={(e) => {
                  const value = e.target.value.slice(0, 10);
                  handleInputChange("refMobile", value);
                }}
              />
              <label htmlFor="refMobile">Contact Number</label>
            </FloatLabel>
          </div>
          <div className="flex-1">
            <FloatLabel className="always-float">
              <InputText
                id="refEmail"
                value={formData.refEmail}
                className="w-full"
                onChange={(e) => handleInputChange("refEmail", e.target.value)}
                type="email"
              />
              <label htmlFor="refEmail">Email</label>
            </FloatLabel>
          </div>
        </div>

        <div className="flex gap-3 mt-3">
          <div className="flex-1">
            <FloatLabel className="always-float">
              <InputText
                id="refLocation"
                value={formData.refLocation}
                className="w-full"
                onChange={(e) =>
                  handleInputChange("refLocation", e.target.value)
                }
              />
              <label htmlFor="refLocation">Location</label>
            </FloatLabel>
          </div>
          <div className="flex-1">
            <FloatLabel className="always-float">
              <Dropdown
                id="isMainBranch"
                className="w-full"
                value={formData.isMainBranch} // should be boolean: true or false
                options={booleanOptions}
                onChange={(e) => handleInputChange("isMainBranch", e.value)} // e.value is true/false
                placeholder="Select"
              />
              <label htmlFor="isMainBranch">Is Main Branch</label>
            </FloatLabel>
          </div>
        </div>

        <div className="flex gap-3 mt-3">
          <div className="flex-1">
            <FloatLabel className="always-float">
              <Dropdown
                id="isOnline"
                className="w-full"
                value={formData.isOnline}
                options={booleanOptions}
                onChange={(e) => handleInputChange("isOnline", e.value)}
                placeholder="Select"
              />
              <label htmlFor="isOnline">Is Online</label>
            </FloatLabel>
          </div>
          <div className="flex-1">
            <FloatLabel className="always-float">
              <Dropdown
                id="isOffline"
                className="w-full"
                value={formData.isOffline}
                options={booleanOptions}
                onChange={(e) => handleInputChange("isOffline", e.value)}
                placeholder="Select"
              />
              <label htmlFor="isOffline">Is Offline</label>
            </FloatLabel>
          </div>
        </div>

        <div className="flex gap-3 mt-3">
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
          <div className="flex-1"></div>
        </div>

        <div className="flex justify-content-end w-full">
          <Button
            label="Add Floor"
            className="bg-[#8e5ea8] border-none"
            onClick={handleAddFloor}
          />
        </div>
        <div className="w-full justify-content-start ml-0 pb-20">
          {floors.map((floor, floorIndex) => (
            <div
              key={floorIndex}
              className="border rounded-xl px-2 shadow-md bg-gray-50"
            >
              {/* Floor Label */}
              <div className="font-semibold text-lg text-purple-700 mb-3">
                Floor <span>{floorIndex + 1}</span>
              </div>

              <div className="flex gap-1 align-items-center">
                <FloatLabel className="always-float">
                  <InputText
                    id={`floorName-${floorIndex}`}
                    value={floor.floorName}
                    onChange={(e) =>
                      handleFloorChange(floorIndex, "floorName", e.target.value)
                    }
                  />
                  <label htmlFor={`floorName-${floorIndex}`}>Floor Name</label>
                </FloatLabel>

                <FloatLabel className="always-float">
                  <InputText
                    id={`floorCode-${floorIndex}`}
                    value={floor.floorCode}
                    onChange={(e) =>
                      handleFloorChange(floorIndex, "floorCode", e.target.value)
                    }
                  />
                  <label htmlFor={`floorCode-${floorIndex}`}>Floor Code</label>
                </FloatLabel>

                <Button
                  icon={<Plus />}
                  label="Add Section"
                  onClick={() => handleAddSection(floorIndex)}
                />

                <Button
                  icon={<Trash2 />}
                  severity="danger"
                  className="ml-2"
                  onClick={() => handleDeleteFloor(floorIndex)}
                />
              </div>

              {floor.sections.map((section, sectionIndex) => {
                // Filter sub-categories based on current section's categoryId
                const sectionFilteredSubCategories = subCategories.filter(
                  (sub) => sub.refCategoryId === section.categoryId
                );

                return (
                  <div
                    key={sectionIndex}
                    className="flex flex-column mt-3 w-full"
                  >
                    <div className="flex justify-content-between align-items-center">
                      <p className="font-medium text-gray-900">
                        Section{" "}
                        {`${floorIndex + 1}.${String.fromCharCode(
                          65 + sectionIndex
                        )}`}
                      </p>

                      <Button
                        icon={<Trash2 size={16} />}
                        className="p-button-danger"
                        onClick={() =>
                          handleDeleteSection(floorIndex, sectionIndex)
                        }
                      />
                    </div>
                    <div className="flex flex-column gap-3 mt-3">
                      <div className="flex gap-3">
                        <div className="flex-1 ">
                          <FloatLabel className="always-float">
                            <InputText
                              id={`sectionName-${floorIndex}-${sectionIndex}`}
                              value={section.sectionName}
                              className="w-full"
                              onChange={(e) =>
                                handleSectionChange(
                                  floorIndex,
                                  sectionIndex,
                                  "sectionName",
                                  e.target.value
                                )
                              }
                            />
                            <label
                              htmlFor={`sectionName-${floorIndex}-${sectionIndex}`}
                            >
                              Section Name
                            </label>
                          </FloatLabel>
                        </div>
                        <div className="flex-1">
                          <FloatLabel className="always-float">
                            <InputText
                              id={`sectionCode-${floorIndex}-${sectionIndex}`}
                              value={section.sectionCode}
                              className="w-full"
                              onChange={(e) =>
                                handleSectionChange(
                                  floorIndex,
                                  sectionIndex,
                                  "sectionCode",
                                  e.target.value
                                )
                              }
                            />
                            <label
                              htmlFor={`sectionCode-${floorIndex}-${sectionIndex}`}
                            >
                              Section Code
                            </label>
                          </FloatLabel>
                        </div>
                      </div>

                      <div className="flex gap-3 bg-white rounded shadow-sm w-full">
                        <div className="flex-1">
                          <FloatLabel className="always-float">
                            <Dropdown
                              id={`category-${floorIndex}-${sectionIndex}`}
                              value={section.categoryId}
                              filter
                              onChange={(e) => {
                                handleSectionChange(
                                  floorIndex,
                                  sectionIndex,
                                  "categoryId",
                                  e.value
                                );

                                handleSectionChange(
                                  floorIndex,
                                  sectionIndex,
                                  "refSubCategoryId",
                                  null
                                );
                              }}
                              appendTo="self"
                              className="w-full"
                              options={categories}
                              optionLabel="categoryName"
                              optionValue="refCategoryId"
                              placeholder="Select Category"
                            />
                            <label
                              htmlFor={`category-${floorIndex}-${sectionIndex}`}
                            >
                              Category
                            </label>
                          </FloatLabel>
                        </div>
                        <div className="flex-1">
                          <FloatLabel className="always-float">
                            <Dropdown
                              id={`subCategory-${floorIndex}-${sectionIndex}`}
                              value={section.refSubCategoryId}
                              filter
                              onChange={(e) =>
                                handleSectionChange(
                                  floorIndex,
                                  sectionIndex,
                                  "refSubCategoryId",
                                  e.value
                                )
                              }
                              options={sectionFilteredSubCategories}
                              optionLabel="subCategoryName"
                              optionValue="refSubCategoryId"
                              appendTo="self"
                              className="w-full"
                              placeholder={
                                section.categoryId
                                  ? "Select Sub Category"
                                  : "Select Category First"
                              }
                              disabled={!section.categoryId}
                              emptyMessage="No Sub Category Found"
                            />
                            <label
                              htmlFor={`subCategory-${floorIndex}-${sectionIndex}`}
                            >
                              Sub-Category
                            </label>
                          </FloatLabel>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className="py-4 text-right z-10">
          <Button
            label={selectedBranches ? "Update" : "Save"}
            icon={<Check size={18} />}
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

export default AddEditBranches;
