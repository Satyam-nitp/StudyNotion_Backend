const Section = require("../models/Section");
const Course = require("../models/Course");


exports.createSection = async (req, res) => {
  try {
    const { sectionName, courseId } = req.body;

    // Validation
    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Section name and course ID are required",
      });
    }

    // 1. Create new section
    const newSection = await Section.create({ sectionName });

    // 2. Push section to course and populate nested structure
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      { $push: { courseContent: newSection._id } },
      { new: true }
    ).populate({
      path: "courseContent", // populate Sections
      populate: {
        path: "subsection", // inside each Section, populate SubSections
        model: "SubSection",
      },
    });

    if (!updatedCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      updatedCourse,
      message: "Section created and course updated successfully",
    });
  } catch (error) {
    console.error("Error creating section:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};



exports.updateSection = async (req, res) => {
  try {
    // Fetch data from request body
    const { sectionId, sectionName } = req.body;

    // Validate input
    if (!sectionId || !sectionName) {
      return res.status(400).json({
        success: false,
        message: "Section ID and section name are required",
      });
    }

    // Update section
    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      { sectionName },
      { new: true }
    );

    if(!updatedSection){
      return res.status(400).json({
        success: false,
        message: "section not found",
      })
    }

    // Return success response
    res.status(200).json({
      success: true,
      data: updatedSection,
      message: "Section updated successfully",
    });
  } catch (error) {
    console.error("Error updating section:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.deleteSection = async (req, res) => {
  try {
    // Fetch section ID from request body
    const { sectionId } = req.body;

    // Validate input
    if (!sectionId) {
      return res.status(400).json({
        success: false,
        message: "Section ID is required",
      });
    }

    // Find and delete section
    await Section.findByIdAndDelete(sectionId);

    //TODO: we need to delete the entry from the course schema as well
    await Course.updateMany(
      { courseContent: sectionId },
      { $pull: { courseContent: sectionId } }
    );

    // Return success response
    res.status(200).json({
      success: true,
      message: "Section deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting section:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
