"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Heart, MessageCircle, ArrowLeft, Send } from "lucide-react"
import type { Post, Comment } from "@/lib/types"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

interface PostDetailProps {
  post: Post
  currentUserId: string
}

export function PostDetail({ post, currentUserId }: PostDetailProps) {
  const [isLiked, setIsLiked] = useState(post.is_liked || false)
  const [likesCount, setLikesCount] = useState(post.likes_count || 0)
  const [comments, setComments] = useState<Comment[]>([])
  const [commentText, setCommentText] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    loadComments()
  }, [])

  const loadComments = async () => {
    const { data } = await supabase
      .from("comments")
      .select(
        `
        *,
        profile:profiles(*)
      `,
      )
      .eq("post_id", post.id)
      .order("created_at", { ascending: true })

    if (data) {
      setComments(data)
    }
  }

  const handleLike = async () => {
    setLoading(true)

    try {
      if (isLiked) {
        const { error } = await supabase.from("likes").delete().eq("user_id", currentUserId).eq("post_id", post.id)

        if (error) throw error

        setIsLiked(false)
        setLikesCount((prev) => prev - 1)
      } else {
        const { error } = await supabase.from("likes").insert({
          user_id: currentUserId,
          post_id: post.id,
        })

        if (error) throw error

        setIsLiked(true)
        setLikesCount((prev) => prev + 1)
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível curtir o post.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!commentText.trim()) return

    setLoading(true)

    try {
      const { error } = await supabase.from("comments").insert({
        user_id: currentUserId,
        post_id: post.id,
        content: commentText.trim(),
      })

      if (error) throw error

      setCommentText("")
      await loadComments()
      router.refresh()

      toast({
        title: "Comentário adicionado",
        description: "Seu comentário foi publicado!",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível adicionar o comentário.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" asChild>
        <Link href="/feed" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar</span>
        </Link>
      </Button>

      <Card className="overflow-hidden border-border bg-card grid md:grid-cols-2">
        {/* Image */}
        <div className="aspect-square w-full overflow-hidden bg-muted">
          <img
            src={post.image_url || "/placeholder.svg"}
            alt={post.caption || "Post"}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-border flex items-center gap-3">
            <Link href={`/profile/${post.profile?.username}`}>
              <Avatar className="h-10 w-10 border-2 border-primary/20">
                <AvatarImage src={post.profile?.avatar_url || undefined} alt={post.profile?.username || "User"} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {post.profile?.username?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </Link>
            <Link href={`/profile/${post.profile?.username}`} className="font-semibold text-foreground hover:underline">
              {post.profile?.username}
            </Link>
          </div>

          {/* Comments */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96">
            {post.caption && (
              <div className="flex gap-3">
                <Link href={`/profile/${post.profile?.username}`}>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={post.profile?.avatar_url || undefined} alt={post.profile?.username || "User"} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                      {post.profile?.username?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <div className="flex-1">
                  <p className="text-sm">
                    <Link
                      href={`/profile/${post.profile?.username}`}
                      className="font-semibold text-foreground hover:underline"
                    >
                      {post.profile?.username}
                    </Link>{" "}
                    <span className="text-muted-foreground">{post.caption}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: ptBR })}
                  </p>
                </div>
              </div>
            )}

            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <Link href={`/profile/${comment.profile?.username}`}>
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={comment.profile?.avatar_url || undefined}
                      alt={comment.profile?.username || "User"}
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                      {comment.profile?.username?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <div className="flex-1">
                  <p className="text-sm">
                    <Link
                      href={`/profile/${comment.profile?.username}`}
                      className="font-semibold text-foreground hover:underline"
                    >
                      {comment.profile?.username}
                    </Link>{" "}
                    <span className="text-muted-foreground">{comment.content}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: ptBR })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="border-t border-border">
            <div className="p-4 space-y-2">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLike}
                  disabled={loading}
                  className={isLiked ? "text-red-500 hover:text-red-600" : "text-foreground"}
                >
                  <Heart className={`h-6 w-6 ${isLiked ? "fill-current" : ""}`} />
                </Button>
                <MessageCircle className="h-6 w-6 text-foreground" />
              </div>
              <p className="text-sm font-semibold text-foreground">
                {likesCount} {likesCount === 1 ? "curtida" : "curtidas"}
              </p>
            </div>

            {/* Comment input */}
            <form onSubmit={handleComment} className="p-4 border-t border-border flex items-center gap-2">
              <Input
                placeholder="Adicione um comentário..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                disabled={loading}
                className="flex-1"
              />
              <Button type="submit" size="icon" disabled={loading || !commentText.trim()}>
                <Send className="h-4 w-4" />
                <span className="sr-only">Enviar</span>
              </Button>
            </form>
          </div>
        </div>
      </Card>
    </div>
  )
}
