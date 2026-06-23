"use client";

import { useState } from "react";

type Props = {
  currentTime: number;
  duration: number;
  buffered: number;
  seekTo: (time: number) => void;
};

export const ProgressBar = ({
  currentTime,
  duration,
  buffered,
  seekTo,
}: Props) => {
  const [isHover, setIsHover] = useState(false);
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    seekTo(ratio * duration);
  };
  const playedPct = duration ? (currentTime / duration) * 100 : 0;
  const bufferedPct = duration ? (buffered / duration) * 100 : 0;
  return (
    <div
      onClick={handleSeek}
      onMouseOver={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      className="group relative h-1.5 flex-1 cursor-pointer rounded-full bg-white/20"
    >
      <div
        className="absolute h-full rounded-full bg-white/40"
        style={{ width: `${bufferedPct}%` }}
      />
      <div
        className="absolute h-full rounded-full bg-red-500"
        style={{ width: `${playedPct}%` }}
      />
      {isHover && (
        <div
          className="absolute top-1/2 h-3 w-3 -translate-y-1/2 -translate-x-1/2 rounded-full bg-red-500 opacity-0 transition-opacity group-hover:opacity-100"
          style={{ left: `${playedPct}%` }}
        />
      )}
    </div>
  );
};
