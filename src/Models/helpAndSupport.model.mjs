import { Schema, model } from "mongoose";

const helpSupportSchema = Schema({
    question: {
        en: { type: String, required: true },
        ar: { type: String, required: true }
    },
    answer: {
        en: { type: String, required: true },
        ar: { type: String, required: true }
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const HelpSupport = model('HelpSupport', helpSupportSchema);
export default HelpSupport;