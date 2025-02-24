import { connectToDatabase } from "@/lib/mongodb";
import Attendance from "@/models/Attendance";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        await connectToDatabase();

        // Extract studentId from the request body
        const { studentId } = await req.json();
        console.log(req.json());

        console.log("Received studentId:", studentId);

        // Fetch the existing attendance record
        const existingRecord = await Attendance.findOne({ studentId });
        console.log("Existing Record:", existingRecord);

        // Check if the student has already attended
        if (existingRecord && existingRecord.attended) {
            console.log("Attendance already marked for student:", studentId);
            return NextResponse.json({ success: false, message: "❌ Already Marked!" }, { status: 400 });
        }

        // Update the attendance record or create a new one if it doesn't exist
        const updatedRecord = await Attendance.findOneAndUpdate(
            { studentId },
            { attended: true, generatedAt: Date.now() },
            { new: true, upsert: true }
        );

        console.log("Updated Record:", updatedRecord);

        return NextResponse.json({ success: true, data: updatedRecord });
    } catch (error) {
        console.error("Error occurred:", error); // Log the error for debugging
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
