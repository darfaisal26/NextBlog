"use client";

import { useEffect, useState } from "react";
import { Calendar, Clock } from "lucide-react";

export default function ClientDate({ createdAt }: { createdAt: string }) {
  const [date, setDate] = useState("");
  const [timeAgo, setTimeAgo] = useState("");

  useEffect(() => {
    const createdDate = new Date(createdAt);
    setDate(
      createdDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    );

    // Calculate time ago
    const now = new Date();
    const diffInMs = now.getTime() - createdDate.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

    if (diffInDays > 0) {
      setTimeAgo(`${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`);
    } else if (diffInHours > 0) {
      setTimeAgo(`${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`);
    } else if (diffInMinutes > 0) {
      setTimeAgo(`${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`);
    } else {
      setTimeAgo("Just now");
    }
  }, [createdAt]);

  return (
    <div className="flex items-center gap-2 text-xs text-white/70 group transition-all duration-300 hover:text-white/90">
      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 transition-all duration-300 group-hover:bg-white/10 group-hover:border-white/20">
        <Calendar className="w-3 h-3 text-purple-300" />
        <span className="font-medium">{date}</span>
      </div>

      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 transition-all duration-300 group-hover:bg-white/10 group-hover:border-white/20">
        <Clock className="w-3 h-3 text-blue-300" />
        <span className="font-medium">{timeAgo}</span>
      </div>
    </div>
  );
}