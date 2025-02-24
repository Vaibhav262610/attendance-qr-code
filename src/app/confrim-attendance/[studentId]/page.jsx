"use client"; // ✅ Add this line at the top

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ConfirmAttendance({ params }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { studentId } = params;
    const timestamp = searchParams.get("t"); // ✅ Correct way to get search params in app router
    const [message, setMessage] = useState("Marking attendance...");

    useEffect(() => {
        const markAttendance = async () => {
            if (!timestamp) {
                setMessage("❌ Invalid QR Code!");
                return;
            }

            const qrGeneratedTime = new Date(parseInt(timestamp));
            const currentTime = new Date();
            const timeDifference = (currentTime - qrGeneratedTime) / 60000; // Convert to minutes

            if (timeDifference > 5) {
                setMessage("❌ QR Code Expired!");
                return;
            }

            try {
                const res = await fetch("/api/mark-attendance", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ studentId }),
                });

                const data = await res.json();
                setMessage(data.success ? "✅ Attendance Marked!" : "❌ Already Marked!");
            } catch (error) {
                setMessage("❌ Error marking attendance.");
            }
        };

        markAttendance();
    }, [studentId, timestamp]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-400 p-6">
            <h1 className="text-2xl font-bold mb-4">{message}</h1>
            <button onClick={() => router.push("/")} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md">
                Go to Home
            </button>
        </div>
    );
}
