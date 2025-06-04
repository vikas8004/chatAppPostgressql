import { v2 as cloudinary } from "cloudinary";
import DataUriParser from "datauri/parser.js";
import path from "path";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadImageToCloudinary = async file => {
  try {
    const parser = new DataUriParser();
    const dataUri = parser.format(
      path.extname(file.originalname).toString(),
      file.buffer
    );
    const result = await cloudinary.uploader.upload(dataUri.content, {
      folder: "chatapp"
    });
    return result; // Return the URL of the uploaded image
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw new Error("Image upload failed");
  }
};
