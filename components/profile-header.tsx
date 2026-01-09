"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Settings, UserPlus, UserMinus } from "lucide-react"
import type { Profile, UserStats } from "@/lib/types"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface ProfileHeaderProps {
  profile: Profile
  stats: UserStats
  isOwnProfile: boolean
  isFollowing: boolean
  currentUserId?: string
}

export function ProfileHeader({
  profile,
  stats,
  isOwnProfile,
  isFollowing: initialFollowing,
  currentUserId,
}: ProfileHeaderProps) {
  const [isFollowing, setIsFollowing] = useState(initialFollowing)
  const [followersCount, setFollowersCount] = useState(stats.followers_count)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const handleFollow = async () => {
    if (!currentUserId) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Você precisa estar logado para seguir usuários",
      })
      return
    }

    setLoading(true)

    try {
      if (isFollowing) {
        // Unfollow
        const { error } = await supabase
          .from("follows")
          .delete()
          .eq("follower_id", currentUserId)
          .eq("following_id", profile.id)

        if (error) throw error

        setIsFollowing(false)
        setFollowersCount((prev) => prev - 1)
        toast({
          title: "Deixou de seguir",
          description: `Você não segue mais @${profile.username}`,
        })
      } else {
        // Follow
        const { error } = await supabase.from("follows").insert({
          follower_id: currentUserId,
          following_id: profile.id,
        })

        if (error) throw error

        setIsFollowing(true)
        setFollowersCount((prev) => prev + 1)
        toast({
          title: "Seguindo",
          description: `Agora você segue @${profile.username}`,
        })
      }

      router.refresh()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível completar a ação. Tente novamente.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 mb-12">
      <div className="flex justify-center md:justify-start">
        <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-primary/20">
          <AvatarImage src={profile.avatar_url || undefined} alt={profile.username} />
          <AvatarFallback className="bg-primary text-primary-foreground text-5xl">
            {profile.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="flex-1 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">@{profile.username}</h1>

          {isOwnProfile ? (
            <Button variant="outline" asChild>
              <Link href="/profile/edit" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span>Editar Perfil</span>
              </Link>
            </Button>
          ) : (
            <Button onClick={handleFollow} disabled={loading} className="flex items-center gap-2">
              {isFollowing ? (
                <>
                  <UserMinus className="h-4 w-4" />
                  <span>Deixar de seguir</span>
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  <span>Seguir</span>
                </>
              )}
            </Button>
          )}
        </div>

        <div className="flex gap-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">{stats.posts_count}</div>
            <div className="text-sm text-muted-foreground">posts</div>
          </div>
          <Link
            href={`/profile/${profile.username}/followers`}
            className="text-center hover:opacity-70 transition-opacity"
          >
            <div className="text-2xl font-bold text-foreground">{followersCount}</div>
            <div className="text-sm text-muted-foreground">seguidores</div>
          </Link>
          <Link
            href={`/profile/${profile.username}/following`}
            className="text-center hover:opacity-70 transition-opacity"
          >
            <div className="text-2xl font-bold text-foreground">{stats.following_count}</div>
            <div className="text-sm text-muted-foreground">seguindo</div>
          </Link>
        </div>

        <div className="space-y-1">
          {profile.full_name && <p className="font-semibold text-foreground">{profile.full_name}</p>}
          {profile.bio && <p className="text-muted-foreground whitespace-pre-wrap">{profile.bio}</p>}
        </div>
      </div>
    </div>
  )
}
