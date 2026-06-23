"use client";

import { useHls } from "@/hooks/useHls";
import { ProgressBar } from "../ProgressBar/ProgressBar";
import { LoadingIcon } from "../Loading/Loading";

type Props = {
  playbackId: string;
  title?: string;
  startTime: number;
  onTimeUpdate: (time: number) => void;
};

export const PreviewPlayer = ({
  playbackId,
  startTime,
  onTimeUpdate,
}: Props) => {
  const { videoRef, buffered, currentTime, duration, seekTo, isLoading } =
    useHls(playbackId, { startTime, onTimeUpdate });
  return (
    <div className="w-full h-full absolute">
      <video
        ref={videoRef}
        muted
        autoPlay
        playsInline
        className="aspect-video w-full rounded-xl bg-black object-cover"
      />
      {isLoading && (
        <div className="absolute w-full h-full bg-black/20 top-0 left-0 z-10 flex justify-center items-center">
          <LoadingIcon />
        </div>
      )}
      <div className="absolute -bottom-2.5 left-0 z-10 mb-2 w-full">
        <ProgressBar
          buffered={buffered}
          currentTime={currentTime}
          duration={duration}
          seekTo={seekTo}
        />
      </div>
    </div>
  );
};
