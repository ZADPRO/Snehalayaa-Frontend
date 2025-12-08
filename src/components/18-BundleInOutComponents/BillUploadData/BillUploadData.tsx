import React, { useState } from "react";
import { FileUpload } from "primereact/fileupload";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import axios from "axios";

interface PreviewProps {
  data: any;
}

const BillUploadData: React.FC<PreviewProps> = ({ data }) => {
  console.log("data", data);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [refresh, setRefresh] = useState(false); // force re-render

  const generatePresignedURL = async (file: File) => {
    const extension = file.name.split(".").pop();

    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/imageUpload/generateURL`,
      { extension }
    );

    return res.data;
  };

  const uploadToMinio = async (uploadUrl: string, file: File) => {
    await axios.put(uploadUrl, file, {
      headers: { "Content-Type": file.type },
    });
  };

  const handleUpload = async (billIndex: number, files: File[]) => {
    const file = files[0];
    if (!file) return;

    try {
      setUploadingIndex(billIndex);
      const { uploadUrl, fileName } = await generatePresignedURL(file);

      await uploadToMinio(uploadUrl, file);

      data.billList[billIndex].invoiceFile = fileName;

      setRefresh(!refresh);

      alert(`✅ Invoice uploaded for Bill ${billIndex + 1}`);
    } catch (err) {
      console.error("❌ Upload failed:", err);
      alert("Upload failed");
    } finally {
      setUploadingIndex(null);
    }
  };

  return (
    <div className="p-2">
      {data.billList.map((bill: any, index: number) => (
        <div
          key={bill._id}
          className="rounded p-3 mb-4 flex flex-wrap gap-3 items-end"
        >
          <div className="flex flex-col w-48">
            <label>Bill No</label>
            <InputText value={bill.billNo} readOnly />
          </div>

          <div className="flex flex-col w-48">
            <label>Bill Date</label>
            <Calendar value={new Date(bill.billDate)} disabled showIcon />
          </div>

          <div className="flex flex-col w-32">
            <label>Bill Qty</label>
            <InputText value={bill.billQty} readOnly />
          </div>

          <div className="flex flex-col w-32">
            <label>Upload Invoice</label>

            <FileUpload
              mode="basic"
              name="invoice"
              accept="application/pdf"
              maxFileSize={5_000_000}
              customUpload
              auto
              className="w-[15rem]"
              uploadHandler={(e) => handleUpload(index, e.files)}
              chooseLabel={
                bill.invoiceFile ? "Change Invoice" : "Upload Invoice"
              }
              disabled={uploadingIndex === index}
            />
          </div>

          {bill.invoiceFile && (
            <div className="flex flex-col">
              <span className="text-green-600 text-sm">{bill.invoiceFile}</span>

              <Button
                size="small"
                label="Preview"
                onClick={() =>
                  window.open(
                    `${
                      import.meta.env.VITE_API_URL
                    }/imageUpload/getProductImage/${bill.invoiceFile}/10`,
                    "_blank"
                  )
                }
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default BillUploadData;
