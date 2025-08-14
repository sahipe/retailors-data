// services/uploadImage.js
export const uploadImageToCloudinary = async (file) => {
  if (!file) throw new Error("No file selected");

  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "retailer_uploads"); // from Cloudinary dashboard
  data.append("cloud_name", "dkb1moyqh"); // from Cloudinary dashboard

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/dkb1moyqh/image/upload`,
      {
        method: "POST",
        body: data,
      }
    );

    if (!res.ok) throw new Error("Failed to upload image");

    const json = await res.json();
    return json.secure_url; // This is the image URL
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
};
