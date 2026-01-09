# Guia Completo de Deploy - GalaxBook no YasyPanel

## Passo 1: Preparar o Projeto Localmente

### 1.1 Baixar o Projeto
1. No v0, clique nos 3 pontos no canto superior direito
2. Selecione "Download ZIP"
3. Extraia o arquivo ZIP em uma pasta no seu computador

### 1.2 Abrir o Terminal na Pasta do Projeto
- Windows: Shift + Botão Direito na pasta → "Abrir janela do PowerShell aqui"
- Mac/Linux: Botão direito → "Abrir no Terminal"

### 1.3 Instalar Dependências Localmente (Opcional)
```bash
npm install
```

## Passo 2: Configurar o Supabase

### 2.1 Criar Conta no Supabase
1. Acesse: https://supabase.com
2. Clique em "Start your project"
3. Faça login com GitHub ou email

### 2.2 Criar Novo Projeto
1. Clique em "New Project"
2. Escolha um nome: galaxbook
3. Defina uma senha forte para o banco de dados
4. Escolha a região mais próxima
5. Clique em "Create new project"
6. Aguarde 2-3 minutos até o projeto estar pronto

### 2.3 Executar Scripts SQL
1. No painel lateral, clique em "SQL Editor"
2. Clique em "New query"
3. Abra o arquivo `scripts/001_create_tables.sql` no seu computador
4. Copie TODO o conteúdo
5. Cole no editor SQL do Supabase
6. Clique em "Run" (ou pressione Ctrl+Enter)
7. Aguarde a mensagem "Success"

**Repita para os outros scripts NA ORDEM:**
- `scripts/002_create_functions.sql`
- `scripts/003_seed_data.sql`
- `scripts/004_create_storage_buckets.sql`

