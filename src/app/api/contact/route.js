import { NextResponse } from "next/server";
import { connectDB } from "../../database/mongo/connection"; // your DB connection helper
import { ContactModel } from "../../database/mongo/model"; // your Mongoose model

export async function POST(request) {
  try {
    await connectDB(); // connect to MongoDB

    const body = await request.json();
    const { name, email, message } = body;

    if (!email || !message || !name) {
      return NextResponse.json(
        { success: false, error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Ensure message is always an array
    const messagesArray = Array.isArray(message) ? message : [message];

    // Upsert: if email exists, push message; else create new with name
    const result = await ContactModel.findOneAndUpdate(
      { _id: email }, // use email as _id
      { 
        $setOnInsert: { name }, // only set name if new document
        $push: { message: { $each: messagesArray } } // push new messages
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json(
      { success: true, data: result, message: "Message saved successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Something went wrong" },
      { status: 500 }
    );
  }
}
