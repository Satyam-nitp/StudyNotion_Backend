const Category = require("../models/Category");

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    // Validate input
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "Name and description are required",
      });
    }

    //create entry in the database
    const categoryDetails = await Category.create({
      name: name,
      description: description,
    });
    console.log(categoryDetails);

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
    });
  } catch (error) {
    console.error("Error in createCategory:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const allCategories = await Category.find({});
    // console.log("Backend: category: ",allCategories);
    return res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      allCategories,
    });
  } catch (error) {
    console.error("Error in getAllCategories:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//categoryPageDetails
exports.categoryPageDetails = async (req, res) => {
  try {
    const { categoryId } = req.body;

    const selectedCategory = await Category.findById(categoryId)
      .populate({
        path: "course",
        match: { status: "Published" },
        populate: "ratingAndReviews",
      })
      .exec();

    if (!selectedCategory) {
      console.log("Category not found.");
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    if (selectedCategory.course.length === 0) {
      console.log("No courses found for the selected category.");
      return res.status(200).json({
        success: true,
        message: "No courses found for the selected category.",
      });
    }

    const categoriesExceptSelected = await Category.find({
      _id: { $ne: categoryId },
    });
    let differentCategory = await Category.findOne(
      categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
        ._id
    )
      .populate({
        path: "course",
        match: { status: "Published" },
      })
      .exec();
    console.log();

    const allCategories = await Category.find()
      .populate({
        path: "course",
        match: { status: "Published" },
      })
      .exec();
    const allCourses = allCategories.flatMap((category) => category.course);
    const mostSellingCourses = allCourses
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 10);

    res.status(200).json({
      success: true,
      data: {
        selectedCategory,
        differentCategory,
        mostSellingCourses,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
