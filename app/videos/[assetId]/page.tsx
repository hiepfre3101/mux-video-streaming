import VideoPlayer from "@/components/VideoPlayer/VideoPlayer";
import { IAsset } from "@/types/video";
import { Metadata } from "next";

type Props = {
  params: Promise<{
    assetId: string;
  }>;
};

async function getAsset(assetId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/videos/${assetId}`,
    {
      next: { revalidate: 60 },
    },
  );

  return res.json();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { assetId } = await params;
  const asset: IAsset = await getAsset(assetId);

  return {
    title: asset?.meta?.title,
    openGraph: {
      title: asset?.meta?.title,
    },
  };
}

export default async function WatchingPage({ params }: Props) {
  const { assetId } = await params;
  const asset: IAsset = await getAsset(assetId);
  return (
    <>
      <VideoPlayer
        playbackId={asset.playback_ids[0]?.id}
        title={asset?.meta?.title}
        description={asset?.meta?.description}
      />
    </>
  );
}
