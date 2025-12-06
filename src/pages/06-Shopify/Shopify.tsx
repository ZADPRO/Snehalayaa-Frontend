import React, { useEffect, useState } from "react";
import backgroundImage from "../../assets/background/bg.png";
import { User } from "lucide-react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import { fetchShopifyProducts } from "./Shopify.function";

const Shopify: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await fetchShopifyProducts(); // API call
      setProducts(response); // API returns array → store properly
    } catch (err) {
      console.error("Error fetching Shopify products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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
        {/* TOP BAR */}
        <div className="ps-topbar">
          <div className="ps-left">
            <button
              className="ps-back-btn"
              onClick={() => window.history.back()}
            >
              Back
            </button>
          </div>

          <p className="uppercase font-semibold text-lg">Shopify</p>

          <div className="ps-right">
            <User size={32} color="#6f1e60" />
          </div>
        </div>

        {/* Shopify Products Table */}
        <div className="p-4">
          <DataTable
            value={products}
            loading={loading}
            paginator
            rows={10}
            showGridlines
            className="shadow bg-white"
          >
            <Column header="S.No" body={(_, { rowIndex }) => rowIndex + 1} />

            <Column field="productName" header="Product Name" />
            <Column field="barcode" header="Barcode / SKU" />
            <Column field="categoryName" header="Category" />
            <Column field="subCategoryName" header="Sub Category" />

            <Column field="designName" header="Design" />
            <Column field="patternName" header="Pattern" />
            <Column field="colorName" header="Color" />
            <Column field="sizeName" header="Size" />
            <Column field="varientName" header="Variant" />

            <Column field="unitCost" header="Cost" />
            <Column field="marginPercent" header="Margin %" />
            <Column field="totalAmount" header="Total Amount" />

            <Column field="quantity" header="Stock Qty" />

            <Column
              header="Branch"
              body={(row) => `${row.refBranchName} (${row.refBranchCode})`}
            />

            <Column field="grnNumber" header="GRN Number" />
            <Column field="createdAt" header="Created At" />
          </DataTable>
        </div>
      </div>
    </div>
  );
};

export default Shopify;
