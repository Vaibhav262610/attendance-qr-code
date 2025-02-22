"use client";
import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useRouter } from "next/navigation";

export default function ScanQR() {
    const router = useRouter();
    const [scannedId, setScannedId] = useState("");
    const [showMessage, setShowMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [scanner, setScanner] = useState(null);

    useEffect(() => {
        if (!scanner) {
            const qrScanner = new Html5QrcodeScanner("reader", {
                fps: 10,
                qrbox: 250,
            });

            qrScanner.render(async (decodedText) => {
                setScannedId(decodedText);
                qrScanner.clear(); // Stops the camera after scanning

                const res = await fetch("/api/mark-attendance", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ scannedData: decodedText }), // Send the decoded text (student ID)
                });

                const data = await res.json();

                if (!res.ok) {
                    setErrorMessage(data.message); // Show error if QR expired
                } else {
                    setShowMessage(true); // Show success message
                    setTimeout(() => {
                        router.push("/");
                    }, 2000);
                }
            });


            setScanner(qrScanner);
        }
    }, [scanner, router]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-black bg-gray-100 p-6">
            <h1 className="text-2xl font-bold mb-4">Scan QR Code</h1>

            {!showMessage && !errorMessage ? (
                <div id="reader" className="w-72 h-72 bg-white rounded-lg shadow-md"></div>
            ) : errorMessage ? (
                <p className="mt-4 text-red-600 font-semibold text-lg">{errorMessage}</p>
            ) : (
                <p className="mt-4 text-green-600 font-semibold text-lg">
                    ✅ Attendance Marked! Redirecting...
                </p>
            )}
        </div>
    );
}
