export type Track = {
  type: "video" | "audio" | "text";
  max_width?: number;
  max_height?: number;
  max_frame_rate?: number;
  id: string;
  duration: number;
  name?: string;
  max_channels?: number;
  language_code?: string;
};

export interface IAsset {
  video_quality: string;
  tracks: Track[];
  status: string;
  resolution_tier: string;
  progress: {
    state: string;
    progress: number;
  };
  playback_ids: {
    policy: string;
    id: string;
  }[];
  mp4_support: string;
  meta: { title: string; description: string };
  id: string;
  duration: number;
  created_at: string;
  aspect_ratio: string;
}
