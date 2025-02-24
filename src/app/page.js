"use client";
import useSWR from "swr";

export default function Home() {
  const { data } = useSWR("/api/get-attendance", (url) =>
    fetch(url).then((res) => res.json())
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-800 p-6">
      <h1 className="text-2xl font-bold mb-4">Attendance List</h1>
      <ul className="bg-white p-4 rounded-md shadow-md w-full max-w-md">
        {data?.map((record) => (
          <li
            key={record.studentId}
            className={`p-2 ${record.attended ? "text-green-600" : "text-red-600"
              }`}
          >
            {record.studentId} - {record.attended ? "✅ Present" : "❌ Absent"}
          </li>
        ))}
      </ul>
    </div>
  );
}
