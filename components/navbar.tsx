"use client"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Home, PlusSquare, Search, Sparkles, User, LogOut } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { ThemeToggle } from "@/components/theme-toggle"
import type { Profile } from "@/lib/types"

interface NavbarProps {
  profile?: Profile | null
}

export function Navbar({ profile }: NavbarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast({
      title: "Logout realizado",
      description: "Até logo!",
    })
    router.push("/login")
    router.refresh()
  }

  const isActive = (path: string) => pathname === path

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/feed" className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl hidden sm:inline text-foreground">GalaxBook</span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            variant={isActive("/feed") ? "default" : "ghost"}
            size="icon"
            asChild
            className={isActive("/feed") ? "" : "text-muted-foreground hover:text-foreground"}
          >
            <Link href="/feed">
              <Home className="h-5 w-5" />
              <span className="sr-only">Feed</span>
            </Link>
          </Button>

          <Button
            variant={isActive("/explore") ? "default" : "ghost"}
            size="icon"
            asChild
            className={isActive("/explore") ? "" : "text-muted-foreground hover:text-foreground"}
          >
            <Link href="/explore">
              <Search className="h-5 w-5" />
              <span className="sr-only">Explorar</span>
            </Link>
          </Button>

          <Button
            variant={isActive("/post/new") ? "default" : "ghost"}
            size="icon"
            asChild
            className={isActive("/post/new") ? "" : "text-muted-foreground hover:text-foreground"}
          >
            <Link href="/post/new">
              <PlusSquare className="h-5 w-5" />
              <span className="sr-only">Novo Post</span>
            </Link>
          </Button>

          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.username || "User"} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {profile?.username?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="sr-only">Menu do usuário</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/profile/${profile?.username}`} className="flex items-center gap-2 cursor-pointer">
                  <User className="h-4 w-4" />
                  <span>Meu Perfil</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 cursor-pointer">
                <LogOut className="h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  )
}
