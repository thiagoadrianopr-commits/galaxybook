"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Bookmark } from "lucide-react"
import type { Post } from "@/lib/types"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

interface PostCardProps {
  post: Post
  currentUserId: string
}

export function PostCard({ post, currentUserId }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.is_liked || false)
  const [likesCount, setLikesCount] = useState(post.likes_count || 0)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const handleLike = async () => {
    setLoading(true)

    try {
      if (isLiked) {
        // Unlike
        const { error } = await supabase.from("likes").delete().eq("user_id", currentUserId).eq("post_id", post.id)

        if (error) throw error

        setIsLiked(false)
        setLikesCount((prev) => prev - 1)
      } else {
        // Like
        const { error } = await supabase.from("likes").insert({
          user_id: currentUserId,
          post_id: post.id,
        })

        if (error) throw error

        setIsLiked(true)
        setLikesCount((prev) => prev + 1)
      }

      router.refresh()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível curtir o post. Tente novamente.",
      })
    } finally {
      setLoading(false)
    }
  }

  const timeAgo = formatDistanceToNow(new Date(post.created_at), {
    addSuffix: true,
    locale: ptBR,
  })

  return (
    <Card className="overflow-hidden border-border bg-card">
      {/* Header */}
      <div className="p-4 flex items-center gap-3">
        <Link href={`/profile/${post.profile?.username}`}>
          <Avatar className="h-10 w-10 border-2 border-primary/20">
            <AvatarImage src={post.profile?.avatar_url || undefined} alt={post.profile?.username || "User"} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {post.profile?.username?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex-1">
          <Link href={`/profile/${post.profile?.username}`} className="font-semibold text-foreground hover:underline">
            {post.profile?.username}
          </Link>
          <p className="text-xs text-muted-foreground">{timeAgo}</p>
        </div>
      </div>

      {/* Image */}
      <Link href={`/post/${post.id}`}>
        <div className="aspect-square w-full overflow-hidden bg-muted">
          <img
            src={post.image_url || "/placeholder.svg"}
            alt={post.caption || "Post"}
            className="w-full h-full object-cover"
          />
        </div>
      </Link>

      {/* Actions */}
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLike}
            disabled={loading}
            className={isLiked ? "text-red-500 hover:text-red-600" : "text-foreground"}
          >
            <Heart className={`h-6 w-6 ${isLiked ? "fill-current" : ""}`} />
            <span className="sr-only">Curtir</span>
          </Button>
          <Button variant="ghost" size="icon" asChild className="text-foreground">
            <Link href={`/post/${post.id}`}>
              <MessageCircle className="h-6 w-6" />
              <span className="sr-only">Comentar</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="ml-auto text-foreground">
            <Bookmark className="h-6 w-6" />
            <span className="sr-only">Salvar</span>
          </Button>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">
            {likesCount} {likesCount === 1 ? "curtida" : "curtidas"}
          </p>
          {post.caption && (
            <p className="text-sm text-foreground">
              <Link href={`/profile/${post.profile?.username}`} className="font-semibold hover:underline">
                {post.profile?.username}
              </Link>{" "}
              <span className="text-muted-foreground">{post.caption}</span>
            </p>
          )}
          {post.comments_count ? (
            <Link href={`/post/${post.id}`} className="text-sm text-muted-foreground hover:underline block">
              Ver {post.comments_count === 1 ? "comentário" : `todos os ${post.comments_count} comentários`}
            </Link>
          ) : null}
        </div>
      </div>
    </Card>
  )
}
