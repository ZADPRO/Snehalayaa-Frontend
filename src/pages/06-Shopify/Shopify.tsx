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
      const data = await fetchShopifyProducts();
      setProducts(data);
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
            <Column field="id" header="ID" />
            <Column field="title" header="Title" />
            <Column field="sku" header="SKU" />
            <Column field="price" header="Price" />
            <Column field="stock" header="Stock" />
            <Column field="vendor" header="Vendor" />
            <Column field="status" header="Status" />
          </DataTable>
        </div>
      </div>
    </div>
  );
};

export default Shopify;
