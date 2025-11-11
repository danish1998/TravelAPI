const TravelPlan = require("../Models/TravelPlan");

const getAllGeneratedPlans = async (req, res, next) => {
  try {
    const travelPlans = await TravelPlan.find().lean();

    if (!travelPlans || travelPlans.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No travel plans found",
      });
    }

    return res.json({
      success: true,
      data: travelPlans,
    });

  } catch (err) {
   res.status(500).json({
      success: false,
      message: "Internal server error while searching trips",
      error: process.env.NODE_ENV === "development" ? err.message : "Something went wrong"
    });

  }
};

const getGeneratedPlansById = async (req, res, next) => {
    const { id } = req.params;
    
  try {
    const travelPlans = await TravelPlan.findById(id)

    if (!travelPlans || travelPlans.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No travel plans found",
      });
    }

    return res.json({
      success: true,
      data: travelPlans,
    });

  } catch (err) {
   res.status(500).json({
      success: false,
      message: "Internal server error while searching trips",
      error: process.env.NODE_ENV === "development" ? err.message : "Something went wrong"
    });

  }
};

module.exports = {
  getAllGeneratedPlans,
  getGeneratedPlansById
};
