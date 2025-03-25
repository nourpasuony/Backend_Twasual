import Car from "../Models/car.model.mjs";
import Driver from "../Models/user.model.mjs";

const createCar = async (req, res) => {
  try {
    const { model, year, color, numCar } = req.body;
    const uploadedImagesULS = req.urls;
    const driverId = req.user._id;

    if (!model || !year || !color || !numCar || !driverId) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const driverFound = await Driver.findById(driverId);
    if (!driverFound) {
      return res.status(404).json({ message: "Driver not found" });
    }

    const existingCar = await Car.findOne({ numCar });
    if (existingCar) {
      return res.status(400).json({ error: "Car already exists" });
    }

    const newCar = new Car({
      photoCar: uploadedImagesULS,
      model,
      year,
      color,
      numCar,
      driverId,
    });

    await Driver.findByIdAndUpdate(driverId, { cars: newCar }, { new: true });

    await newCar.save();
    res.status(201).json({ message: "Car created successfully", data: newCar });
  } catch (error) {
    res.status(500).send("Server error");
  }
};

const updateCar = async (req, res) => {
  try {
    const carId = req.params.carId;
    const driverId = req.user._id;
    const {} = req.body;

    const driverFound = await Driver.findById(driverId);
    if (!driverFound) {
      return res.status(404).json({ message: "Driver not found" });
    }

    if (driverFound.cars != carId) {
      return res.status(403).json({
        error: "You are not authorized to update this car",
      });
    }

    const updatedCar = await Car.findByIdAndUpdate(
      carId,
      { photoCar: uploadedImagesULS, model, year, color, numCar},
      { new: true }
    );
    if (!updatedCar) {
      return res.status(404).json({ message: "Car not found" });
    }

    res
      .status(200)
      .json({ message: "Car updated successfully", data: updatedCar });
  } catch (error) {
    return handleError(res, error);
  }
};

const deleteCar = async (req, res) => {
  try {
    const carId = req.params.carId;
    const { user } = req;

    const driver = await Driver.findById(user._id);
    if (!driver) {
      return res
        .status(401)
        .json({ error: "Unauthorized. Driver authentication required." });
    }

    if (driver.cars != carId) {
      return res.status(403).json({
        error: "You are not authorized to delete this car",
      });
    }

    const deletedcar = await Car.findByIdAndDelete(carId);
    if (!deletedcar) {
      return res.status(404).json({ message: "car not found" });
    }
    await Driver.findByIdAndUpdate(user?._id, { cars: null }, { new: true });

    res.status(202).json({ message: "Car is delete" });
  } catch (error) {
    return handleError(res, error);
  }
};




const getAllCars = async (req, res) => {
  try {
    const cars = await Car.find();
    res.status(200).json({ data: cars });
  } catch (error) {
    return handleError(res, error);
  }
};

const getCarById = async (req, res) => {
  try {
    const { id } = req.params;
    const car = await Car.findById(id);
    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }
    res.status(200).json({ data: car });
  } catch (error) {
    return handleError(res, error);
  }
};

export { createCar, updateCar, deleteCar, getAllCars, getCarById };
