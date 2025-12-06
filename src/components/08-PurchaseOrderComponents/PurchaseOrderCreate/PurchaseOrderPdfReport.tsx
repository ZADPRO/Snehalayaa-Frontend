import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import robotoFont from "../../../assets/fonts/roboto_font.ttf";
import type { PurchaseOrderProps } from "./PurchaseOrderCreate.interface";

Font.register({
  family: "Roboto",
  src: robotoFont,
});

const styles = StyleSheet.create({
  page: {
    fontFamily: "Roboto",
    fontSize: 10,
    padding: 20,
    lineHeight: 1.4,
    flexDirection: "column",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  logo: { width: 80, height: 80, objectFit: "contain" },
  title: { fontSize: 12, fontWeight: "bold", alignSelf: "flex-end" },

  companySection: { marginBottom: 10 },
  companyName: { fontSize: 12, fontWeight: "bold", textTransform: "uppercase" },
  companyAddress: { textTransform: "capitalize" },

  supplierBranchContainer: {
    marginTop: 8,
    marginBottom: 10,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 10,
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  halfBox: {
    width: "48%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderStyle: "solid", // ✅ added
    padding: 6,
    borderRadius: 2,
  },
  bold: { fontWeight: "bold" },

  table: {
    display: "table" as any,
    width: "100%",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    borderStyle: "solid",
    marginBottom: 10,
  },
  col: {
    flexGrow: 1,
    paddingVertical: 4,
    textAlign: "center",
  },
  summaryBox: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  summaryText: { fontSize: 10, lineHeight: 1.3, textAlign: "right" },

  colHeader: {
    flexGrow: 1,
    paddingVertical: 4,
    textAlign: "center",
    fontWeight: "bold",
  },
  colData: {
    flexGrow: 1,
    paddingVertical: 4,
    textAlign: "left",
  },
  tableCell: {
    paddingVertical: 4,
    paddingHorizontal: 4,
    fontSize: 9,
    borderRightWidth: 1,
    borderColor: "#ddd",
    borderStyle: "solid",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 1,
    borderColor: "#bbb",
    borderStyle: "solid",
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#eee",
    borderStyle: "solid",
  },
  taxTable: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderStyle: "solid",
    marginTop: 6,
    width: "100%",
  },

  taxRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    borderStyle: "solid",
  },

  taxCellHeader: {
    fontSize: 9,
    fontWeight: "bold",
    padding: 4,
    borderRightWidth: 1,
    borderColor: "#ddd",
    borderStyle: "solid",
    backgroundColor: "#f2f2f2",
  },

  taxCell: {
    fontSize: 9,
    padding: 4,
    borderRightWidth: 1,
    borderColor: "#ddd",
    borderStyle: "solid",
    textAlign: "right", // default to right for numeric
  },
});

