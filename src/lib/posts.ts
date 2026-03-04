import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export type FilePost = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  tags: string;
  imageUrl?: string;
  contentMode?: 'rich' | 'raw-html';
};

const postsDirectory = path.join(process.cwd(), 'posts');
const supportedPostExtensions = ['.md', '.html', '.htm'];
const firebaseProjectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'portfolio-64e4a';

const escapeHtml = (input: string) =>
  input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const markdownToHtml = (markdown: string) => {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const htmlParts: string[] = [];
  let inList = false;

  for (const line of lines) {
    if (!line.trim()) {
      if (inList) {
        htmlParts.push('</ul>');
        inList = false;
      }
      continue;
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      if (inList) {
        htmlParts.push('</ul>');
        inList = false;
      }
      const level = headingMatch[1].length;
      const text = escapeHtml(headingMatch[2]);
      htmlParts.push(`<h${level}>${text}</h${level}>`);
      continue;
    }

    const listMatch = line.match(/^[-*]\s+(.*)$/);
    if (listMatch) {
      if (!inList) {
        htmlParts.push('<ul>');
        inList = true;
      }
      htmlParts.push(`<li>${escapeHtml(listMatch[1])}</li>`);
      continue;
    }

    if (inList) {
      htmlParts.push('</ul>');
      inList = false;
    }

    htmlParts.push(`<p>${escapeHtml(line)}</p>`);
  }

  if (inList) htmlParts.push('</ul>');
  return htmlParts.join('\n');
};

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const normalizeDate = (date: unknown) => {
  if (!date || typeof date !== 'string') return new Date().toISOString();
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
};

