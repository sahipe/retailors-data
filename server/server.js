import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import XLSX from "xlsx";

const app = express();
app.use(cors()); // adjust for your frontend URL
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(
    "mongodb+srv://formservices10:orCFD0tIt4zjfMD3@cluster0.8wlv5xx.mongodb.net/retailersDB"
  ) // Direct connection for test
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// Schema
const retailerSchema = new mongoose.Schema({
  employeeName: String,
  retailerName: String,
  retailerContact: String,
  retailerEmail: String,
  shopName: String,
  cityVillage: String,
  tehsil: String,
  district: String,
  state: String,
  visitingDateTime: Date, // store as Date type for filtering
  bbps: String,
  aeps: String,
  dmt: String,
  cms: String,
  onboardingStatus: String,
});

const Retailer = mongoose.model("Retailer", retailerSchema);

// POST - Save retailer
app.post("/api/retailers", async (req, res) => {
  try {
    const data = req.body;
    if (data.visitingDateTime) {
      data.visitingDateTime = new Date(data.visitingDateTime);
    }
    const newRetailer = new Retailer(data);
    await newRetailer.save();
    res.status(201).json({ message: "Retailer saved successfully" });
  } catch (err) {
    console.error("❌ Save error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET - Download Excel with optional filters
app.get("/api/retailers/excel", async (req, res) => {
  try {
    const { startDate, endDate, employeeName } = req.query;
    const filter = {};

    if (startDate || endDate) {
      filter.visitingDateTime = {};
      if (startDate) filter.visitingDateTime.$gte = new Date(startDate);
      if (endDate) filter.visitingDateTime.$lte = new Date(endDate);
    }

    if (employeeName) {
      filter.employeeName = new RegExp(employeeName, "i");
    }

    const retailers = await Retailer.find(filter).lean();
    if (!retailers.length) {
      return res
        .status(404)
        .json({ message: "No data found for given filters" });
    }

    const formattedData = retailers.map((r) => ({
      "Employee Name": r.employeeName,
      "Retailer Name": r.retailerName,
      "Retailer Contact": r.retailerContact,
      "Retailer Email": r.retailerEmail,
      "Shop Name": r.shopName,
      "City/Village": r.cityVillage,
      Tehsil: r.tehsil,
      District: r.district,
      State: r.state,
      "Visiting Date & Time": r.visitingDateTime
        ? new Date(r.visitingDateTime).toLocaleString()
        : "",
      BBPS: r.bbps,
      AEPS: r.aeps,
      DMT: r.dmt,
      CMS: r.cms,
      "Onboarding Status": r.onboardingStatus,
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    worksheet["!cols"] = Object.keys(formattedData[0]).map((key) => ({
      wch:
        Math.max(
          key.length,
          ...formattedData.map((row) =>
            row[key] ? row[key].toString().length : 0
          )
        ) + 2,
    }));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Retailers");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "buffer",
    });

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=retailers_data.xlsx"
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.send(excelBuffer);
  } catch (err) {
    console.error("❌ Excel error:", err);
    res.status(500).json({ message: "Error generating Excel" });
  }
});

const PORT = 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
