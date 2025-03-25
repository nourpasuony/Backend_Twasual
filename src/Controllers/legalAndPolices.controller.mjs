import legalAndPolices from "../Models/legalAndPolices.model.mjs";

const storeLegalMsg = async (req, res) => {
  try {
    const newHelpItem = new legalAndPolices({
      title: {
        en: req.body.titleEn,
        ar: req.body.titleAr,
      },
      description: {
        en: req.body.descriptionEn,
        ar: req.body.descriptionAr,
      },
    });
    const savedItem = await newHelpItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding new help item" });
  }
};

const getAllLegalMsg = async (req, res) => {
  const { lang = "en" } = req.headers;
  try {
    const helpItems = await legalAndPolices.find();
    const translatedHelpItems = helpItems.map((item) => ({
      title: item.title[lang],
      description: item.description[lang],
    }));
    res.json(translatedHelpItems);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error fetching help and support content" });
  }
};

const updateLegalMsg = async (req, res) => {
  try {
    const { titleEn, titleAr, descriptionEn, descriptionAr } = req.body;

    // Check if any required fields are missing
    if (!titleEn || !titleAr || !descriptionEn || !descriptionAr) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const updatedItem = await legalAndPolices.findByIdAndUpdate(
      req.params.id,
      {
        title: {
          en: req.body.titleEn,
          ar: req.body.titleAr,
        },
        description: {
          en: req.body.descriptionEn,
          ar: req.body.descriptionAr,
        },
      },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Help item not found" });
    }
    res.json(updatedItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating help item" });
  }
};

const deleteLegalMsg = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await legalAndPolices.findById(id);
    if (!deletedItem) {
      return res.status(404).json({ message: "Police item not found" });
    }
    await deletedItem.deleteOne({ _id: id });
    res.status(200).json({ message: "Police item deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting Police item" });
  }
};

export { getAllLegalMsg, updateLegalMsg, storeLegalMsg, deleteLegalMsg };
