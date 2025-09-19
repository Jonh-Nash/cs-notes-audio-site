import Link from "next/link";

export default function StickyIndexLink() {
  return (
    <Link href="/keywords" className="fixed right-3 bottom-20 md:bottom-24 z-40 inline-flex items-center gap-2 px-3 py-2 rounded-full border bg-white/90 dark:bg-gray-900/90 backdrop-blur">
      📚 索引
    </Link>
  );
}
