import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Heart, MessageCircle, ImageIcon } from "lucide-react"
import type { Post } from "@/lib/types"

interface ProfileGridProps {
  posts: Post[]
  username: string
}

export async function ProfileGrid({ posts, username }: ProfileGridProps) {
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <ImageIcon className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold text-foreground mb-2">Nenhum post ainda</h3>
        <p className="text-muted-foreground">Quando @{username} postar algo, aparecerá aqui.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-1 md:gap-4">
      {posts.map((post) => (
        <Link key={post.id} href={`/post/${post.id}`}>
          <Card className="aspect-square overflow-hidden border-border bg-card hover:opacity-90 transition-opacity relative group">
            <img
              src={post.image_url || "/placeholder.svg"}
              alt={post.caption || "Post"}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6">
              <div className="flex items-center gap-2 text-foreground">
                <Heart className="h-6 w-6 fill-current" />
                <span className="font-semibold">{post.likes_count || 0}</span>
              </div>
              <div className="flex items-center gap-2 text-foreground">
                <MessageCircle className="h-6 w-6 fill-current" />
                <span className="font-semibold">{post.comments_count || 0}</span>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  )
}
