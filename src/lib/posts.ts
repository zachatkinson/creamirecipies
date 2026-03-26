import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, Post } from './types';
import type { Locale } from '../i18n';

type Client = SupabaseClient<Database>;

export interface PostWithAuthor extends Post {
  author: { username: string; display_name: string | null; avatar_url: string | null };
}

export async function getPublishedPosts(client: Client): Promise<PostWithAuthor[]> {
  const { data, error } = await client
    .from('posts')
    .select(`
      *,
      author:profiles!author_id (username, display_name, avatar_url)
    `)
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) {
    console.warn('Failed to fetch posts:', error.message);
    return [];
  }
  return (data ?? []) as unknown as PostWithAuthor[];
}

export async function getPostBySlug(client: Client, slug: string): Promise<PostWithAuthor | null> {
  const { data, error } = await client
    .from('posts')
    .select(`
      *,
      author:profiles!author_id (username, display_name, avatar_url)
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error || !data) return null;
  return data as unknown as PostWithAuthor;
}

/** Apply translations to a list of posts */
export async function applyPostTranslations(
  client: Client,
  posts: PostWithAuthor[],
  locale: Locale,
): Promise<void> {
  if (locale === 'en' || posts.length === 0) return;

  const postIds = posts.map((p) => p.id);
  const { data: translations } = await client
    .from('post_translations')
    .select('post_id, title, excerpt, body')
    .eq('locale', locale)
    .in('post_id', postIds) as { data: { post_id: string; title: string; excerpt: string | null; body: string }[] | null };

  if (!translations) return;

  const transMap = new Map(translations.map((t) => [t.post_id, t]));
  for (const post of posts) {
    const tr = transMap.get(post.id);
    if (tr) {
      (post as Record<string, unknown>).title = tr.title;
      if (tr.excerpt) (post as Record<string, unknown>).excerpt = tr.excerpt;
      if (tr.body) (post as Record<string, unknown>).body = tr.body;
    }
  }
}

/** Get translation for a single post */
export async function getPostTranslation(
  client: Client,
  postId: string,
  locale: Locale,
): Promise<{ title: string; excerpt: string | null; body: string } | null> {
  if (locale === 'en') return null;

  const { data } = await client
    .from('post_translations')
    .select('title, excerpt, body')
    .eq('post_id', postId)
    .eq('locale', locale)
    .single() as { data: { title: string; excerpt: string | null; body: string } | null };

  return data;
}

export async function getAllPostSlugs(client: Client): Promise<string[]> {
  const { data, error } = await client
    .from('posts')
    .select('slug')
    .eq('status', 'published');

  if (error) {
    console.warn('Failed to fetch post slugs:', error.message);
    return [];
  }
  return (data ?? []).map((p) => p.slug);
}
