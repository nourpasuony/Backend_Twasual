import Licence from "../Models/driverLicense.model.mjs";
import Driver from "../Models/user.model.mjs";

const createLicense = async (req, res) => {
  try {
    const { urls, user } = req;
    const { licenseNumber, issuedDate, expiryDate } = req.body;

    if (!licenseNumber || !issuedDate || !expiryDate) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return res
        .status(400)
        .json({ error: "At least one license image is required" });
    }

    const driver = await Driver.findById(user?._id);
    if (!driver) {
      return res
        .status(401)
        .json({ error: "Unauthorized. You must authenticate" });
    }

    const existingLicense = await Licence.findOne({ driverId: user._id });
    if (existingLicense) {
      return res
        .status(409)
        .json({ error: "License already exists for this driver" });
    }

    const newLicense = await Licence.create({
      driverId: user._id,
      licenseNumber,
      licenseImages: urls,
      issuedDate,
      expiryDate,
    });

    await Driver.findByIdAndUpdate(
      user?._id,
      { license: newLicense._id },
      { new: true }
    );

    return res.status(201).json({
      message: "License created successfully",
      data: newLicense,
    });
  } catch (error) {
    console.error("Error occurred:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }

    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateLicense = async (req, res) => {
  try {
    const LicenseId = req.params.LicenseId;
    const { urls, user } = req;
    const { licenseNumber, issuedDate, expiryDate } = req.body;

    const driver = await Driver.findById(user._id);
    if (!driver) {
      return res
        .status(401)
        .json({ error: "Unauthorized. Driver authentication required." });
    }

    if (driver.license != LicenseId) {
      return res.status(403).json({
        error: "You are not authorized to update this license",
      });
    }

    const updatedLicense = await Licence.findByIdAndUpdate(
      LicenseId,
      {
        licenseNumber,
        licenseImages: urls,
        issuedDate,
        expiryDate,
      },
      { new: true }
    );

    if (!updatedLicense) {
      return res.status(404).json({ error: "License not found." });
    }

    res
      .status(200)
      .json({ message: "License updated successfully", data: updatedLicense });
  } catch (error) {
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

const deleteLicense = async (req, res) => {
  try {
    const LicenseId = req.params.LicenseId;
    const { user } = req;

    const driver = await Driver.findById(user._id);
    if (!driver) {
      return res
        .status(401)
        .json({ error: "Unauthorized. Driver authentication required." });
    }

    if (driver.license != LicenseId) {
      return res.status(403).json({
        error: "You are not authorized to delete this license",
      });
    }

    const deletedLicense = await Licence.findByIdAndDelete(LicenseId);
    if (!deletedLicense) {
      return res.status(404).json({ message: "License not found" });
    }
    await Driver.findByIdAndUpdate(user?._id, { license: null }, { new: true });

    res.status(202).json({ message: "License is delete" });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};

const specificLinceseById = async (req, res) => {
  try {
    const { user } = req;
    const licenses = await Licence.find({ driverId: user._id });

    if (!licenses || licenses.length === 0) {
      return res
        .status(404)
        .json({ message: "No licenses found. Please upload your license." });
    }

    res.status(200).json({
      message: "Licenses retrieved successfully.",
      data: licenses,
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

const AllPendingDriverLicenses = async (req, res) => {
  try {
    const pendingLicenses = await Licence.find({ status: "pending" }).populate({
      path: "driverId",
      select: "userName phone",
      options: { lean: true },
    });

    res.status(200).json({
      message: "Pending licenses retrieved successfully",
      data: pendingLicenses,
    });
  } catch (error) {
    res.status(500).send("Server error");
  }
};

const approveLicense = async (req, res) => {
  try {
    const admin = req.user;
    const licenseId = req.params.LicenseId;

    await Licence.findByIdAndUpdate(licenseId, {
      status: "approved",
      verifiedBy: admin._id,
    });

    res.status(200).json({
      message: "licenses approved",
      data: "",
    });
  } catch (error) {
    res.status(500).send("Server error");
  }
};
const rejectLicense = async (req, res) => {
  try {
    const admin = req.user;
    const licenseId = req.params.LicenseId;
    const rejectionReason = req.body.rejectionReason

    await Licence.findByIdAndUpdate(licenseId, {
      status: "rejected",
      verifiedBy: admin._id,
      rejectionReason
    });

    res.status(200).json({
      message: "licenses rejected",
      data: "",
    });
  } catch (error) {
    res.status(500).send("Server error");
  }
};

export {
  createLicense,
  updateLicense,
  deleteLicense,
  specificLinceseById,
  AllPendingDriverLicenses,
  approveLicense,
  rejectLicense
};
