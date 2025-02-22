import { connectToDatabase } from "@/lib/mongodb";
import Attendance from "@/models/Attendance";

export async function POST(req) {
    try {
        await connectToDatabase();
        const { scannedData } = await req.json();

        // Extract studentId from the scanned URL
        const url = new URL(scannedData, `http://${req.headers.host}`);
        const studentId = url.pathname.split("/")[2]; // Assuming the URL format is /confirm-attendance/{studentId}

        if (!studentId) {
            return Response.json({ success: false, message: "❌ Invalid Student ID" }, { status: 400 });
        }

        const existingRecord = await Attendance.findOne({ studentId });

        if (existingRecord && existingRecord.attended) {
            return Response.json({ success: false, message: "❌ Already Marked!" }, { status: 400 });
        }

        const updatedRecord = await Attendance.findOneAndUpdate(
            { studentId },
            { attended: true, generatedAt: Date.now() },
            { new: true, upsert: true }
        );

        return Response.json({ success: true, data: updatedRecord });
    } catch (error) {
        return Response.json({ success: false, message: error.message }, { status: 500 });
    }
}