const PurchaseOrderPdfReport: React.FC<PurchaseOrderProps> = ({
  invoiceNumber,
  logoBase64,
  from,
  to,
  summary,
  items = [],
}) => {
  const TAX_RATE = parseFloat(summary.taxPercentage || "0");
  const TAX_AMOUNT = parseFloat(summary.taxAmount || "0");
  const SUBTOTAL = parseFloat(summary.subTotal || "0");
  const TOTAL_AMOUNT = parseFloat(summary.totalAmount || "0");

  const totalQty = (items ?? []).reduce(
    (acc, cur) => acc + Number(cur.quantity || 0),
    0
  );

  const supplierAddress = [
    from.supplierDoorNumber,
    from.supplierStreet,
    from.supplierCity,
    from.supplierState,
    from.supplierCountry,
  ]
    .filter(Boolean)
    .join(", ");

  const branchAddress = [
    to?.refBranchDoorNo,
    to?.refBranchStreet,
    to?.refBranchCity,
    to?.refBranchState,
    to?.refBranchPincode,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          {logoBase64 ? (
            <Image src={logoBase64} style={styles.logo} />
          ) : (
            <View />
          )}
          <Text style={styles.title}>Purchase Order: {invoiceNumber}</Text>
        </View>

        {/* Company Info */}
        <View style={styles.companySection}>
          <Text style={styles.companyName}>SVAP TEXTILES LLP</Text>
          <Text style={styles.companyAddress}>
            No. 23, Venkatnarayana Road, T.Nagar, Chennai, India
          </Text>
          <Text style={styles.companyAddress}>Tamilnadu, 600017</Text>
        </View>

        {/* Supplier Reference */}
        <Text style={[styles.sectionTitle, { marginBottom: 2 }]}>
          Supplier Reference Code:{from.supplierCode || "-"}
        </Text>

        {/* Dispatched From / To */}
        <View style={styles.supplierBranchContainer}>
          <View style={styles.infoRow}>
            {/* Dispatched From */}
            <View style={styles.halfBox}>
              <Text style={styles.bold}>Dispatched From:</Text>
              <Text>{from.supplierCompanyName || "-"}</Text>
              {from.supplierName && <Text>{from.supplierName}</Text>}
              <Text>{supplierAddress}</Text>
              {from.supplierEmail && <Text>Email: {from.supplierEmail}</Text>}
              {from.supplierContactNumber && (
                <Text>Ph: {from.supplierContactNumber}</Text>
              )}
            </View>

            {/* Dispatched To */}
            <View style={styles.halfBox}>
              <Text style={styles.bold}>Dispatched To:</Text>
              <Text>{to?.refBranchName || "-"}</Text>
              {branchAddress && <Text>{branchAddress}</Text>}
              {to?.refMobile && <Text>Ph: {to.refMobile}</Text>}
            </View>
          </View>
        </View>

        {/* Product Table */}
        <View style={styles.table}>
          {/* Header */}
          <View style={styles.tableHeader}>
            <Text
              style={[styles.tableCell, { width: "7%", textAlign: "center" }]}
            >
              S.No
            </Text>
            <Text
              style={[styles.tableCell, { width: "18%", textAlign: "left" }]}
            >
              Category
            </Text>
            <Text
              style={[styles.tableCell, { width: "30%", textAlign: "left" }]}
            >
              Description
            </Text>
            <Text
              style={[styles.tableCell, { width: "10%", textAlign: "right" }]}
            >
              Qty
            </Text>
            <Text
              style={[styles.tableCell, { width: "13%", textAlign: "right" }]}
            >
              Unit Price
            </Text>

            <Text
              style={[styles.tableCell, { width: "12%", textAlign: "right" }]}
            >
              Total
            </Text>
          </View>

          {/* Rows */}
          {items.map((item, i) => (
            <View key={i} style={styles.tableRow}>
              <Text
                style={[styles.tableCell, { width: "7%", textAlign: "center" }]}
              >
                {i + 1}
              </Text>
              <Text
                style={[styles.tableCell, { width: "18%", textAlign: "left" }]}
              >
                {item.category}
              </Text>
              <Text
                style={[styles.tableCell, { width: "30%", textAlign: "left" }]}
              >
                {item.description}
              </Text>
              <Text
                style={[styles.tableCell, { width: "10%", textAlign: "right" }]}
              >
                {item.quantity}
              </Text>
              <Text
                style={[styles.tableCell, { width: "13%", textAlign: "right" }]}
              >
                {item.unitPrice?.toFixed(2)}
              </Text>

              <Text
                style={[styles.tableCell, { width: "12%", textAlign: "right" }]}
              >
                {item.total?.toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/* Summary Totals */}
        <View style={styles.summaryBox}>
          <View>
            <Text style={styles.summaryText}>Total Quantity: {totalQty}</Text>
            <Text style={styles.summaryText}>IGST: {TAX_RATE}%</Text>
            <Text style={styles.summaryText}>
              Total Amount: ₹ {TOTAL_AMOUNT.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Tax Summary */}
        <Text style={[styles.bold, { marginTop: 12 }]}>Tax Summary</Text>

        <View style={styles.taxTable}>
          {/* Header */}
          <View style={styles.taxRow}>
            <Text
              style={[
                styles.taxCellHeader,
                { width: "25%", textAlign: "left" },
              ]}
            >
              Tax Type
            </Text>
            <Text
              style={[
                styles.taxCellHeader,
                { width: "25%", textAlign: "right" },
              ]}
            >
              Tax Rate
            </Text>
            <Text
              style={[
                styles.taxCellHeader,
                { width: "25%", textAlign: "right" },
              ]}
            >
              Tax Valuable
            </Text>
            <Text
              style={[
                styles.taxCellHeader,
                { width: "25%", textAlign: "right" },
              ]}
            >
              Tax Amount
            </Text>
          </View>

          {/* Data Row */}
          <View style={styles.taxRow}>
            <Text style={[styles.taxCell, { width: "25%", textAlign: "left" }]}>
              IGST
            </Text>
            <Text
              style={[styles.taxCell, { width: "25%", textAlign: "right" }]}
            >
              {TAX_RATE}%
            </Text>
            <Text
              style={[styles.taxCell, { width: "25%", textAlign: "right" }]}
            >
              ₹ {SUBTOTAL.toFixed(2)}
            </Text>
            <Text
              style={[styles.taxCell, { width: "25%", textAlign: "right" }]}
            >
              ₹ {TAX_AMOUNT.toFixed(2)}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default PurchaseOrderPdfReport;
