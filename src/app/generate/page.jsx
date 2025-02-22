"use client";
import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function GenerateQR() {
    const [studentId, setStudentId] = useState(""); // Initialize with an empty string
    const [qrUrl, setQrUrl] = useState("");

    const handleGenerateQR = () => {
        if (!studentId) {
            alert("Please enter a valid student ID");
            return;
        }
        const timestamp = Date.now(); // Get current time
        const encodedUrl = `${window.location.origin}/confirm-attendance/${studentId}?t=${timestamp}`; // URL for scanning
        setQrUrl(encodedUrl);
    };


    return (
        <div className="min-h-screen flex flex-col text-black items-center justify-center bg-gray-100 p-6">
            <h1 className="text-2xl font-bold mb-4">Generate Attendance QR Code</h1>
            <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)} // This will update the studentId state
                placeholder="Enter Student ID"
                className="p-2 border rounded-md text-black mb-4"
            />
            <button
                onClick={handleGenerateQR}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
                Generate QR
            </button>

            {qrUrl && (
                <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
                    <QRCodeCanvas value={qrUrl} size={200} />
                    <p className="mt-2 text-sm">Scan this QR within 5 minutes.</p>
                </div>
            )}
        </div>
    );
}
