import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getCurrentProfile } from "@/lib/auth"
import { Navbar } from "@/components/navbar"
import { PostDetail } from "@/components/post-detail"
import type { Post } from "@/lib/types"

interface PostPageProps {
  params: Promise<{
    id: string
  }>
}

async function getPost(postId: string, userId: string | undefined): Promise<Post | null> {
  const supabase = await createClient()

  const { data: post } = await supabase
    .from("posts")
    .select(
      `
      *,
      profile:profiles(*)
    `,
    )
    .eq("id", postId)
    .single()

  if (!post) return null

  // Get likes and comments counts
  const [{ count: likesCount }, { count: commentsCount }, { data: isLiked }] = await Promise.all([
    supabase.from("likes").select("*", { count: "exact", head: true }).eq("post_id", post.id),
    supabase.from("comments").select("*", { count: "exact", head: true }).eq("post_id", post.id),
    userId
      ? supabase.from("likes").select("id").eq("post_id", post.id).eq("user_id", userId).single()
      : Promise.resolve({ data: null }),
  ])

  return {
    ...post,
    likes_count: likesCount || 0,
    comments_count: commentsCount || 0,
    is_liked: !!isLiked,
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { id } = await params
  const profile = await getCurrentProfile()

  if (!profile) {
    return null
  }

  const post = await getPost(id, profile.id)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar profile={profile} />
      <main className="container mx-auto max-w-5xl px-4 py-8">
        <PostDetail post={post} currentUserId={profile.id} />
      </main>
    </div>
  )
}
