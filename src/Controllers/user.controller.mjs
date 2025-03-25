import User from "../Models/user.model.mjs";

const storeUserLocation= async (req, res) => {
  try {
    const driverId = req.params.userId;
    const {latitude, longitude} = req.body;
    
    // Find the driver and update location
    const updatedDriver = await User.findOneAndUpdate(
      { _id: driverId, role: "driver" },
      {
        location: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
      },
      { new: true } 
    );

    if (!updatedDriver) {
      return res.status(404).json({ success: false, error: "Driver not found or invalid role" });
    }

    return res.status(200).json({
      success: true,
      message: "Driver location updated successfully",
      data: updatedDriver,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

const specificUserById = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).send("Server error");
  }
};

// const userModification = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const { userName, about } = req.body;
//     const photo = req.file?.path;

//     const user = await User.findById(userId);
//     if (!user) {
//       ء;
//       return res.status(404).json({ message: "User not found" });
//     }

//     if (userName) user.userName = userName;
//     if (photo) user.photo = photo;
//     if (about) user.about = about;

//     await user.save();

//     const updatedUser = await User.findById(userId);
//     const formattedUser = formatUserData(updatedUser);
//     res.status(202).json(formattedUser);
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// userModification
const driverAvailability = async (req, res) => {
  try {
    const { user } = req;
    const { driverStatus } = req.body;

    const updatedDriver = await User.findByIdAndUpdate(
      user._id,
      { status: driverStatus },
      { new: true }
    );

    if (!updatedDriver) {
      return res.status(404).json({ success: false, msg: "Driver not found" });
    }
    const statusMessage =
      driverStatus === "available"
        ? "Now, Driver is available"
        : "Now, Driver is offline";

    return res.status(200).json({ success: true, msg: statusMessage });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};


export { storeUserLocation, specificUserById, driverAvailability };
