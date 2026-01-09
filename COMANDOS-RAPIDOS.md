# Comandos Rápidos - Deploy GalaxBook

## Conectar ao Servidor
```bash
ssh usuario@ip-do-servidor
```

## Navegar até Projeto
```bash
cd /home/usuario/galaxbook
```

## Atualizar Código
```bash
# Se usando Git
git pull origin main
npm install
npm run build
pm2 restart galaxbook

# Se enviando arquivo
# 1. Envie novo arquivo via SCP ou FileZilla
# 2. Execute:
npm install
npm run build
pm2 restart galaxbook
```

## Gerenciar Aplicação
```bash
pm2 status              # Ver status
pm2 logs galaxbook      # Ver logs
pm2 restart galaxbook   # Reiniciar
pm2 stop galaxbook      # Parar
pm2 start galaxbook     # Iniciar
```

## Gerenciar Nginx
```bash
sudo systemctl status nginx     # Status
sudo systemctl restart nginx    # Reiniciar
sudo nginx -t                   # Testar configuração
```

## Ver Logs de Erro
```bash
pm2 logs galaxbook --err                    # Logs da aplicação
sudo tail -f /var/log/nginx/error.log       # Logs do Nginx
```

## Editar Variáveis de Ambiente
```bash
cd /home/usuario/galaxbook
nano .env.local
# Editar, salvar (Ctrl+X, Y, Enter)
pm2 restart galaxbook
```

## Backup do Banco
```bash
# No painel Supabase:
# Settings → Database → Backup
# Fazer download do backup
