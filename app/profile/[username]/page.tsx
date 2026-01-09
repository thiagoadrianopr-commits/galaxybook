import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getCurrentProfile } from "@/lib/auth"
import { Navbar } from "@/components/navbar"
import { ProfileHeader } from "@/components/profile-header"
import { ProfileGrid } from "@/components/profile-grid"
import type { Profile, Post } from "@/lib/types"

interface ProfilePageProps {
  params: Promise<{
    username: string
  }>
}

async function getProfileByUsername(username: string): Promise<Profile | null> {
  const supabase = await createClient()

  const { data: profile } = await supabase.from("profiles").select("*").eq("username", username).single()

  return profile
}

async function getUserPosts(userId: string): Promise<Post[]> {
  const supabase = await createClient()

  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  return posts || []
}

async function getUserStats(userId: string) {
  const supabase = await createClient()

  const [{ count: postsCount }, { count: followersCount }, { count: followingCount }] = await Promise.all([
    supabase.from("posts").select("*", { count: "exact", head: true }).eq("user_id", userId),
    supabase.from("follows").select("*", { count: "exact", head: true }).eq("following_id", userId),
    supabase.from("follows").select("*", { count: "exact", head: true }).eq("follower_id", userId),
  ])

  return {
    posts_count: postsCount || 0,
    followers_count: followersCount || 0,
    following_count: followingCount || 0,
  }
}

async function isFollowing(currentUserId: string | undefined, profileUserId: string): Promise<boolean> {
  if (!currentUserId || currentUserId === profileUserId) return false

  const supabase = await createClient()

  const { data } = await supabase
    .from("follows")
    .select("id")
    .eq("follower_id", currentUserId)
    .eq("following_id", profileUserId)
    .single()

  return !!data
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params
  const currentProfile = await getCurrentProfile()
  const profile = await getProfileByUsername(username)

  if (!profile) {
    notFound()
  }

  const [posts, stats, following] = await Promise.all([
    getUserPosts(profile.id),
    getUserStats(profile.id),
    isFollowing(currentProfile?.id, profile.id),
  ])

  const isOwnProfile = currentProfile?.id === profile.id

  return (
    <div className="min-h-screen bg-background">
      <Navbar profile={currentProfile} />
      <main className="container mx-auto max-w-5xl px-4 py-8">
        <ProfileHeader
          profile={profile}
          stats={stats}
          isOwnProfile={isOwnProfile}
          isFollowing={following}
          currentUserId={currentProfile?.id}
        />
        <ProfileGrid posts={posts} username={profile.username} />
      </main>
    </div>
  )
}
