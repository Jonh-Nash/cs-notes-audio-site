import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

const CONTENT_DIR = path.join(process.cwd(), "content");

export function getAllSlugs(): string[] {
  return fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith(".md")).map(f => f.replace(/\.md$/, ""));
}

export function getTopicBySlug(slug: string) {
  const file = path.join(CONTENT_DIR, `${slug}.md`);
  const raw = fs.readFileSync(file, "utf-8");
  const { data, content } = matter(raw);
  return { data, content };
}

export async function markdownToHtml(md: string): Promise<string> {
  const file = await unified().use(remarkParse).use(remarkRehype).use(rehypeStringify).process(md);
  return String(file);
}
