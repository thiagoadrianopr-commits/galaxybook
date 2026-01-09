"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { ArrowLeft, Upload, X } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import type { Profile } from "@/lib/types"
import Link from "next/link"

export default function NewPostPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [caption, setCaption] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push("/login")
      return
    }

    const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    if (profileData) {
      setProfile(profileData)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!imageFile) {
      toast({
        variant: "destructive",
        title: "Imagem obrigatória",
        description: "Por favor, selecione uma imagem para o post.",
      })
      return
    }

    if (!profile) return

    setLoading(true)

    try {
      // Upload image
      const fileExt = imageFile.name.split(".").pop()
      const fileName = `${profile.id}-${Date.now()}.${fileExt}`
      const filePath = `posts/${fileName}`

      const { error: uploadError } = await supabase.storage.from("posts").upload(filePath, imageFile)

      if (uploadError) throw uploadError

      const {
        data: { publicUrl },
      } = supabase.storage.from("posts").getPublicUrl(filePath)

      // Create post
      const { error: postError } = await supabase.from("posts").insert({
        user_id: profile.id,
        image_url: publicUrl,
        caption: caption.trim() || null,
      })

      if (postError) throw postError

      toast({
        title: "Post criado!",
        description: "Seu post foi publicado com sucesso.",
      })

      router.push("/feed")
      router.refresh()
    } catch (error) {
      console.error(error)
      toast({
        variant: "destructive",
        title: "Erro ao criar post",
        description: "Não foi possível publicar seu post. Tente novamente.",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar profile={profile} />
        <div className="flex items-center justify-center py-16">
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar profile={profile} />
      <main className="container mx-auto max-w-2xl px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/feed" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Voltar ao feed</span>
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Novo Post</CardTitle>
            <CardDescription>Compartilhe um momento especial com seus seguidores</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {imagePreview ? (
                  <div className="relative aspect-square w-full overflow-hidden rounded-lg border-2 border-border">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={handleRemoveImage}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remover imagem</span>
                    </Button>
                  </div>
                ) : (
                  <div className="aspect-square w-full border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-4 bg-muted/20">
                    <Upload className="h-12 w-12 text-muted-foreground" />
                    <div className="text-center">
                      <Label htmlFor="image" className="cursor-pointer">
                        <Button type="button" variant="secondary" asChild>
                          <span>Escolher imagem</span>
                        </Button>
                      </Label>
                      <p className="text-sm text-muted-foreground mt-2">PNG, JPG ou GIF até 10MB</p>
                    </div>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                      disabled={loading}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="caption">Legenda</Label>
                <Textarea
                  id="caption"
                  placeholder="Escreva uma legenda..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  disabled={loading}
                  rows={4}
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground text-right">{caption.length}/500</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={loading || !imageFile} className="w-full">
                {loading ? "Publicando..." : "Publicar"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  )
}
