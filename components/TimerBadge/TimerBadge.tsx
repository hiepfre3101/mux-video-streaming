"use client";
import { formatDuration } from "@/utils";
import { useMemo } from "react";

type Props = {
  duration: number;
  currentTime?: number;
  isStatic?: boolean;
};

const TimerBadge = ({ duration, currentTime, isStatic = false }: Props) => {
  const getCurrentTime = useMemo(() => {
    if (isStatic || !currentTime || currentTime === duration)
      return formatDuration(duration);
    return formatDuration(duration - currentTime);
  }, [duration, currentTime, isStatic]);

  return (
    <span className="rounded-md bg-black/75 px-1.5 py-0.5 text-xs font-medium text-white">
      {getCurrentTime}
    </span>
  );
};

export default TimerBadge;
