import Link from "next/link";

export default function TagBadge({ tag }: { tag: string }) {
  return (
    <Link href={`/tags/${encodeURIComponent(tag)}`} className="text-xs inline-block px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 mr-2 mb-2">
      #{tag}
    </Link>
  );
}
