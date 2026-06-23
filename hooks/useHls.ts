import { RefObject, useEffect, useRef, useState } from "react";
import Hls from "hls.js";

interface UseHlsReturn {
  videoRef: RefObject<HTMLVideoElement | null>;
  currentTime: number;
  duration: number;
  buffered: number;
  isPlaying: boolean;
  levels: { height: number; bitrate: number }[];
  currentLevel: number; // -1 means "auto"
  setLevel: (index: number) => void;
  togglePlay: () => void;
  seekTo: (time: number) => void;
  isLoading: boolean;
}

interface UseHlsOptions {
  startTime?: number; // resume playback from this position (seconds)
  onTimeUpdate?: (time: number) => void; // fires on every timeupdate, for callers tracking position externally
}

export function useHls(
  playbackId: string,
  options?: UseHlsOptions,
): UseHlsReturn {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [levels, setLevels] = useState<{ height: number; bitrate: number }[]>(
    [],
  );
  const [currentLevel, setCurrentLevel] = useState(-1);

  const streamUrl = `https://stream.mux.com/${playbackId}.m3u8`;
  const startTime = options?.startTime ?? 0;

  // Keep the latest onTimeUpdate in a ref so it doesn't force the
  // attach/cleanup effect below to re-run on every parent re-render
  // (an inline arrow function prop is a new reference every render).
  const onTimeUpdateRef = useRef(options?.onTimeUpdate);
  useEffect(() => {
    onTimeUpdateRef.current = options?.onTimeUpdate;
  }, [options?.onTimeUpdate]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
      hlsRef.current = hls;

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setLevels(
          hls.levels.map((l) => ({ height: l.height, bitrate: l.bitrate })),
        );
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
        setCurrentLevel(data.level);
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) console.error("Fatal HLS error:", data);
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = streamUrl; // Safari native HLS
    }
    // Resume from the last known position, once the video knows its duration
    if (startTime > 0) {
      video.addEventListener(
        "loadedmetadata",
        () => {
          video.currentTime = startTime;
        },
        { once: true },
      );
    }
    return () => {
      hlsRef.current?.destroy();
      hlsRef.current = null;
    };
  }, [streamUrl]);

  // Track playback state from the native <video> element
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => {
      if (onTimeUpdateRef.current) {
        onTimeUpdateRef.current(video.currentTime);
      }
      setCurrentTime(video.currentTime);
    };
    const onDurationChange = () => setDuration(video.duration || 0);
    const onProgress = () => {
      if (video.buffered.length > 0) {
        setBuffered(video.buffered.end(video.buffered.length - 1));
      }
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("durationchange", onDurationChange);
    video.addEventListener("progress", onProgress);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("canplay", () => {
      setIsLoading(false);
    });
    video.addEventListener("waiting", () => {
      setIsLoading(true);
    });

    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("durationchange", onDurationChange);
      video.removeEventListener("progress", onProgress);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    video.paused ? video.play() : video.pause();
  };

  const seekTo = (time: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = time;
  };

  const setLevel = (index: number) => {
    if (hlsRef.current) hlsRef.current.currentLevel = index; // -1 = auto
  };

  return {
    videoRef,
    currentTime,
    duration,
    buffered,
    isPlaying,
    levels,
    currentLevel,
    setLevel,
    togglePlay,
    seekTo,
    isLoading,
  };
}
