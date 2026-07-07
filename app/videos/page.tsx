import CardPlayer from "@/components/CardPlayer/CardPlayer";
import { IAsset } from "@/types/video";

export function generateMetadata() {
  return {
    title: "Videos",
  };
}

export default async function VideosPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/videos`, {
    cache: "no-store",
  });
  const videos: IAsset[] = await res.json();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-2">Videos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {videos.map((video, index) => (
          <CardPlayer
            key={video.id}
            playbackId={video.playback_ids[0]?.id || ""}
            title={video.meta?.title || ""}
            order={index}
            duration={video.duration}
            assetId={video.id}
          />
        ))}
      </div>
    </div>
  );
}
