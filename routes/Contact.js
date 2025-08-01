const express = require("express");
const { contactUsController, contactInstructorController } = require("../controllers/ContactUs");
const router = express.Router();

router.post("/contact", contactUsController);
router.post("/contactAdmin", contactInstructorController);

module.exports = router;