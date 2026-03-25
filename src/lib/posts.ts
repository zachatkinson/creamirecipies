import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, Post } from './types';

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
