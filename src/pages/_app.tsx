import type { AppProps } from "next/app";
import "@/styles/globals.css";
import { AudioQueueProvider } from "@/context/AudioQueueContext";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AudioQueueProvider>
      <Component {...pageProps} />
    </AudioQueueProvider>
  );
}
