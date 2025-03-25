import { Schema, model } from "mongoose";

const legalAndPolicesSchema = Schema({
    title: {
        en: { type: String, required: true },
        ar: { type: String, required: true }
    },
    description: {
        en: { type: String, required: true },
        ar: { type: String, required: true }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const legalAndPolices = model('legalAndPolices', legalAndPolicesSchema);

export default legalAndPolices;
