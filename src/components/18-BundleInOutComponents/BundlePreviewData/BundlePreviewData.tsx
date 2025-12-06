import React from "react";

interface PreviewProps {
  data: any; // formData
  poList: any[]; // purchase order list
  supplierList: any[]; // supplier list
}

const BundlePreviewData: React.FC<PreviewProps> = ({
  data,
  poList,
  supplierList,
}) => {
  // You can extract PO and Supplier details
  const po = poList.find((p) => p.id === data.poId);
  const supplier = supplierList.find((s) => s.supplierId === data.supplierId);

  return (
    <div className="p-4">
      <h2 className="font-bold text-lg mb-3 underline">
        Bundle Inward Preview
      </h2>

      {/* PO BASIC DETAILS */}
      <div className="mb-4">
        <h3 className="font-bold text-md">PO Basic Details</h3>
        <p>
          <strong>PO Number:</strong> {po?.po_number ?? "-"}
        </p>
        <p>
          <strong>PO Date:</strong>{" "}
          {data.poDate ? new Date(data.poDate).toLocaleDateString() : "-"}
        </p>
        <p>
          <strong>Supplier:</strong> {supplier?.supplierName ?? "-"}
        </p>
        <p>
          <strong>Location:</strong> {data.location}
        </p>
        <p>
          <strong>PO Value:</strong> ₹{data.poValue}
        </p>
        <p>
          <strong>Receiving Type:</strong> {data.receivingType}
        </p>
        <p>
          <strong>Remarks:</strong> {data.remarks}
        </p>
        <p>
          <strong>PO Quantity:</strong> {data.poQty}
        </p>
        <p>
          <strong>Box Count:</strong> {data.boxCount}
        </p>
      </div>

      {/* BILL LIST */}
      <div className="mb-4">
        <h3 className="font-bold text-md ">Bill Entries</h3>

        {data.billList.length === 0 ? (
          <p>No bills added.</p>
        ) : (
          <table className="w-full border mt-2">
            <thead>
              <tr className="border bg-gray-100">
                <th className="border p-2">Bill Date</th>
                <th className="border p-2">Bill No</th>
                <th className="border p-2">Qty</th>
                <th className="border p-2">Taxable Value</th>
                <th className="border p-2">Tax %</th>
                <th className="border p-2">Tax Amount</th>
                <th className="border p-2">Invoice Value</th>
              </tr>
            </thead>
            <tbody>
              {data.billList.map((b: any) => (
                <tr key={b._id} className="border">
                  <td className="border p-2">
                    {b.billDate
                      ? new Date(b.billDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="border p-2">{b.billNo}</td>
                  <td className="border p-2">{b.billQty}</td>
                  <td className="border p-2">{b.taxableValue}</td>
                  <td className="border p-2">{b.taxPercent}</td>
                  <td className="border p-2">{b.taxAmount}</td>
                  <td className="border p-2">{b.invoiceValue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* GRN DETAILS */}
      <div className="mb-4">
        <h3 className="font-bold text-md ">GRN Details</h3>
        <p>
          <strong>GRN Date:</strong>{" "}
          {data.grnDate ? new Date(data.grnDate).toLocaleDateString() : "-"}
        </p>
        <p>
          <strong>GRN Status:</strong> {data.grnStatus}
        </p>
        <p>
          <strong>GRN Value:</strong> ₹{data.grnValue}
        </p>
        <p>
          <strong>Bundle Status:</strong> {data.bundleStatus}
        </p>
        <p>
          <strong>Transporter Name:</strong> {data.transporterName}
        </p>
        <p>
          <strong>Created Date:</strong>{" "}
          {data.createdDate
            ? new Date(data.createdDate).toLocaleDateString()
            : "-"}
        </p>
      </div>
    </div>
  );
};

export default BundlePreviewData;
