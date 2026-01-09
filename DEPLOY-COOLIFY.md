# Deploy GalaxBook no Coolify - Guia Completo

Este guia mostra como fazer deploy do GalaxBook no Coolify passo a passo.

## Pré-requisitos

- Servidor com Coolify instalado
- Conta no Supabase (banco de dados)
- Repositório Git (GitHub, GitLab ou Bitbucket)

---

## PARTE 1: Preparar o Projeto

### Passo 1: Baixar o Código

1. No v0, clique nos 3 pontos no canto superior direito
2. Selecione "Download ZIP"
3. Extraia o arquivo ZIP no seu computador

### Passo 2: Criar Repositório Git

**Opção A - Via GitHub Desktop:**
1. Abra o GitHub Desktop
2. File > Add Local Repository
3. Selecione a pasta do GalaxBook
4. Clique em "Publish repository"
5. Marque como privado se preferir
6. Clique em "Publish Repository"

**Opção B - Via Linha de Comando:**
```bash
cd /caminho/para/galaxbook
git init
git add .
git commit -m "Initial commit GalaxBook"
git branch -M main
git remote add origin https://github.com/seu-usuario/galaxbook.git
git push -u origin main
```

---

## PARTE 2: Configurar Supabase

### Passo 3: Executar Scripts SQL

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto (ou crie um novo)
3. No menu lateral, clique em "SQL Editor"
4. Crie uma nova query e cole o conteúdo de cada arquivo na ordem:

**Script 1 - Criar Tabelas:**
```sql
-- Cole todo o conteúdo do arquivo: scripts/001_create_tables.sql
```
- Clique em "Run" ou pressione Ctrl+Enter
- Aguarde aparecer "Success"

**Script 2 - Criar Funções:**
```sql
-- Cole todo o conteúdo do arquivo: scripts/002_create_functions.sql
```
- Clique em "Run"
- Aguarde "Success"

**Script 3 - Dados Iniciais:**
```sql
-- Cole todo o conteúdo do arquivo: scripts/003_seed_data.sql
```
- Clique em "Run"
- Aguarde "Success"

**Script 4 - Storage Buckets:**
```sql
-- Cole todo o conteúdo do arquivo: scripts/004_create_storage_buckets.sql
```
- Clique em "Run"
- Aguarde "Success"

### Passo 4: Pegar Credenciais do Supabase

1. No Supabase, clique em "Project Settings" (ícone de engrenagem)
2. Clique em "API" no menu lateral
3. Anote as seguintes informações:

```
Project URL: https://xxxxxxxxxxxxx.supabase.co
anon/public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**IMPORTANTE:** A service_role key é secreta, nunca compartilhe!

---

## PARTE 3: Deploy no Coolify

### Passo 5: Acessar Coolify

1. Acesse seu Coolify: `https://seu-coolify.com`
2. Faça login
3. Selecione seu servidor ou crie um novo

### Passo 6: Criar Nova Aplicação

1. Clique em "+ New Resource"
2. Selecione "Application"
3. Escolha "Public Repository" ou "Private Repository"

**Se for Privado:**
- Conecte sua conta GitHub/GitLab
- Autorize o Coolify

4. Cole a URL do seu repositório:
```
https://github.com/seu-usuario/galaxbook
```

5. Clique em "Continue"

### Passo 7: Configurar Build

Na tela de configuração:

**Build Pack:**
- Selecione: "Nixpacks" ou "Dockerfile"

**Branch:**
- Deixe: `main`

**Build Command:**
```bash
npm install && npm run build
```

**Start Command:**
```bash
npm run start
```

**Port:**
```
3000
```

**Base Directory:**
- Deixe vazio (ou `/` se pedir)

### Passo 8: Adicionar Variáveis de Ambiente

1. Na mesma tela, role até "Environment Variables"
2. Clique em "+ Add Variable"
3. Adicione cada variável abaixo:

```bash
# Supabase URLs
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-aqui
SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role-aqui

# Redirect URL (adicione seu domínio depois)
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000

# Node Environment
NODE_ENV=production
```

**Como adicionar cada variável:**
- Key: `NEXT_PUBLIC_SUPABASE_URL`
- Value: `https://xxxxxxxxxxxxx.supabase.co`
- Clique em "Add"
- Repita para todas as variáveis

### Passo 9: Configurar Domínio (Opcional)

**Se você tem um domínio:**

1. Role até "Domains"
2. Clique em "+ Add Domain"
3. Digite: `galaxbook.seudominio.com`
4. Clique em "Add"
5. Coolify vai gerar as configurações de DNS

**Configure no seu provedor de DNS:**
```
Tipo: A
Nome: galaxbook
Valor: IP-DO-SEU-SERVIDOR-COOLIFY
TTL: 3600
```

**Ou use o domínio gerado pelo Coolify:**
- Coolify fornece algo como: `app-xxxxx.coolify.io`

### Passo 10: Fazer Deploy

1. Revise todas as configurações
2. Clique no botão "Deploy" ou "Save"
3. Aguarde o processo de build (pode demorar 3-10 minutos)

