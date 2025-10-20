import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    _id:String,
},{
    timestamps: true,
    strict: false
});

export const ContactModel = mongoose.model("Contact", contactSchema);