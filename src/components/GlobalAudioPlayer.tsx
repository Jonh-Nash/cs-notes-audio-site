import Link from "next/link";
import { useAudioQueue } from "@/context/AudioQueueContext";

export default function GlobalAudioPlayer() {
  const { queue, current, isPlaying, play, pause, next } = useAudioQueue();
  const now = queue[current];
  return (
    <div className="fixed bottom-0 inset-x-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur border-t border-gray-200 dark:border-gray-800 z-50">
      <div className="mx-auto max-w-4xl px-3 py-2 flex items-center gap-3">
        <button
          className="rounded px-3 py-1 border text-sm"
          onClick={() => (isPlaying ? pause() : play())}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? "⏸ 一時停止" : "▶ 再生"}
        </button>
        <button className="rounded px-3 py-1 border text-sm" onClick={next} aria-label="Next">
          次へ ⏭
        </button>
        <div className="flex-1 text-sm truncate">
          {now ? (
            <>
              <span className="opacity-60 mr-1">再生中:</span>
              <Link className="underline" href={`/topics/${now.topicSlug}`}>{now.title}</Link>
            </>
          ) : (
            <span className="opacity-60">キューなし</span>
          )}
        </div>
        <Link className="text-sm underline" href="/keywords">索引</Link>
      </div>
    </div>
  );
}
