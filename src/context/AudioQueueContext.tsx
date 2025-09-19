import React, { createContext, useContext, useMemo, useRef, useState, useCallback, useEffect } from "react";

export type Track = { src: string; title: string; topicSlug: string };

type Ctx = {
  queue: Track[];
  current: number;
  isPlaying: boolean;
  setQueueAndPlay: (tracks: Track[], startIndex?: number) => void;
  shuffleAndPlay: (tracks: Track[]) => void;
  play: () => void;
  pause: () => void;
  next: () => void;
  audioRef: React.RefObject<HTMLAudioElement>;
};

const AudioCtx = createContext<Ctx | null>(null);

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const AudioQueueProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [queue, setQueue] = useState<Track[]>([]);
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const setQueueAndPlay = useCallback((tracks: Track[], startIndex = 0) => {
    setQueue(tracks);
    setCurrent(Math.max(0, Math.min(startIndex, tracks.length - 1)));
    setIsPlaying(true);
  }, []);

  const shuffleAndPlay = useCallback((tracks: Track[]) => {
    const s = shuffle(tracks);
    setQueue(s);
    setCurrent(0);
    setIsPlaying(true);
  }, []);

  const play = useCallback(() => setIsPlaying(true), []);
  const pause = useCallback(() => setIsPlaying(false), []);

  const next = useCallback(() => {
    setCurrent(c => (queue.length ? (c + 1) % queue.length : 0));
    setIsPlaying(true);
  }, [queue.length]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el || !queue.length) return;
    el.src = queue[current]?.src || "";
    if (isPlaying) {
      el.play().catch(() => {});
    } else {
      el.pause();
    }
  }, [queue, current, isPlaying]);

  const onEnded = () => next();

  const value = useMemo(
    () => ({ queue, current, isPlaying, setQueueAndPlay, shuffleAndPlay, play, pause, next, audioRef }),
    [queue, current, isPlaying, setQueueAndPlay, shuffleAndPlay, play, pause, next]
  );

  return (
    <AudioCtx.Provider value={value}>
      {children}
      <audio ref={audioRef} onEnded={onEnded} hidden />
    </AudioCtx.Provider>
  );
};

export function useAudioQueue() {
  const ctx = useContext(AudioCtx);
  if (!ctx) throw new Error("useAudioQueue must be used within AudioQueueProvider");
  return ctx;
}
