import { useRouter } from "next/router";
import { useAudioQueue, Track } from "@/context/AudioQueueContext";
import { withBase } from "@/lib/utils";

type TopicMeta = { slug: string; title: string; tags: string[]; keywords: string[]; audio: string[] };

export default function RandomPlayButton({ topics, tag }: { topics: TopicMeta[]; tag?: string }) {
  const { shuffleAndPlay } = useAudioQueue();
  const router = useRouter();

  const onClick = () => {
    const filtered = tag ? topics.filter(t => t.tags.includes(tag)) : topics;
    const base = (router as any).basePath || "";
    const tracks: Track[] = filtered.flatMap(t => t.audio.map(src => ({
      src: withBase(base, src),
      title: t.title,
      topicSlug: t.slug,
    })));
    if (tracks.length) shuffleAndPlay(tracks);
  };

  return (
    <button onClick={onClick} className="inline-flex items-center gap-2 border rounded px-3 py-2">
      <span>🎲 ランダム再生</span>
      {tag ? <span className="text-xs opacity-70">#{tag}</span> : null}
    </button>
  );
}
