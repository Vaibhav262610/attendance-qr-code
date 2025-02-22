"use client";
import useSWR from "swr";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data } = useSWR("/api/get-attendance", (url) =>
    fetch(url).then((res) => res.json())
  );

  const router = useRouter();

  const handleGenerateClick = () => {
    router.push("/generate");
  };

  const handleScanClick = () => {
    router.push("/scan");
  };

  return (
    <div className="min-h-screen flex flex-col text-black items-center justify-center bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Attendance List</h1>
      <ul className="bg-white p-4 rounded-md shadow-md w-full max-w-md">
        {data?.map((record) => (
          <li
            key={record.studentId}
            className={`p-2 ${record.attended ? "text-green-600" : "text-red-600"}`}
          >
            {record.studentId} - {record.attended ? "✅ Present" : "❌ Absent"}
          </li>
        ))}
      </ul>
      <div className="mt-6">
        <button
          onClick={handleGenerateClick}
          className="bg-blue-500 text-white px-4 py-2 rounded-md mr-4"
        >
          Generate
        </button>
        <button
          onClick={handleScanClick}
          className="bg-green-500 text-white px-4 py-2 rounded-md"
        >
          Scan
        </button>
      </div>
    </div>
  );
}
