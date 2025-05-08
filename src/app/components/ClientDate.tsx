"use client";

import { useEffect, useState } from "react";

export default function ClientDate({ createdAt }: { createdAt: string }) {
  const [date, setDate] = useState("");

  useEffect(() => {
    setDate(new Date(createdAt).toLocaleString());
  }, [createdAt]);

  return <p className="text-xs text-gray-900 mb-4">Created at: {date}</p>;
}
