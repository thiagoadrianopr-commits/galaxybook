import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-primary/5 to-accent/10">
      <header className="p-4 md:p-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">GalaxBook</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Entrar</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Cadastrar</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="container mx-auto max-w-4xl text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-6xl font-bold text-balance text-foreground">
              Compartilhe seus momentos com o mundo
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
              GalaxBook é a rede social moderna onde você compartilha fotos, conecta-se com amigos e descobre conteúdos
              incríveis.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" asChild className="min-w-40">
              <Link href="/register">Começar agora</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="min-w-40 bg-transparent">
              <Link href="/login">Já tenho conta</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="p-6 rounded-lg bg-card border border-border">
              <h3 className="text-xl font-semibold mb-2 text-card-foreground">Compartilhe</h3>
              <p className="text-muted-foreground">
                Publique suas fotos favoritas e compartilhe seus momentos especiais
              </p>
            </div>
            <div className="p-6 rounded-lg bg-card border border-border">
              <h3 className="text-xl font-semibold mb-2 text-card-foreground">Conecte-se</h3>
              <p className="text-muted-foreground">Siga amigos, curta e comente em posts de pessoas que você admira</p>
            </div>
            <div className="p-6 rounded-lg bg-card border border-border">
              <h3 className="text-xl font-semibold mb-2 text-card-foreground">Descubra</h3>
              <p className="text-muted-foreground">Explore conteúdos novos e interessantes de toda a comunidade</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="p-6 text-center text-sm text-muted-foreground border-t border-border">
        <p>© 2025 GalaxBook. Todos os direitos reservados.</p>
      </footer>
    </div>
  )
}
