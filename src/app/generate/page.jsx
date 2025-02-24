"use client";
import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function GenerateQR() {
    const [studentId, setStudentId] = useState("");
    const [qrUrl, setQrUrl] = useState("");
    const [error, setError] = useState(""); // Add error state

    const handleGenerateQR = () => {
        console.log("Student ID:", studentId); // Log studentId to ensure it's not empty
        if (!studentId.trim()) { // Check if studentId is not empty
            setError("Student ID is required.");
            return;
        }
        setError(""); // Clear error if studentId is valid

        const timestamp = Date.now(); // ✅ Get current time
        const encodedUrl = `${window.location.origin}/confirm-attendance/${studentId}?t=${timestamp}`; // ✅ URL for scanning
        console.log("Generated URL:", encodedUrl); // Log generated URL
        setQrUrl(encodedUrl);
    };


    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
            <h1 className="text-2xl font-bold mb-4 text-black">Generate Attendance QR Code</h1>
            <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="Enter Student ID"
                className="p-2 text-black border rounded-md mb-4"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>} {/* Display error message */}
            <button
                onClick={handleGenerateQR}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
                Generate QR
            </button>

            {qrUrl && (
                <div className="mt-6 bg-white text-black p-4 rounded-lg shadow-md">
                    <QRCodeCanvas value={qrUrl} size={200} />
                    <p className="mt-2 text-sm">Scan this QR within 5 minutes.</p>
                </div>
            )}
        </div>
    );
}
