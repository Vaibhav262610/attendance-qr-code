"use client";
import { useEffect, useState, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useRouter } from "next/navigation";

export default function ScanQR() {
    const router = useRouter();
    const [scannedId, setScannedId] = useState(""); // Store scanned student ID
    const [showMessage, setShowMessage] = useState(false); // Show success or error message
    const [errorMessage, setErrorMessage] = useState(""); // Error message
    const [loading, setLoading] = useState(false); // Loading state
    const scannerRef = useRef(null); // Store scanner instance with useRef

    useEffect(() => {
        // Only initialize the scanner once
        if (!scannerRef.current) {
            const qrScanner = new Html5QrcodeScanner("reader", {
                fps: 10,
                qrbox: 250,
            });

            scannerRef.current = qrScanner;

            // Render the QR scanner and handle the scanned data
            qrScanner.render(async (decodedText) => {
                console.log("Decoded Text:", decodedText); // Log decoded text for debugging

                // Extract studentId from the decoded URL (after "/confirm-attendance/")
                const urlParams = new URLSearchParams(decodedText.split("?")[1]); // Get URL parameters
                const studentId = decodedText.split("/confirm-attendance/")[1].split("?")[0]; // Get studentId
                console.log("Extracted Student ID:", studentId); // Log extracted studentId

                setScannedId(studentId); // Update the scanned ID state
                qrScanner.clear(); // Stops the camera after scanning
                setLoading(true); // Set loading to true while processing

                try {
                    // Send the scanned student ID to the API
                    const res = await fetch("/api/mark-attendance", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ studentId }), // Send the decoded studentId
                    });

                    const data = await res.json();

                    if (!res.ok) {
                        setErrorMessage(data.message); // Show error message if something went wrong
                    } else {
                        setShowMessage(true); // Show success message
                    }
                } catch (error) {
                    setErrorMessage("Error marking attendance. Please try again."); // Handle network or API error
                } finally {
                    setLoading(false); // Reset loading state
                    setTimeout(() => {
                        router.push("/"); // Redirect after 2 seconds
                    }, 2000);
                }
            });
        }

        return () => {
            // Cleanup the scanner when the component unmounts
            if (scannerRef.current) {
                scannerRef.current.clear();
            }
        };
    }, [router]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-black bg-gray-100 p-6">
            <h1 className="text-2xl font-bold mb-4">Scan QR Code</h1>

            {loading ? (
                <p className="mt-4 text-blue-600 font-semibold text-lg">Scanning... Please wait.</p>
            ) : (
                <>
                    {!showMessage && !errorMessage ? (
                        <div id="reader" className="w-72 h-72 bg-white rounded-lg shadow-md"></div>
                    ) : errorMessage ? (
                        <p className="mt-4 text-red-600 font-semibold text-lg">{errorMessage}</p>
                    ) : (
                        <p className="mt-4 text-green-600 font-semibold text-lg">
                            ✅ Attendance Marked! Redirecting...
                        </p>
                    )}
                </>
            )}
        </div>
    );
}
