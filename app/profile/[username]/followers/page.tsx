import { notFound } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { getCurrentProfile } from "@/lib/auth"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft } from "lucide-react"
import type { Profile } from "@/lib/types"

interface FollowersPageProps {
  params: Promise<{
    username: string
  }>
}

async function getProfileByUsername(username: string): Promise<Profile | null> {
  const supabase = await createClient()

  const { data: profile } = await supabase.from("profiles").select("*").eq("username", username).single()

  return profile
}

async function getFollowers(userId: string): Promise<Profile[]> {
  const supabase = await createClient()

  const { data } = await supabase
    .from("follows")
    .select(
      `
      follower:profiles!follows_follower_id_fkey(*)
    `,
    )
    .eq("following_id", userId)

  return data?.map((item: any) => item.follower).filter(Boolean) || []
}

export default async function FollowersPage({ params }: FollowersPageProps) {
  const { username } = await params
  const currentProfile = await getCurrentProfile()
  const profile = await getProfileByUsername(username)

  if (!profile) {
    notFound()
  }

  const followers = await getFollowers(profile.id)

  return (
    <div className="min-h-screen bg-background">
      <Navbar profile={currentProfile} />
      <main className="container mx-auto max-w-2xl px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href={`/profile/${username}`} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Voltar ao perfil</span>
            </Link>
          </Button>
        </div>

        <h1 className="text-3xl font-bold mb-6 text-foreground">Seguidores de @{username}</h1>

        {followers.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">@{username} ainda não tem seguidores.</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {followers.map((follower) => (
              <Card key={follower.id} className="p-4">
                <Link href={`/profile/${follower.username}`} className="flex items-center gap-3 hover:opacity-80">
                  <Avatar className="h-12 w-12 border-2 border-primary/20">
                    <AvatarImage src={follower.avatar_url || undefined} alt={follower.username} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {follower.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">@{follower.username}</p>
                    {follower.full_name && <p className="text-sm text-muted-foreground">{follower.full_name}</p>}
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
