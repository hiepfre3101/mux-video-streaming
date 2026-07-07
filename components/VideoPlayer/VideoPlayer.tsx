import { useTransition } from "react";

type Props = {
  playbackId: string;
  title: string;
  description?: string;
  createdDate?: string;
};

const VideoPlayer = ({
  playbackId,
  title,
  description,
  createdDate,
}: Props) => {
  const [isPending, startTransition] = useTransition()
  return <div>VideoPlayer</div>;
};

export default VideoPlayer;
