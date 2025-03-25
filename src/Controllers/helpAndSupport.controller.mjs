import HelpSupport from "../Models/helpAndSupport.model.mjs";

const storeHelpAndSupportMsg = async (req, res) => {
  try {
    const newHelpItem = new HelpSupport({
      question: {
        en: req.body.questionEn,
        ar: req.body.questionAr,
      },
      answer: {
        en: req.body.answerEn,
        ar: req.body.answerAr,
      },
    });
    const savedItem = await newHelpItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding new help item" });
  }
};

const getAllHelpAndSupportMsg = async (req, res) => {
  const { lang = "en" } = req.headers;

  try {
    const helpItems = await HelpSupport.find();

    const translatedHelpItems = helpItems.map((item) => ({
      question: item.question[lang],
      answer: item.answer[lang],
    }));
    res.json(translatedHelpItems);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error fetching help and support content" });
  }
};

const updateHelpAndSupportMsg = async (req, res) => {
  try {
    const { questionEn, questionAr, answerEn, answerAr } = req.body;

    // Check if any required fields are missing
    if (!questionEn || !questionAr || !answerEn || !answerAr) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    
    const updatedItem = await HelpSupport.findByIdAndUpdate(
      req.params.id,
      {
        question: {
          en: req.body.questionEn,
          ar: req.body.questionAr,
        },
        answer: {
          en: req.body.answerEn,
          ar: req.body.answerAr,
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

const deleteHelpAndSupportMsg = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await HelpSupport.findById(id);
    if (!deletedItem) {
      return res.status(404).json({ message: "Help item not found" });
    }
    // Delete the item after confirming it exists
    await deletedItem.deleteOne({ _id: id });

    res.status(200).json({ message: "Help item deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting help item" });
  }
};

export {
  getAllHelpAndSupportMsg,
  updateHelpAndSupportMsg,
  storeHelpAndSupportMsg,
  deleteHelpAndSupportMsg,
};
