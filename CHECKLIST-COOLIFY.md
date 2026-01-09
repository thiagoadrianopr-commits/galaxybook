# Checklist de Deploy no Coolify

Use esta lista para verificar cada passo:

## Preparação

- [ ] Código baixado do v0
- [ ] Repositório criado no GitHub/GitLab
- [ ] Código enviado para o repositório (git push)

## Supabase

- [ ] Projeto Supabase criado
- [ ] Script 001_create_tables.sql executado com sucesso
- [ ] Script 002_create_functions.sql executado com sucesso
- [ ] Script 003_seed_data.sql executado com sucesso
- [ ] Script 004_create_storage_buckets.sql executado com sucesso
- [ ] Credenciais anotadas (URL, anon key, service_role key)
- [ ] Buckets de storage criados (avatars e posts)

## Coolify

- [ ] Aplicação criada no Coolify
- [ ] Repositório conectado
- [ ] Build Pack selecionado (Nixpacks ou Dockerfile)
- [ ] Branch configurada (main)
- [ ] Porta configurada (3000)

## Variáveis de Ambiente

- [ ] NEXT_PUBLIC_SUPABASE_URL adicionada
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY adicionada
- [ ] SUPABASE_SERVICE_ROLE_KEY adicionada
- [ ] NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL adicionada
- [ ] NODE_ENV=production adicionada

## Deploy

- [ ] Deploy iniciado
- [ ] Build completado sem erros
- [ ] Aplicação iniciou (status: Running/Healthy)
- [ ] Site acessível via domínio

## Domínio e SSL

- [ ] Domínio configurado (próprio ou gerado pelo Coolify)
- [ ] DNS configurado (se domínio próprio)
- [ ] SSL ativado (HTTPS funcionando)

## Configurações Finais

- [ ] Site URL atualizada no Supabase
- [ ] Redirect URLs adicionadas no Supabase
- [ ] NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL atualizada no Coolify
- [ ] Redeploy feito após mudanças

## Testes

- [ ] Registro de usuário funciona
- [ ] Email de confirmação recebido
- [ ] Login funciona
- [ ] Criação de post funciona
- [ ] Upload de imagem funciona
- [ ] Likes funcionam
- [ ] Comentários funcionam
- [ ] Seguir/deixar de seguir funciona
- [ ] Edição de perfil funciona
- [ ] Upload de avatar funciona

## Pós-Deploy

- [ ] Logs verificados (sem erros)
- [ ] Performance testada
- [ ] Auto-deploy ativado (opcional)

---

Se algum item falhar, volte ao DEPLOY-COOLIFY.md na seção de troubleshooting.
