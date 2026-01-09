# Troubleshooting - Coolify

Problemas comuns e suas soluções específicas para Coolify.

## Problema: Build Falha

### Erro: "npm install failed"

Causa: Falta de memória ou problemas de rede.

Solução:
1. No Coolify, vá em Settings > Resources
2. Aumente RAM para no mínimo 2GB
3. Tente build novamente

### Erro: "Module not found"

Causa: Dependências não instaladas corretamente.

Solução:
1. Verifique se package.json está no repositório
2. Verifique se o Build Command está correto:
```bash
npm install && npm run build
```
3. Limpe cache e rebuilde

### Erro: "Next.js build failed"

Causa: Erro no código ou variáveis faltando.

Solução:
1. Verifique logs completos no Coolify
2. Procure por linhas com ERROR
3. Geralmente é variável de ambiente faltando
4. Adicione todas as variáveis NEXT_PUBLIC_* antes do build

## Problema: Deploy Completa mas Site Não Abre

### Erro: "502 Bad Gateway"

Causa: Aplicação não está rodando na porta correta.

Solução:
1. Verifique se a porta está configurada como 3000
2. Verifique o Start Command:
```bash
npm run start
```
3. Reinicie a aplicação

### Erro: "Application Crashed"

Causa: Erro ao iniciar aplicação.

Solução:
1. Vá em Logs no Coolify
2. Procure por erros de inicialização
3. Verifique se NODE_ENV=production está setado
4. Verifique se o build gerou a pasta .next

## Problema: Supabase Connection

### Erro: "Failed to fetch" ou "Network Error"

Causa: URLs do Supabase incorretas ou bloqueadas.

Solução:
1. Verifique se NEXT_PUBLIC_SUPABASE_URL está correta
2. Teste a URL diretamente:
```bash
curl https://xxxxxxxxxxxxx.supabase.co
```
3. Verifique se não tem espaços ou caracteres extras
4. Deve começar com https://

### Erro: "Invalid API key"

Causa: Chave do Supabase incorreta.

Solução:
1. Volte ao Supabase Dashboard
2. Project Settings > API
3. Copie novamente a anon key
4. Verifique se copiou a chave completa (são longas)
5. Atualize no Coolify
6. Faça redeploy

## Problema: Autenticação

### Erro: "Invalid redirect URL"

Causa: URL não está configurada no Supabase.

Solução:
1. No Supabase: Authentication > URL Configuration
2. Adicione em "Redirect URLs":
```
https://seu-dominio.com
https://seu-dominio.com/**
```
3. Salve
4. Aguarde 1-2 minutos para propagar

### Erro: "Email not confirmed"

Causa: Email de confirmação não foi verificado.

Solução:
1. Verifique caixa de spam
2. No Supabase: Authentication > Users
3. Encontre o usuário
4. Clique nos 3 pontos > Confirm Email
5. Tente login novamente

## Problema: Upload de Imagens

### Erro: "Storage bucket not found"

Causa: Buckets não foram criados.

Solução:
1. Execute o script: scripts/004_create_storage_buckets.sql
2. Ou crie manualmente no Supabase:
   - Storage > New Bucket > "avatars" (público)
   - Storage > New Bucket > "posts" (público)

### Erro: "Permission denied"

Causa: Políticas de acesso não configuradas.

Solução:
1. No Supabase: Storage > avatars > Policies
2. Verifique se existem políticas:
   - "Public Access" para SELECT
   - "Authenticated users can upload" para INSERT
3. Se não existirem, execute o script 004 novamente

## Problema: Performance

### Site muito lento

Solução:
1. Aumente recursos no Coolify:
   - RAM: 2GB mínimo (4GB recomendado)
   - CPU: 2 cores mínimo
2. Verifique logs por erros repetidos
3. Considere adicionar CDN

### Build muito demorado

Solução:
1. Normal: 5-10 minutos na primeira vez
2. Se mais de 15 minutos, cancele e tente novamente
3. Aumente recursos temporariamente para build

## Problema: SSL/HTTPS

### Erro: "Certificate error"

Causa: SSL ainda não foi gerado.

Solução:
1. Aguarde 5-10 minutos após adicionar domínio
2. Verifique se DNS está propagado:
```bash
nslookup seu-dominio.com
```
3. No Coolify, force regeneração do certificado

### HTTPS não funciona

Solução:
1. Verifique se o domínio está apontando para o IP correto
2. Verifique se a porta 443 está aberta no firewall
3. Tente desativar e reativar SSL no Coolify

## Problema: Logs e Debug

### Como ver logs detalhados

1. No Coolify, vá na aplicação
2. Clique em "Logs"
3. Selecione "Application Logs"
4. Use o filtro de data/hora
5. Procure por linhas com ERROR ou WARN

### Como acessar terminal

1. No Coolify, vá na aplicação
2. Clique em "Terminal"
3. Execute comandos:
```bash
# Ver processos
ps aux

# Ver uso de memória
free -h

# Ver arquivos
ls -la

# Ver variáveis de ambiente (cuidado com senhas!)
env | grep NEXT_PUBLIC
```

## Problema: Updates não Aparecem

### Código atualizado mas site igual

Causa: Cache ou build antiga.

Solução:
1. Force hard refresh no navegador: Ctrl+Shift+R
2. Limpe cache do navegador
3. No Coolify, clique em "Force Redeploy"
4. Verifique se commit foi feito no Git:
```bash
git log -1
```

## Problema: Database/Queries

### Erro: "relation does not exist"

Causa: Tabelas não foram criadas.

Solução:
1. Execute os scripts SQL na ordem:
   - 001_create_tables.sql
   - 002_create_functions.sql
   - 003_seed_data.sql
2. Verifique no Supabase: Table Editor
3. Devem existir: profiles, posts, likes, comments, follows

### Erro: "RLS policy violation"

Causa: Row Level Security bloqueando acesso.

Solução:
1. Verifique se o usuário está autenticado
2. No Supabase: Authentication > Policies
3. Verifique se as políticas estão ativas
4. Se necessário, desative RLS temporariamente para debug:
```sql
ALTER TABLE posts DISABLE ROW LEVEL SECURITY;
```
5. Não deixe desativado em produção!

## Precisa de Mais Ajuda?

Se nenhuma solução acima funcionou:

1. Anote o erro exato que aparece
2. Tire print dos logs
3. Verifique:
   - Todas variáveis de ambiente estão corretas?
   - Todos os scripts SQL foram executados?
   - O domínio está configurado corretamente?
   - SSL está ativo?
4. Volte e me informe o erro específico para ajuda detalhada

## Verificação Rápida

Execute este checklist quando algo não funcionar:

- [ ] Aplicação está "Running" no Coolify?
- [ ] Todas as 5 variáveis de ambiente estão configuradas?
- [ ] URL do Supabase está correta (começa com https)?
- [ ] Os 4 scripts SQL foram executados?
- [ ] Domínio está na lista de Redirect URLs do Supabase?
- [ ] SSL está ativo (site abre com https)?
- [ ] Logs não mostram erros vermelhos?

Se todos estiverem OK e ainda não funcionar, o problema é específico e preciso saber qual erro exato está aparecendo.
