import React, { useState } from "react";
import axios from "axios";

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
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!form.employeeName || !form.retailerName) {
      alert("Please fill at least Employee Name & Retailer Name");
      return;
    }
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
          🛒 Retailer Data Form
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
            { name: "tehsil", placeholder: "Tehsil" },
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
