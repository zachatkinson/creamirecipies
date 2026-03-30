import { logQueryError } from './blog';
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
    logQueryError('fetchPosts', error.message);
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

/** Get prev/next posts for article navigation */
export async function getPostNavigation(
  client: Client,
  publishedAt: string,
): Promise<{ prevPost: { title: string; slug: string } | null; nextPost: { title: string; slug: string } | null }> {
  const now = new Date().toISOString();

  const [prev, next] = await Promise.all([
    client
      .from('posts')
      .select('title, slug')
      .eq('status', 'published')
      .lte('published_at', now)
      .lt('published_at', publishedAt)
      .order('published_at', { ascending: false })
      .limit(1)
      .single(),
    client
      .from('posts')
      .select('title, slug')
      .eq('status', 'published')
      .lte('published_at', now)
      .gt('published_at', publishedAt)
      .order('published_at', { ascending: true })
      .limit(1)
      .single(),
  ]);

  return {
    prevPost: prev.data as { title: string; slug: string } | null,
    nextPost: next.data as { title: string; slug: string } | null,
  };
}

/** Get related posts by category */
export async function getRelatedPosts(
  client: Client,
  category: string,
  excludeId: string,
  limit: number = 3,
): Promise<Record<string, unknown>[]> {
  const { data } = await client
    .from('posts')
    .select('title, slug, excerpt, category, hero_image_url, published_at, created_at')
    .eq('status', 'published')
    .eq('category', category)
    .neq('id', excludeId)
    .lte('published_at', new Date().toISOString())
    .order('published_at', { ascending: false })
    .limit(limit);

  return (data ?? []) as Record<string, unknown>[];
}

export async function getAllPostSlugs(client: Client): Promise<string[]> {
  const { data, error } = await client
    .from('posts')
    .select('slug')
    .eq('status', 'published');

  if (error) {
    logQueryError('fetchPostSlugs', error.message);
    return [];
  }
  return (data ?? []).map((p) => p.slug);
}
