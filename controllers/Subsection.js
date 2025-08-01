const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/imageUploader"); // Assuming you have a utility to handle image uploads

require("dotenv").config();

exports.createSubSection = async (req, res) => {
  try {
    // Fetch data from request body
    const { sectionId, title, description } = req.body;
    //extract video
    const video = req.files.videoFile;
    //validate input
    if (!sectionId || !title || !description || !video) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    //upload video to cloudinary
    const uploadDetails = await uploadImageToCloudinary(
      video,
      process.env.FOLDER_NAME
    );
    console.log("uploadDetails: ", uploadDetails);

    //create sub-section
    const SubSectionDetails = await SubSection.create({
      title,
      timeDuration: `${uploadDetails.duration}`,
      description,
      videoUrl: uploadDetails.secure_url,
    });

    //update section with new sub-section
    const updatedSection = await Section.findByIdAndUpdate(
      { _id: sectionId },
      { $push: { subsection: SubSectionDetails._id } },
      { new: true }
    ).populate("subsection");

    //log updated section here, after adding populate
    // await updatedSection.populate({
    //   path: "subsection",
    //   select: "title timeDuration description videoUrl",
    // });
    console.log("Updated Section:", updatedSection);

    // Return success response
    res.status(200).json({
      success: true,
      message: "Sub-section created successfully",
      data: updatedSection,
    });
  } catch (error) {
    console.error("Error creating sub-section:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.updateSubSection = async (req, res) => {
  try {
    // Fetch data from request body
    const { sectionId, subSectionId, title, description } = req.body;
    //extract video
    const subSection = await SubSection.findById(subSectionId);

    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      });
    }

    if (title !== undefined) {
      subSection.title = title;
    }

    if (description !== undefined) {
      subSection.description = description;
    }
    if (req.files && req.files.videoFile !== undefined) {
      const video = req.files.videoFile;
      const uploadDetails = await uploadImageToCloudinary(
        video,
        process.env.FOLDER_NAME
      );
      subSection.videoUrl = uploadDetails.secure_url;
      subSection.timeDuration = `${uploadDetails.duration}`;
    }

    await subSection.save();

    const updatedSection = await Section.findById(sectionId).populate(
      "subsection"
    );

    console.log("updated section", updatedSection);

    return res.json({
      success: true,
      message: "Section updated successfully",
      data: updatedSection,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the section",
    });
  }
};

exports.deleteSubSection = async (req, res) => {
  try {
    // Fetch sub-section ID from request body
    const { sectionId, subSectionId } = req.body;

    await Section.findByIdAndUpdate(
      { _id: sectionId },
      {
        $pull: {
          subsection: subSectionId,
        },
      }
    );

    // Find and delete the sub-section
    const deletedSubSection = await SubSection.findByIdAndDelete({
      _id: subSectionId,
    });

    // Check if sub-section was found and deleted
    if (!deletedSubSection) {
      return res.status(404).json({
        success: false,
        message: "Sub-section not found",
      });
    }

    const updatedSection = await Section.findById(sectionId).populate(
      "subsection"
    );

    return res.json({
      success: true,
      message: "SubSection deleted successfully",
      data: updatedSection,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the SubSection",
    });
  }
};
