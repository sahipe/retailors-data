import React, { useState } from "react";
import axios from "axios";
import { uploadImageToCloudinary } from "../hooks/uploadImage";

const PartnerForm = () => {
  const [form, setForm] = useState({
    employeeName: "",
    retailerName: "",
    retailerContact: "",
    retailerEmail: "",
    shopName: "",
    cityVillage: "",
    tehsil: "",
    district: "",
    state: "",
    visitingDateTime: "",
    bbps: "",
    aeps: "",
    dmt: "",
    cms: "",
    onboardingStatus: "",
    retailerImage: "", // new field for image URL
  });

  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageUploading(true);
    try {
      const imageUrl = await uploadImageToCloudinary(file);
      setForm((prev) => ({ ...prev, retailerImage: imageUrl }));
    } catch (err) {
      console.error(err);
      alert("Image upload failed!");
    } finally {
      setImageUploading(false);
    }
  };

  const validateForm = () => {
    const requiredFields = Object.keys(form).filter((key) => key !== "tehsil");

    for (let field of requiredFields) {
      if (!form[field] || form[field].trim() === "") {
        alert(`Please fill the ${field.replace(/([A-Z])/g, " $1")}`);
        return false;
      }
    }

    if (!/^\d{10}$/.test(form.retailerContact)) {
      alert("Retailer Contact must be a valid 10-digit number");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.retailerEmail)) {
      alert("Please enter a valid email address");
      return false;
    }

    const numberFields = ["bbps", "aeps", "dmt", "cms"];
    for (let field of numberFields) {
      if (isNaN(form[field]) || Number(form[field]) < 0) {
        alert(`${field.toUpperCase()} must be a valid positive number`);
        return false;
      }
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await axios.post(
        "https://retailors-data.onrender.com/api/retailers",
        form
      );
      alert("Data saved successfully!");
      setForm({
        employeeName: "",
        retailerName: "",
        retailerContact: "",
        retailerEmail: "",
        shopName: "",
        cityVillage: "",
        tehsil: "",
        district: "",
        state: "",
        visitingDateTime: "",
        bbps: "",
        aeps: "",
        dmt: "",
        cms: "",
        onboardingStatus: "",
        retailerImage: "",
      });
    } catch (error) {
      console.error(error);
      alert("Failed to save data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl p-8">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">
          Retailer Data Form
        </h2>

        {/* Form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { name: "employeeName", placeholder: "Employee Name" },
            { name: "retailerName", placeholder: "Retailer Name" },
            { name: "retailerContact", placeholder: "Retailer Contact Number" },
            { name: "retailerEmail", placeholder: "Retailer Email ID" },
            { name: "shopName", placeholder: "Shop Name" },
            { name: "cityVillage", placeholder: "City/Village" },
            { name: "tehsil", placeholder: "Tehsil (Optional)" },
            { name: "district", placeholder: "District" },
            { name: "state", placeholder: "State" },
          ].map((field) => (
            <input
              key={field.name}
              name={field.name}
              value={form[field.name]}
              onChange={handleChange}
              placeholder={field.placeholder}
              className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 shadow-sm"
            />
          ))}

          <input
            type="datetime-local"
            name="visitingDateTime"
            value={form.visitingDateTime}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-3"
          />
          <input
            name="bbps"
            value={form.bbps}
            onChange={handleChange}
            placeholder="BBPS / day"
            className="border border-gray-300 rounded-lg p-3"
          />
          <input
            name="aeps"
            value={form.aeps}
            onChange={handleChange}
            placeholder="AEPS Transaction / day"
            className="border border-gray-300 rounded-lg p-3"
          />
          <input
            name="dmt"
            value={form.dmt}
            onChange={handleChange}
            placeholder="DMT / day"
            className="border border-gray-300 rounded-lg p-3"
          />
          <input
            name="cms"
            value={form.cms}
            onChange={handleChange}
            placeholder="CMS / day"
            className="border border-gray-300 rounded-lg p-3"
          />
          <select
            name="onboardingStatus"
            value={form.onboardingStatus}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-3 bg-white"
          >
            <option value="">Onboarding Status</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>

          {/* Image Upload */}
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="border border-gray-300 rounded-lg p-3"
            />
            {imageUploading && (
              <p className="text-sm text-blue-500 mt-1">Uploading...</p>
            )}
            {form.retailerImage && (
              <img
                src={form.retailerImage}
                alt="Retailer"
                className="mt-2 w-32 h-32 object-cover rounded-lg shadow"
              />
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-xl shadow-lg flex items-center justify-center"
          >
            {loading && (
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z"
                ></path>
              </svg>
            )}
            {loading ? "Saving..." : "💾 Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PartnerForm;
