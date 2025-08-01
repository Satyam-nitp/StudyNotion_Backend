const cloudinary=require('cloudinary').v2;


exports.uploadImageToCloudinary = async (file, folder, height, quality) => {
  try {
    const options={folder};
    if (height) {
      options.height = height;
    }
    if (quality) {
      options.quality = quality;
    }
    options.resource_type = 'auto'; // Ensure the resource type is set to image

    return await cloudinary.uploader.upload(file.tempFilePath, options);
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    return {
      success: false,
      message: "Error uploading image"
    };
  }
};
