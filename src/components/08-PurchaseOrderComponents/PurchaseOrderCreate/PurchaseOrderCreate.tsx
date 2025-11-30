import { Check } from "lucide-react";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import React from "react";

const PurchaseOrderCreate: React.FC = () => {
  return (
    <div className="flex gap-2 w-full">
      <div className="w-[75%] flex flex-col gap-2">
        <div className="flex items-center justify-between bg-white py-3 px-4 rounded-md shadow">
          <div className="flex gap-2">
            <div>
              <Dropdown placeholder="Suppliers" className="w-[14rem]" />
            </div>
            <div>
              <Dropdown placeholder="Branch" className="w-[14rem]" />
            </div>
          </div>

          <div className="flex gap-2 items-center text-sm">
            <div className="flex gap-2">
              <p className="font-semibold">Credited Days</p>
              <p className="text-gray-600">30 Days</p>
            </div>
            |
            <div className="flex gap-2">
              <p className="font-semibold">Payment Status</p>
              <p className="text-gray-600">Pending</p>
            </div>
            |
            <div className="flex gap-2">
              <p className="font-semibold">Due On</p>
              <p className="text-gray-600">29-11-2025</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-md shadow min-h-[400px]">
          <div className="">
            <div className="flex gap-3 items-center">
              <div className="flex-1">
                <Dropdown placeholder="Categories" className="w-full" />
              </div>
              <div className="flex-1">
                <Dropdown placeholder="Sub Categories" className="w-full" />
              </div>
              <div className="flex-1">
                <InputText
                  placeholder="Product Description"
                  className="w-full"
                />
              </div>
              <div className="flex-1">
                <InputText placeholder="Unit Price" className="w-full" />
              </div>
              <div className="flex-1">
                <InputText placeholder="Quantity" className="w-full" />
              </div>
              <div className="flex-1">
                <InputText placeholder="Discount" className="w-full" />
              </div>
              <Button icon={<Check size={18} />} />
            </div>
          </div>
          <div className="mt-3">
            <DataTable
              showGridlines
              stripedRows
              paginator
              rows={10}
              rowsPerPageOptions={[10, 30, 50]}
            >
              <Column header="S.No" />
              <Column header="Category" />
              <Column header="Product Description" />
              <Column header="Quantity" />
              <Column header="Price" />
              <Column header="Disc %" />
              <Column header="Discount" />
              <Column header="Total" />
              <Column header="Edit" />
              <Column header="Delete" />
            </DataTable>
          </div>
        </div>
      </div>

      <div className="w-[25%] flex flex-col gap-2">
        <div className="bg-white flex p-4 rounded-md shadow justify-between items-center">
          <div className="flex flex-col">
            <h4 className="font-semibold mb-3">Supplier Details</h4>

            <p>Company Name</p>
            <p>Supplier Name</p>
            <p>Address Line 1</p>
            <p>Address Line 2</p>
            <p>Mobile & Email</p>
          </div>
          <Divider layout="vertical" />
          <div className="flex flex-col">
            <h4 className="font-semibold mb-3">Branch Details</h4>

            <p>Company Name</p>
            <p>Branch Name</p>
            <p>Address Line 1</p>
            <p>Address Line 2</p>
            <p>Mobile & Email</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-md shadow">
          <div className="flex gap-2">
            <Button label="Save" className="flex-1" />
            <Button label="Download" className="flex-1" />
            <Button label="Print" className="flex-1" />
          </div>
          <p>Tax Enabled</p>
        </div>

        <div className="bg-white p-4 rounded-md shadow text-sm">
          <h4 className="font-semibold mb-3">Summary</h4>

          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹0.00</span>
          </div>

          <div className="flex justify-between">
            <span>Tax</span>
            <span>₹0.00</span>
          </div>

          <div className="flex justify-between">
            <span>Discount (%)</span>
            <span>- ₹0.00</span>
          </div>

          <div className="flex justify-between">
            <span>Fixed Discount</span>
            <span>- ₹0.00</span>
          </div>

          <div className="flex justify-between">
            <span>Round Off</span>
            <span>₹0.00</span>
          </div>

          <div className="flex justify-between">
            <span>Payment Fee</span>
            <span>₹0.00</span>
          </div>

          <div className="flex justify-between">
            <span>Shipping Fee</span>
            <span>₹0.00</span>
          </div>

          <hr className="my-3" />

          <div className="flex justify-between text-base font-semibold">
            <span>Total</span>
            <span>₹0.00</span>
          </div>

          <div className="flex justify-between text-base mt-2 text-red-600 font-semibold">
            <span>Pending Payment</span>
            <span>₹0.00</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrderCreate;
