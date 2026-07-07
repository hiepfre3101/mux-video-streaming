"use client";

import { useDebounce } from "@/hooks/useDebounce";
import Image from "next/image";
import { MouseEventHandler, useMemo, useRef, useState } from "react";
import { PreviewPlayer } from "../VideoPlayer/PreviewPlayer";
import TimerBadge from "../TimerBadge/TimerBadge";
import { useRouter } from "next/navigation";

type Props = {
  playbackId: string;
  title?: string;
  duration?: number; // in seconds
  order: number;
  assetId: string;
};

const CardPlayer = ({ playbackId, title, duration, order, assetId }: Props) => {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  // Lives on the PARENT, which never unmounts on hover in/out —
  // so this value survives even though HoverPreview (and its useHls
  // instance) gets destroyed every time the mouse leaves.
  const lastTimeRef = useRef(0);

  const { debouncedFunction: delayHover, timeoutIdRef } = useDebounce(
    () => setIsHovered(true),
    1000,
  );

  const watchedDuration = useMemo(() => {
    if (!duration || !lastTimeRef.current) return 0;
    return (lastTimeRef.current / duration) * 100;
  }, [lastTimeRef.current, duration]);

  const handleClickCard = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    router.push(`/videos/${assetId}`);
  };

  const thumbnailUrl = `https://image.mux.com/${playbackId}/thumbnail.jpg?width=640&height=360&fit_mode=smartcrop&time=5`;
  return (
    <button
      onClick={handleClickCard}
      onMouseOver={delayHover}
      onMouseLeave={() => {
        clearTimeout(timeoutIdRef.current);
        setIsHovered(false);
      }}
      className="group block w-full text-left focus:outline-none cursor-pointer"
    >
      <div className="relative aspect-video overflow-hidden rounded-xl bg-neutral-900 ring-1 ring-white/10 transition-all duration-300 group-hover:ring-white/20 group-focus-visible:ring-2 group-focus-visible:ring-blue-500">
        {isHovered ? (
          <>
            <PreviewPlayer
              playbackId={playbackId}
              title={title}
              startTime={lastTimeRef.current}
              onTimeUpdate={(t) => {
                lastTimeRef.current = t;
              }}
            />
          </>
        ) : (
          <div className="absolute inset-0">
            {/* Thumbnail */}
            <Image
              src={thumbnailUrl}
              alt={title || "Video thumbnail"}
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              loading={order < 4 ? "eager" : "lazy"}
              width={640}
              height={360}
              priority={order < 4}
              fetchPriority={order === 0 ? "high" : "auto"}
            />

            {/* Darken on hover for legibility */}
            <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />

            {/* Play button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100 group-hover:scale-110 scale-90">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6 fill-black text-black"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
                  />
                </svg>
              </div>
            </div>

            {/* Duration badge */}
            {duration ? (
              <div className="absolute bottom-2 right-2">
                <TimerBadge duration={duration} isStatic />
              </div>
            ) : null}

            <div
              className="absolute bottom-0 left-0 bg-red-500 h-1"
              style={{
                width: `${watchedDuration}%`,
              }}
            ></div>
          </div>
        )}
      </div>

      {/* Title */}
      <h3 className="mt-2 line-clamp-2 text-sm font-medium text-neutral-100 rounded-r-lg">
        {title}
      </h3>
    </button>
  );
};

export default CardPlayer;
