const validateRequest = (requiredFields) => {
  return (req, res, next) => {
    // Use req.body after multer processes form-data
    const missingFields = requiredFields.filter((field) => {
console.log(req.body[field]);
      // !req.body[field];
    });

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    next(); // Proceed if validation passes
  };
};

export default validateRequest;
