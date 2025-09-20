import { GetStaticPaths, GetStaticProps } from "next";
import Layout from "@/components/Layout";
import CategoryBadge from "@/components/CategoryBadge";
import { getAllSlugs, getTopicBySlug, markdownToHtml } from "@/lib/md";
import { useRouter } from "next/router";
import { useAudioQueue, Track } from "@/context/AudioQueueContext";
import { withBase } from "@/lib/utils";

export default function TopicPage({
  slug,
  html,
  meta,
}: {
  slug: string;
  html: string;
  meta: any;
}) {
  const router = useRouter();
  const { shuffleAndPlay } = useAudioQueue();

  const playTopic = () => {
    const base = (router as any).basePath || "";
    const tracks: Track[] = (meta.audio || []).map((src: string) => ({
      src: withBase(base, src),
      title: meta.title,
      topicSlug: slug,
    }));
    if (tracks.length) shuffleAndPlay(tracks);
  };

  return (
    <Layout title={meta.title}>
      <h1 className="text-2xl font-semibold mb-2">{meta.title}</h1>
      <div className="mb-4">
        {(meta.categories || []).map((t: string) => (
          <CategoryBadge key={t} category={t} />
        ))}
      </div>

      <div className="mb-6 flex items-center gap-2">
        <button onClick={playTopic} className="border rounded px-3 py-2">
          🎲 このトピックをランダム再生
        </button>
      </div>

      <div className="space-y-4 mb-8">
        {(meta.audio || []).map((src: string, i: number) => (
          <div key={i} className="border rounded p-3">
            <div className="text-sm mb-2 opacity-70">音声 {i + 1}</div>
            <audio
              controls
              preload="none"
              src={withBase((router as any).basePath || "", src)}
              className="w-full"
            />
          </div>
        ))}
      </div>

      <article
        className="prose dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = getAllSlugs();
  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = String(params?.slug);
  const { data, content } = getTopicBySlug(slug);
  const html = await markdownToHtml(content);
  return { props: { slug, html, meta: data } };
};
