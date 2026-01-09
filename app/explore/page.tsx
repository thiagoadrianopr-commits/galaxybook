import { createClient } from "@/lib/supabase/server"
import { getCurrentProfile } from "@/lib/auth"
import { Navbar } from "@/components/navbar"
import { PostCard } from "@/components/post-card"
import type { Post } from "@/lib/types"

async function getAllPosts(userId: string | undefined): Promise<Post[]> {
  const supabase = await createClient()

  const { data: posts } = await supabase
    .from("posts")
    .select(
      `
      *,
      profile:profiles(*)
    `,
    )
    .order("created_at", { ascending: false })
    .limit(50)

  if (!posts) return []

  // Get likes and comments counts for each post
  const postsWithCounts = await Promise.all(
    posts.map(async (post) => {
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
    }),
  )

  return postsWithCounts
}

export default async function ExplorePage() {
  const profile = await getCurrentProfile()

  if (!profile) {
    return null
  }

  const posts = await getAllPosts(profile.id)

  return (
    <div className="min-h-screen bg-background">
      <Navbar profile={profile} />
      <main className="container mx-auto max-w-2xl px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-foreground">Explorar</h1>

        <div className="space-y-8">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} currentUserId={profile.id} />
          ))}
        </div>
      </main>
    </div>
  )
}