### 2.4 Copiar Credenciais do Supabase
1. No painel lateral, clique em "Settings" (ícone de engrenagem)
2. Clique em "API"
3. Copie e salve em um arquivo de texto:
   - Project URL (exemplo: https://abcdefgh.supabase.co)
   - anon public (chave longa que começa com "eyJ...")
   - service_role (chave secreta - NUNCA compartilhe)

## Passo 3: Preparar Arquivos para Upload

### 3.1 Criar Arquivo .env.local
Na pasta raiz do projeto, crie um arquivo chamado `.env.local` com este conteúdo:

```
NEXT_PUBLIC_SUPABASE_URL=cole_aqui_o_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=cole_aqui_a_anon_key
SUPABASE_SERVICE_ROLE_KEY=cole_aqui_a_service_role_key
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://seu-dominio.com
NODE_ENV=production
```

Substitua os valores pelas suas credenciais do Supabase.

### 3.2 Verificar Arquivo package.json
Confirme que o arquivo `package.json` tem estes scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

## Passo 4: Acessar seu VPS via SSH

### 4.1 Obter Credenciais SSH no YasyPanel
1. Acesse seu painel YasyPanel
2. Vá em "Servidores" ou "VPS"
3. Anote:
   - IP do servidor (exemplo: 192.168.1.100)
   - Porta SSH (geralmente 22)
   - Usuário (geralmente "root" ou nome customizado)
   - Senha

### 4.2 Conectar via SSH

**Windows (usando PuTTY):**
1. Baixe PuTTY: https://www.putty.org
2. Abra PuTTY
3. Em "Host Name", coloque o IP do servidor
4. Em "Port", coloque 22
5. Clique em "Open"
6. Digite o usuário e senha quando solicitado

**Windows (usando PowerShell):**
```bash
ssh usuario@ip-do-servidor
# Digite a senha quando solicitado
```

**Mac/Linux (usando Terminal):**
```bash
ssh usuario@ip-do-servidor
# Digite a senha quando solicitado
```

## Passo 5: Instalar Node.js no Servidor

### 5.1 Verificar se Node.js está instalado
```bash
node --version
npm --version
```

### 5.2 Se não estiver instalado, instale o Node.js 18+
```bash
# Atualizar sistema
sudo apt update
sudo apt upgrade -y

# Instalar Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verificar instalação
node --version
npm --version
```

## Passo 6: Enviar Arquivos para o Servidor

### Opção A: Usar SCP (Mais Fácil)

**No seu computador local**, navegue até a pasta do projeto e execute:

```bash
# Compactar projeto (exclui node_modules)
tar -czf galaxbook.tar.gz --exclude=node_modules --exclude=.next .

# Enviar para servidor
scp galaxbook.tar.gz usuario@ip-do-servidor:/home/usuario/

# Exemplo real:
# scp galaxbook.tar.gz root@192.168.1.100:/home/root/
```

**No servidor SSH**, extraia os arquivos:
```bash
cd /home/usuario
mkdir galaxbook
tar -xzf galaxbook.tar.gz -C galaxbook
cd galaxbook
```

### Opção B: Usar Git

**No seu computador:**
1. Crie um repositório no GitHub
2. Envie o código:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/seu-usuario/galaxbook.git
git push -u origin main
```

**No servidor:**
```bash
cd /home/usuario
git clone https://github.com/seu-usuario/galaxbook.git
cd galaxbook
```

### Opção C: Usar FileZilla (Interface Gráfica)

1. Baixe FileZilla: https://filezilla-project.org
2. Abra FileZilla
3. Vá em Arquivo → Gerenciador de Sites
4. Clique em "Novo Site"
5. Configure:
   - Protocolo: SFTP
   - Host: IP do servidor
   - Porta: 22
   - Tipo de login: Normal
   - Usuário: seu usuário
   - Senha: sua senha
6. Clique em "Conectar"
7. Arraste a pasta do projeto para `/home/usuario/galaxbook`

## Passo 7: Configurar Variáveis de Ambiente no Servidor

**No SSH:**
```bash
cd /home/usuario/galaxbook

# Criar arquivo .env.local
nano .env.local
```

Cole o conteúdo (com suas credenciais do Supabase):
```
NEXT_PUBLIC_SUPABASE_URL=sua-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon
SUPABASE_SERVICE_ROLE_KEY=sua-chave-service
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://seu-dominio.com
NODE_ENV=production
```

Para salvar no nano:
- Pressione Ctrl+X
- Digite Y (sim)
- Pressione Enter

## Passo 8: Instalar Dependências e Build

**No SSH:**
```bash
cd /home/usuario/galaxbook

# Instalar dependências (pode demorar alguns minutos)
npm install

# Fazer build do projeto (pode demorar 2-5 minutos)
npm run build
```

Se houver erro de memória, tente:
```bash
NODE_OPTIONS="--max-old-space-size=2048" npm run build
```

## Passo 9: Instalar PM2 (Gerenciador de Processos)

```bash
# Instalar PM2 globalmente
sudo npm install -g pm2

# Verificar instalação
pm2 --version
```

## Passo 10: Iniciar Aplicação com PM2

```bash
cd /home/usuario/galaxbook

# Iniciar aplicação
pm2 start npm --name "galaxbook" -- start

# Ver status
pm2 status

# Ver logs
pm2 logs galaxbook

# Salvar configuração para reiniciar automaticamente
pm2 save
pm2 startup
# Copie e execute o comando que aparecer
```

## Passo 11: Configurar Nginx (Proxy Reverso)

### 11.1 Instalar Nginx
```bash
sudo apt install nginx -y
```

### 11.2 Criar Configuração do Site
```bash
sudo nano /etc/nginx/sites-available/galaxbook
```

Cole esta configuração:
```nginx
server {
    listen 80;
    server_name seu-dominio.com www.seu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Salve (Ctrl+X, Y, Enter)

### 11.3 Ativar Site
```bash
# Criar link simbólico
sudo ln -s /etc/nginx/sites-available/galaxbook /etc/nginx/sites-enabled/

# Testar configuração
sudo nginx -t

# Reiniciar Nginx
sudo systemctl restart nginx

# Verificar status
sudo systemctl status nginx
```

## Passo 12: Configurar Domínio

### 12.1 No seu Provedor de Domínio
1. Acesse o painel do seu registrador de domínio
2. Vá em "Gerenciar DNS" ou "Zone Editor"
3. Adicione um registro A:
   - Tipo: A
   - Nome: @ (ou deixe em branco)
   - Valor: IP do seu servidor
   - TTL: 3600

4. Adicione um registro A para www:
   - Tipo: A
   - Nome: www
   - Valor: IP do seu servidor
   - TTL: 3600

5. Aguarde 5-30 minutos para propagar

## Passo 13: Instalar SSL (HTTPS)

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obter certificado SSL
sudo certbot --nginx -d seu-dominio.com -d www.seu-dominio.com

# Siga as instruções:
# - Digite seu email
# - Aceite os termos (A)
# - Escolha se quer compartilhar email (Y/N)
# - Escolha opção 2 (redirecionar HTTP para HTTPS)

# Testar renovação automática
sudo certbot renew --dry-run
```

## Passo 14: Configurar CORS no Supabase

1. Acesse seu projeto no Supabase
2. Vá em Settings → API
3. Role até "Site URL"
4. Adicione: `https://seu-dominio.com`
5. Role até "Redirect URLs"
6. Adicione: `https://seu-dominio.com/**`
7. Clique em "Save"

## Passo 15: Testar a Aplicação

1. Abra o navegador
2. Acesse: `https://seu-dominio.com`
3. Você deve ver a página inicial do GalaxBook
4. Teste criar uma conta
5. Teste fazer login
6. Teste criar um post

## Comandos Úteis

### Gerenciar Aplicação
```bash
# Ver status
pm2 status

# Ver logs em tempo real
pm2 logs galaxbook

# Reiniciar aplicação
pm2 restart galaxbook

# Parar aplicação
pm2 stop galaxbook

# Remover aplicação
pm2 delete galaxbook
```

### Verificar Portas
```bash
# Ver quais portas estão em uso
sudo netstat -tulpn | grep LISTEN
```

### Verificar Nginx
```bash
# Status do Nginx
sudo systemctl status nginx

# Reiniciar Nginx
sudo systemctl restart nginx

# Ver logs de erro
sudo tail -f /var/log/nginx/error.log
```

## Solução de Problemas Comuns

### Erro: "Cannot find module"
```bash
cd /home/usuario/galaxbook
rm -rf node_modules package-lock.json
npm install
npm run build
pm2 restart galaxbook
```

### Erro: "Port 3000 already in use"
```bash
# Encontrar processo usando porta 3000
sudo lsof -i :3000

# Matar processo (substitua PID pelo número que apareceu)
kill -9 PID

# Ou reiniciar PM2
pm2 restart galaxbook
```

### Erro: "Memory limit exceeded"
```bash
# Aumentar limite de memória
pm2 delete galaxbook
pm2 start npm --name "galaxbook" --node-args="--max-old-space-size=2048" -- start
```

### Aplicação não carrega
```bash
# Verificar logs
pm2 logs galaxbook

# Verificar se Nginx está rodando
sudo systemctl status nginx

# Verificar se porta 3000 está respondendo
curl http://localhost:3000
```

### Erro de conexão com Supabase
- Verifique se as variáveis de ambiente em `.env.local` estão corretas
- Verifique se o domínio está nas URLs permitidas no Supabase
- Reinicie a aplicação: `pm2 restart galaxbook`

## Checklist Final

- [ ] Node.js instalado no servidor
- [ ] Arquivos enviados para o servidor
- [ ] Scripts SQL executados no Supabase
- [ ] Arquivo .env.local criado com credenciais corretas
- [ ] npm install executado com sucesso
- [ ] npm run build executado com sucesso
- [ ] PM2 instalado e aplicação rodando
- [ ] Nginx instalado e configurado
- [ ] Domínio apontando para o servidor
- [ ] SSL/HTTPS configurado
- [ ] URLs permitidas configuradas no Supabase
- [ ] Aplicação acessível via navegador
- [ ] Cadastro e login funcionando
- [ ] Upload de imagens funcionando

## Suporte

Se você encontrar problemas:
1. Verifique os logs: `pm2 logs galaxbook`
2. Verifique logs do Nginx: `sudo tail -f /var/log/nginx/error.log`
3. Teste conexão local: `curl http://localhost:3000`
4. Verifique variáveis de ambiente: `cat .env.local`

Anote a mensagem de erro exata e me informe para que eu possa ajudar.
