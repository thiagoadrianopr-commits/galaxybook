# Guia Específico para YasyPanel

## Se o YasyPanel tem Interface de Aplicações Node.js

### 1. Criar Aplicação Node.js no Painel
1. Entre no YasyPanel
2. Vá em "Aplicações" ou "Node.js Apps"
3. Clique em "Criar Nova Aplicação"
4. Configure:
   - Nome: galaxbook
   - Versão Node: 18.x
   - Diretório: /home/usuario/galaxbook
   - Comando Start: `npm start`
   - Porta: 3000
   - Auto-restart: Sim

### 2. Upload de Arquivos via Painel
1. No YasyPanel, vá em "Gerenciador de Arquivos"
2. Navegue até `/home/usuario`
3. Crie pasta "galaxbook"
4. Faça upload dos arquivos do projeto
5. No terminal do painel, execute:
```bash
cd /home/usuario/galaxbook
npm install
npm run build
```

### 3. Configurar Variáveis de Ambiente
1. No YasyPanel, vá em "Aplicações" → "galaxbook"
2. Procure por "Variáveis de Ambiente" ou "Environment Variables"
3. Adicione:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY
   - NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL
   - NODE_ENV=production

### 4. Iniciar Aplicação
1. No painel, clique em "Start" ou "Iniciar"
2. Aguarde alguns segundos
3. Verifique o status

### 5. Configurar Domínio no Painel
1. Vá em "Domínios"
2. Adicione seu domínio
3. Configure proxy para porta 3000
4. Ative SSL automático

## Se o YasyPanel NÃO tem Interface de Aplicações

Siga o guia completo do arquivo `DEPLOY-YASYPANEL.md` usando SSH.