**Você verá logs assim:**
```
Cloning repository...
Installing dependencies...
Building application...
Starting application...
Application deployed successfully!
```

### Passo 11: Verificar Deploy

1. Quando aparecer "Running" ou "Healthy"
2. Clique no link do domínio gerado
3. Você deve ver a landing page do GalaxBook

---

## PARTE 4: Configurações Finais

### Passo 12: Atualizar Redirect URL no Supabase

1. Volte ao Supabase Dashboard
2. Project Settings > Authentication > URL Configuration
3. Em "Site URL", adicione: `https://seu-dominio-coolify.com`
4. Em "Redirect URLs", adicione:
```
https://seu-dominio-coolify.com
https://seu-dominio-coolify.com/**
```
5. Clique em "Save"

### Passo 13: Atualizar Variável no Coolify

1. Volte ao Coolify
2. Abra sua aplicação
3. Vá em "Environment Variables"
4. Edite `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL`
5. Mude para: `https://seu-dominio-coolify.com`
6. Clique em "Redeploy" para aplicar mudanças

### Passo 14: Testar Aplicação

Teste todas as funcionalidades:

**Teste 1 - Registro:**
1. Acesse: `https://seu-dominio/register`
2. Crie uma conta com email e senha
3. Verifique se recebe email de confirmação
4. Confirme o email

**Teste 2 - Login:**
1. Acesse: `https://seu-dominio/login`
2. Faça login com as credenciais
3. Deve redirecionar para `/feed`

**Teste 3 - Criar Post:**
1. Clique em "Nova Postagem" ou ícone +
2. Faça upload de uma imagem
3. Adicione uma legenda
4. Clique em "Publicar"

**Teste 4 - Perfil:**
1. Clique no seu avatar
2. Vá em "Perfil"
3. Teste editar perfil
4. Adicione foto de perfil

**Se tudo funcionar:** Parabéns! GalaxBook está no ar!

---

## PARTE 5: Configuração SSL (HTTPS)

### Passo 15: Ativar SSL

O Coolify geralmente ativa SSL automaticamente com Let's Encrypt.

**Se não estiver ativo:**
1. Na aplicação, vá em "Domains"
2. Clique no domínio
3. Ative "Enable SSL"
4. Aguarde alguns minutos
5. Acesse via HTTPS

---

## Problemas Comuns e Soluções

### Erro: "Application failed to start"

**Solução:**
1. Vá em "Logs" no Coolify
2. Procure por erros vermelhos
3. Geralmente é:
   - Variável de ambiente faltando
   - Erro no build

**Verificar:**
```bash
# Todas essas variáveis estão configuradas?
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

### Erro: "Build failed"

**Solução:**
1. Verifique os logs de build
2. Pode ser falta de memória
3. No Coolify, aumente recursos:
   - Settings > Resources
   - Memory: 2GB mínimo
   - CPU: 1 core mínimo

### Erro: "Cannot connect to Supabase"

**Solução:**
1. Verifique se as URLs estão corretas
2. Teste a conexão:
```bash
# Acesse o terminal da aplicação no Coolify
curl https://xxxxxxxxxxxxx.supabase.co
```
3. Deve retornar uma resposta do Supabase

### Erro: "Authentication redirect error"

**Solução:**
1. Verifique se o domínio está nas Redirect URLs do Supabase
2. Verifique se `NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL` está correto
3. Faça redeploy após mudanças

### Erro: "Storage/Upload não funciona"

**Solução:**
1. Verifique se executou o script `004_create_storage_buckets.sql`
2. No Supabase, vá em Storage
3. Verifique se os buckets `avatars` e `posts` existem
4. Verifique as políticas de acesso

### Site lento

**Solução:**
1. Aumente recursos no Coolify (RAM/CPU)
2. Ative cache no Coolify se disponível
3. Considere usar CDN

---

## Atualizações Futuras

### Como atualizar o código:

1. Faça mudanças no código localmente
2. Commit e push:
```bash
git add .
git commit -m "Descrição da mudança"
git push
```

3. No Coolify:
   - Ative "Auto Deploy" para deploy automático
   - Ou clique em "Redeploy" manualmente

---

## Comandos Úteis

### Ver logs da aplicação:
1. No Coolify, vá em "Logs"
2. Ou acesse terminal e digite:
```bash
docker logs -f nome-do-container
```

### Reiniciar aplicação:
1. No Coolify, clique em "Restart"

### Acesso ao terminal:
1. No Coolify, clique em "Terminal"
2. Execute comandos dentro do container

---

## Suporte

Se tiver problemas:

1. Verifique logs no Coolify
2. Verifique logs no Supabase (Logs & Analytics)
3. Revise todas as configurações acima
4. Volte aqui e me diga qual erro específico está tendo

---

## Resumo Rápido

1. Baixar código e subir no GitHub
2. Executar 4 scripts SQL no Supabase
3. Pegar credenciais do Supabase
4. Criar aplicação no Coolify
5. Conectar repositório
6. Adicionar variáveis de ambiente
7. Deploy
8. Configurar domínio e SSL
9. Atualizar redirect URLs no Supabase
10. Testar tudo

Pronto! GalaxBook rodando no Coolify.
