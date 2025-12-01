import React, { useRef, useState } from "react";
import { FileUpload, type FileUploadSelectEvent } from "primereact/fileupload";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import JSZip from "jszip";
import { Check, User, X } from "lucide-react";
import axios from "axios";
import { ProgressBar } from "primereact/progressbar";
import { baseURL } from "../../utils/helper";

import backgroundImage from "../../assets/background/bg.png";

const ImageUpload: React.FC = () => {
  const toast = useRef<Toast>(null);

  const [images, setImages] = useState<
    {
      name: string;
      url: string;
      blob: Blob;
      uploading?: boolean;
      progress?: number;
    }[]
  >([]);

  const handleZipUpload = async (event: FileUploadSelectEvent) => {
    const file = event.files[0];
    if (!file) {
      toast.current?.show({
        severity: "warn",
        summary: "Invalid File",
        detail: "Please select a valid ZIP file.",
      });
      return;
    }

    try {
      const zip = await JSZip.loadAsync(file);
      const extractedImages: any[] = [];

      for (const [path, entry] of Object.entries(zip.files)) {
        if (entry.dir) continue;

        const parts = path.split("/").filter(Boolean);
        if (parts.length > 2) continue;

        const fileName = parts[parts.length - 1];

        if (!/\.(jpg|jpeg|png)$/i.test(fileName)) continue;

        const isDuplicate =
          images.some((img) => img.name === fileName) ||
          extractedImages.some((img) => img.name === fileName);

        if (isDuplicate) {
          toast.current?.show({
            severity: "warn",
            summary: "Duplicate Found",
            detail: `Duplicate image: ${fileName}`,
          });
          continue;
        }

        const blob = await entry.async("blob");
        const url = URL.createObjectURL(blob);

        extractedImages.push({
          name: fileName,
          url,
          blob,
          uploading: false,
          progress: 0,
        });
      }

      setImages((prev) => [...prev, ...extractedImages]);
    } catch (err) {
      console.error("Error extracting ZIP:", err);
      toast.current?.show({
        severity: "error",
        summary: "Extraction Failed",
        detail: "Could not extract images from ZIP file.",
      });
    }
  };

  const handleDelete = (name: string) => {
    setImages((prev) => prev.filter((img) => img.name !== name));
  };

  const generatePresignedURLs = async (fileNames: string[]) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${baseURL}/bulkImageUpload/generateUploadURL`,
        { fileNames, expireMins: 15 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.results;
    } catch (error: any) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: error.message || "Failed to generate upload URLs",
      });
    }
  };

  const uploadToMinio = async (url: string, blob: Blob, index: number) => {
    setImages((prev) =>
      prev.map((img, i) =>
        i === index ? { ...img, uploading: true, progress: 0 } : img
      )
    );

    await axios.put(url, blob, {
      headers: { "Content-Type": blob.type || "application/octet-stream" },
      onUploadProgress: (progressEvent) => {
        const percent = Math.round(
          (progressEvent.loaded * 100) / (progressEvent.total || 1)
        );

        setImages((prev) =>
          prev.map((img, i) =>
            i === index ? { ...img, progress: percent } : img
          )
        );
      },
    });

    setImages((prev) =>
      prev.map((img, i) =>
        i === index ? { ...img, uploading: false, progress: 100 } : img
      )
    );
  };

  const saveUploadedFileNames = async (uploadedFiles: string[]) => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${baseURL}/admin/products/save`,
        { fileNames: uploadedFiles },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.current?.show({
        severity: "success",
        summary: "Saved",
        detail: "File names saved successfully!",
      });
    } catch (error: any) {
      toast.current?.show({
        severity: "error",
        summary: "Save Failed",
        detail: error.message || "Could not save file names",
      });
    }
  };

  const handleSubmit = async () => {
    const fileNames = images.map((img) => img.name);
    const presignedData = await generatePresignedURLs(fileNames);
    if (!presignedData) return;

    const uploadedFiles: string[] = [];

    for (let i = 0; i < images.length; i++) {
      const img = images[i];

      const match = presignedData.find(
        (p: any) => p.fileName === img.name.toUpperCase()
      );

      if (match) {
        await uploadToMinio(match.uploadUrl, img.blob, i);

        uploadedFiles.push(match.fileName);
      }
    }

    await saveUploadedFileNames(uploadedFiles);

    toast.current?.show({
      severity: "success",
      summary: "Upload Complete",
      detail: "All images uploaded successfully!",
    });

    setImages([]);
  };

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

          <div className="ps-right">
            <User size={32} color="#6f1e60" />
          </div>
        </div>

        <Toast ref={toast} />

        <div className="p-3">
          <p
            style={{
              fontSize: "16px",
              fontWeight: "600",
              marginBottom: "12px",
            }}
          >
            Bulk Image Upload
          </p>

          <div className="flex justify-content-between">
            <FileUpload
              mode="basic"
              name="zipFile"
              accept=".zip"
              customUpload
              auto
              chooseLabel="Upload ZIP"
              onSelect={handleZipUpload}
            />

            {images.length > 0 && (
              <Button
                label="Submit"
                icon={<Check size="20px" />}
                onClick={handleSubmit}
              />
            )}
          </div>
          {images.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(6, 1fr)",
                gap: "16px",
                marginTop: "24px",
              }}
            >
              {images.map((img, idx) => (
                <div
                  key={idx}
                  style={{
                    position: "relative",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    overflow: "hidden",
                    textAlign: "center",
                    padding: "8px",
                  }}
                >
                  {!img.uploading && (
                    <button
                      onClick={() => handleDelete(img.name)}
                      style={{
                        position: "absolute",
                        top: "6px",
                        right: "6px",
                        background: "rgba(0,0,0,0.5)",
                        color: "#fff",
                        border: "none",
                        borderRadius: "50%",
                        padding: "4px",
                        zIndex: "20",
                        cursor: "pointer",
                      }}
                    >
                      <X size={14} />
                    </button>
                  )}

                  <div style={{ position: "relative" }}>
                    <img
                      src={img.url}
                      alt={img.name}
                      style={{
                        width: "100%",
                        height: "150px",
                        objectFit: "cover",
                        opacity: img.uploading ? 0.6 : 1,
                      }}
                    />

                    {img.uploading && (
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "rgba(0, 0, 0, 0.4)",
                        }}
                      >
                        <ProgressBar
                          value={img.progress}
                          showValue
                          style={{ width: "80%" }}
                        />
                      </div>
                    )}
                  </div>

                  <p
                    style={{
                      fontSize: "12px",
                      marginTop: "8px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    title={img.name}
                  >
                    {img.name}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