const extractExcerpt = (markdown: string) => {
  const normalized = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_`>#-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return normalized.slice(0, 180);
};

const extractExcerptFromHtml = (html: string) => {
  const plainText = html
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return plainText.slice(0, 180);
};

const extractFirstImage = (markdown: string) => {
  const match = markdown.match(/!\[[^\]]*\]\(([^)\s]+)[^)]*\)/);
  return match?.[1] || undefined;
};

const extractFirstImageFromHtml = (html: string) => {
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match?.[1] || undefined;
};

const inferTitleFromHtml = (html: string) => {
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (!h1Match?.[1]) return '';
  return h1Match[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
};

export const getAllFilePosts = (): FilePost[] => {
  if (!fs.existsSync(postsDirectory)) return [];

  const files = fs
    .readdirSync(postsDirectory)
    .filter((file) => supportedPostExtensions.some((ext) => file.toLowerCase().endsWith(ext)));

  const posts = files.map((fileName) => {
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    const extension = path.extname(fileName).toLowerCase();
    const fileStem = fileName.replace(/\.(md|html|htm)$/i, '');
    const isHtmlFile = extension === '.html' || extension === '.htm';

    const id = typeof data.slug === 'string' ? toSlug(data.slug) : toSlug(fileStem);
    const title = typeof data.title === 'string'
      ? data.title
      : isHtmlFile
        ? inferTitleFromHtml(content) || fileStem
        : fileStem;
    const date = normalizeDate(data.date);
    const tags = Array.isArray(data.tags)
      ? data.tags.join(', ')
      : typeof data.tags === 'string'
        ? data.tags
        : '';
    const contentMode = isHtmlFile
      ? 'raw-html'
      : typeof data.contentMode === 'string' && data.contentMode === 'raw-html'
        ? 'raw-html'
        : 'rich';
    const excerpt = typeof data.excerpt === 'string'
      ? data.excerpt
      : contentMode === 'raw-html'
        ? extractExcerptFromHtml(content)
        : extractExcerpt(content);
    const imageUrl = typeof data.imageUrl === 'string'
      ? data.imageUrl
      : contentMode === 'raw-html'
        ? extractFirstImageFromHtml(content)
        : extractFirstImage(content);
    const htmlContent = contentMode === 'raw-html' ? content : markdownToHtml(content);

    return {
      id,
      title,
      excerpt,
      content: htmlContent,
      imageUrl,
      date,
      tags,
      contentMode,
    } as FilePost;
  });

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const getFilePostById = (id: string): FilePost | null => {
  const posts = getAllFilePosts();
  return posts.find((post) => post.id === id) || null;
};

type FirestoreValue = {
  stringValue?: string;
  integerValue?: string;
  doubleValue?: number;
  booleanValue?: boolean;
  nullValue?: null;
  timestampValue?: string;
  mapValue?: { fields?: Record<string, FirestoreValue> };
  arrayValue?: { values?: FirestoreValue[] };
};

type FirestoreDocument = {
  name?: string;
  fields?: Record<string, FirestoreValue>;
};

const toPlainValue = (value?: FirestoreValue): unknown => {
  if (!value) return undefined;
  if (typeof value.stringValue === 'string') return value.stringValue;
  if (typeof value.timestampValue === 'string') return value.timestampValue;
  if (typeof value.integerValue === 'string') return Number(value.integerValue);
  if (typeof value.doubleValue === 'number') return value.doubleValue;
  if (typeof value.booleanValue === 'boolean') return value.booleanValue;
  if (value.nullValue === null) return null;

  if (value.arrayValue?.values) {
    return value.arrayValue.values.map((entry) => toPlainValue(entry));
  }

  if (value.mapValue?.fields) {
    return Object.fromEntries(
      Object.entries(value.mapValue.fields).map(([key, entry]) => [key, toPlainValue(entry)])
    );
  }

  return undefined;
};

const toRecord = (document?: FirestoreDocument): Record<string, unknown> => {
  if (!document?.fields) return {};

  return Object.fromEntries(
    Object.entries(document.fields).map(([key, value]) => [key, toPlainValue(value)])
  );
};

const inferIdFromDocName = (name?: string) => {
  if (!name) return '';
  const id = name.split('/').pop() || '';
  return toSlug(id);
};

const mapFirestoreDocToPost = (document: FirestoreDocument): FilePost | null => {
  const payload = toRecord(document);
  const idSource = typeof payload.slug === 'string' ? payload.slug : inferIdFromDocName(document.name);
  const content = typeof payload.content === 'string' ? payload.content : '';

  if (!idSource || !content) return null;

  const contentMode = typeof payload.contentMode === 'string' && payload.contentMode === 'raw-html'
    ? 'raw-html'
    : /data-content-mode=['"]raw-html['"]/i.test(content)
      ? 'raw-html'
      : 'rich';

  const title = typeof payload.title === 'string' && payload.title.trim()
    ? payload.title
    : idSource;
  const tags = Array.isArray(payload.tags)
    ? payload.tags.filter((entry): entry is string => typeof entry === 'string').join(', ')
    : typeof payload.tags === 'string'
      ? payload.tags
      : '';
  const excerpt = typeof payload.excerpt === 'string' && payload.excerpt.trim()
    ? payload.excerpt
    : contentMode === 'raw-html'
      ? extractExcerptFromHtml(content)
      : extractExcerpt(content);
  const imageUrl = typeof payload.imageUrl === 'string' && payload.imageUrl.trim()
    ? payload.imageUrl
    : contentMode === 'raw-html'
      ? extractFirstImageFromHtml(content)
      : extractFirstImage(content);

  return {
    id: toSlug(idSource),
    title,
    excerpt,
    content: contentMode === 'raw-html' ? content : markdownToHtml(content),
    date: normalizeDate(payload.date),
    tags,
    imageUrl,
    contentMode,
  };
};

const fetchFirestorePosts = async (): Promise<FilePost[]> => {
  if (!firebaseProjectId) return [];

  const endpoint = `https://firestore.googleapis.com/v1/projects/${firebaseProjectId}/databases/(default)/documents/blogs?pageSize=100`;

  try {
    const response = await fetch(endpoint, {
      cache: 'no-store',
    });

    if (!response.ok) return [];

    const payload = (await response.json()) as { documents?: FirestoreDocument[] };
    return (payload.documents || [])
      .map(mapFirestoreDocToPost)
      .filter((post): post is FilePost => Boolean(post));
  } catch {
    return [];
  }
};

const sortPosts = (posts: FilePost[]) =>
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export const getAllPosts = async (): Promise<FilePost[]> => {
  const filePosts = getAllFilePosts();
  const firestorePosts = await fetchFirestorePosts();
  const merged = new Map<string, FilePost>();

  for (const post of filePosts) {
    merged.set(post.id, post);
  }

  for (const post of firestorePosts) {
    merged.set(post.id, post);
  }

  return sortPosts(Array.from(merged.values()));
};

export const getPostById = async (id: string): Promise<FilePost | null> => {
  const normalizedId = toSlug(id);
  const posts = await getAllPosts();
  return posts.find((post) => post.id === normalizedId) || null;
};
