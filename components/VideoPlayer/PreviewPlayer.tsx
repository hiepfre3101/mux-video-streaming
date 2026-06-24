"use client";

import { useHls } from "@/hooks/useHls";
import { ProgressBar } from "../ProgressBar/ProgressBar";
import { LoadingIcon } from "../Loading/Loading";
import TimerBadge from "../TimerBadge/TimerBadge";

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
  const {
    videoRef,
    buffered,
    currentTime,
    duration,
    seekTo,
    isLoading,
    isMuted,
    toggleMute,
  } = useHls(playbackId, { startTime, onTimeUpdate, startMuted: true });
  const thumbnailUrl = `https://image.mux.com/${playbackId}/thumbnail.jpg?width=640&height=360&fit_mode=smartcrop&time=1`;
  return (
    <div className="w-full h-full absolute">
      <video
        ref={videoRef}
        muted={isMuted}
        autoPlay
        playsInline
        poster={thumbnailUrl}
        className="aspect-video w-full rounded-xl bg-black object-cover"
      />
      {isLoading && (
        <div className="absolute w-full h-full bg-black/20 top-0 left-0 z-10 flex justify-center items-center">
          <LoadingIcon />
        </div>
      )}
      <div
        className="absolute top-2 right-3"
        onClick={(e) => {
          e.stopPropagation(); // don't let it bubble into onMouseLeave-style parent handlers
          toggleMute();
        }}
      >
        {isMuted ? <SpeakerMuted /> : <SpeakerUnmuted />}
      </div>
      <div className="absolute -bottom-2.5 left-0 z-10 mb-2 h-7.5 flex items-end w-full hover:items-center hover:left-3 hover:w-[90%]">
        <ProgressBar
          buffered={buffered}
          currentTime={currentTime}
          duration={duration}
          seekTo={seekTo}
        />
      </div>
      {/* Duration badge */}
      {duration ? (
        <div className="absolute bottom-2 right-2 ">
          <TimerBadge duration={duration} currentTime={currentTime} />
        </div>
      ) : null}
    </div>
  );
};

const SpeakerMuted = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="size-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6 4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"
    />
  </svg>
);

const SpeakerUnmuted = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="size-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"
    />
  </svg>
);
