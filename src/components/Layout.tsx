import Head from "next/head";
import Link from "next/link";
import { ReactNode } from "react";
import GlobalAudioPlayer from "./GlobalAudioPlayer";

export default function Layout({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  const site = "CS Notes";
  const pageTitle = title ? `${title} | ${site}` : site;
  return (
    <div className="min-h-screen pb-16">
      <Head>
        <title>{pageTitle}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex, nofollow, noarchive" />
      </Head>
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="mx-auto max-w-4xl px-3 py-3 flex items-center justify-between">
          <Link href="/" className="font-semibold">
            CS Notes
          </Link>
          <nav className="text-sm flex gap-4">
            <Link href="/">検索</Link>
            <Link href="/categories">カテゴリ</Link>
            <Link href="/keywords">索引</Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-3 py-6">{children}</main>
      <GlobalAudioPlayer />
    </div>
  );
}
