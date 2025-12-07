import React from "react";
import type { ProductGRNDialogProps } from "./ProductGRNInvoice.interface";

const ProductGRNInvoice: React.FC<ProductGRNDialogProps> = ({
  selectedPO,
  closeDialog,
  bundleDetails,
}) => {
  console.log("bundleDetails", bundleDetails);
  console.log("selectedPO", selectedPO);
  console.log("closeDialog", closeDialog);
  return (
    <div>
      <p>Invoice Upload</p>
    </div>
  );
};

export default ProductGRNInvoice;
