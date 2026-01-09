import { createClient } from "@/lib/supabase/server"
import { getCurrentProfile } from "@/lib/auth"
import { Navbar } from "@/components/navbar"
import { PostCard } from "@/components/post-card"
import { ImageIcon } from "lucide-react"
import type { Post } from "@/lib/types"

async function getFeedPosts(userId: string): Promise<Post[]> {
  const supabase = await createClient()

  // Get users that current user follows
  const { data: following } = await supabase.from("follows").select("following_id").eq("follower_id", userId)

  const followingIds = following?.map((f) => f.following_id) || []

  // Include own posts + followed users' posts
  const userIds = [userId, ...followingIds]

  if (userIds.length === 0) {
    return []
  }

  // Get posts with profile data, likes count, and comments count
  const { data: posts } = await supabase
    .from("posts")
    .select(
      `
      *,
      profile:profiles(*)
    `,
    )
    .in("user_id", userIds)
    .order("created_at", { ascending: false })
    .limit(50)

  if (!posts) return []

  // Get likes and comments counts for each post
  const postsWithCounts = await Promise.all(
    posts.map(async (post) => {
      const [{ count: likesCount }, { count: commentsCount }, { data: isLiked }] = await Promise.all([
        supabase.from("likes").select("*", { count: "exact", head: true }).eq("post_id", post.id),
        supabase.from("comments").select("*", { count: "exact", head: true }).eq("post_id", post.id),
        supabase.from("likes").select("id").eq("post_id", post.id).eq("user_id", userId).single(),
      ])

      return {
        ...post,
        likes_count: likesCount || 0,
        comments_count: commentsCount || 0,
        is_liked: !!isLiked,
      }
    }),
  )

  return postsWithCounts
}

export default async function FeedPage() {
  const profile = await getCurrentProfile()

  if (!profile) {
    return null
  }

  const posts = await getFeedPosts(profile.id)

  return (
    <div className="min-h-screen bg-background">
      <Navbar profile={profile} />
      <main className="container mx-auto max-w-2xl px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-foreground">Feed</h1>

        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <ImageIcon className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Seu feed está vazio</h3>
            <p className="text-muted-foreground max-w-md">
              Comece seguindo outras pessoas ou crie seu primeiro post para ver conteúdo aqui!
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} currentUserId={profile.id} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
