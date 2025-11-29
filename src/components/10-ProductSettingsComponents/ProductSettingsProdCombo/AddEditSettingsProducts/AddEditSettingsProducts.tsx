import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import type { Toast } from "primereact/toast";
import React, { useEffect, useRef, useState } from "react";
import { fetchCategories } from "../../ProductSettingsCategories/ProductSettingsCategories.function";
import type {
  Category,
  SubCategory,
} from "../../ProductSettingsCategories/ProductSettingsCategories.interface";
import { fetchSubCategories } from "../../ProductSettingsSubCategories/ProductSettingsSubCategories.function";
import {
  createProduct,
  updateProduct,
} from "./AddEditSettingsProducts.function";

interface AddEditSettingsProductsProps {
  selectedProduct: any | null;
  onClose: () => void;
  reloadData: () => void;
}

const AddEditSettingsProducts: React.FC<AddEditSettingsProductsProps> = ({
  selectedProduct,
  onClose,
  reloadData,
}) => {
  const toast = useRef<Toast>(null);
  const taxOptions = [
    { label: "0%", value: "0" },
    { label: "2%", value: "2" },
    { label: "2.5%", value: "2.5" },
    { label: "5%", value: "5" },
    { label: "8%", value: "8" },
    { label: "12%", value: "12" },
    { label: "18%", value: "18" },
  ];

  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState<
    SubCategory[]
  >([]);

  const [form, setForm] = useState({
    categoryId: null as number | null,
    subCategoryId: null as number | null,
    productName: "",
    hsn: "",
    tax: "",
    productCode: "",
  });

  const load = async () => {
    try {
      const categoryList = await fetchCategories();
      const subCategoryList = await fetchSubCategories();

      setCategories(categoryList);
      setSubCategories(subCategoryList);
    } catch (err: any) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: err.message || "Failed to load data",
        life: 3000,
      });
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      setForm({
        categoryId: selectedProduct.categoryId ?? null,
        subCategoryId: selectedProduct.subCategoryId ?? null,
        productName: selectedProduct.productName ?? "",
        hsn: selectedProduct.hsn ?? "",
        tax: selectedProduct.tax ?? "",
        productCode: selectedProduct.productCode ?? "",
      });

      if (selectedProduct.categoryId) {
        const filtered = subCategories.filter(
          (s) => s.refCategoryId === selectedProduct.categoryId
        );
        setFilteredSubCategories(filtered);
      }
    }
  }, [selectedProduct, subCategories]);

  const updateForm = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCategoryChange = (value: number | null) => {
    updateForm("categoryId", value);
    updateForm("subCategoryId", null);

    if (!value) {
      setFilteredSubCategories([]);
      return;
    }

    const filtered = subCategories.filter((sub) => sub.refCategoryId === value);

    if (filtered.length === 0) {
      setFilteredSubCategories([]);
      toast.current?.show({
        severity: "warn",
        summary: "No Subcategories",
        detail: "No subcategory was found for this category.",
        life: 2500,
      });
    } else {
      setFilteredSubCategories(filtered);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!form.categoryId || !form.subCategoryId || !form.productName) {
        toast.current?.show({
          severity: "warn",
          summary: "Validation",
          detail: "Please fill all required fields",
          life: 2500,
        });
        return;
      }

      const payload = {
        categoryId: form.categoryId,
        subCategoryId: form.subCategoryId,
        productName: form.productName.trim(),
        hsn: form.hsn.trim(),
        tax: form.tax,
        productCode: form.productCode || "",
      };

      let result;

      if (selectedProduct) {
        console.log("selectedProduct", selectedProduct);
        // payload.id = selectedProduct.id; // now allowed ✔

        result = await updateProduct(payload);

        toast.current?.show({
          severity: "success",
          summary: "Updated",
          detail: "Product updated successfully",
          life: 3000,
        });
      } else {
        result = await createProduct(payload);

        toast.current?.show({
          severity: "success",
          summary: "Created",
          detail: "Product added successfully",
          life: 3000,
        });
      }

      if (result?.token) {
        localStorage.setItem("token", result.token);
      }

      reloadData();
      onClose();
    } catch (err: any) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: err.response?.data?.message || "Failed to save product",
        life: 3000,
      });
    }
  };

  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-4 mt-2">
        <div className="flex-1">
          <Dropdown
            className="w-full"
            placeholder="Select Category"
            value={form.categoryId}
            options={categories}
            optionLabel="categoryName"
            optionValue="refCategoryId"
            onChange={(e) => handleCategoryChange(e.value)}
          />
        </div>

        <div className="flex-1">
          <Dropdown
            className="w-full"
            placeholder="Select Sub-Category"
            value={form.subCategoryId}
            disabled={filteredSubCategories.length === 0}
            options={filteredSubCategories.map((s) => ({
              label: s.subCategoryName,
              value: s.refSubCategoryId,
            }))}
            onChange={(e) => updateForm("subCategoryId", e.value)}
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 mt-4">
        <div className="flex-1">
          <InputText
            className="w-full"
            placeholder="Enter Product Name"
            value={form.productName}
            onChange={(e) => updateForm("productName", e.target.value)}
          />
        </div>
        <div className="flex-1">
          <InputText
            className="w-full"
            placeholder="Enter HSN Code"
            value={form.hsn}
            onChange={(e) => updateForm("hsn", e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 mt-4">
        <div className="flex-1">
          <Dropdown
            className="w-full"
            placeholder="Select Tax %"
            value={form.tax}
            options={taxOptions}
            onChange={(e) => updateForm("tax", e.value)}
          />
        </div>

        <div className="flex-1">
          <InputText
            className="w-full"
            placeholder="Product Code (auto generated)"
            value={form.productCode}
            disabled
          />
        </div>
      </div>

      <div className="flex justify-end fixed bottom-0 left-0 w-full shadow-md p-4 text-right z-10">
        <div className="flex gap-3">
          <Button
            label="Clear"
            outlined
            onClick={() =>
              setForm({
                categoryId: null,
                subCategoryId: null,
                productName: "",
                hsn: "",
                tax: "",
                productCode: "",
              })
            }
          />
          <Button
            label={selectedProduct ? "Update Product" : "Add Product"}
            className="p-button-primary"
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default AddEditSettingsProducts;
