#!/bin/bash

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Configurando Vercel KV...${NC}"

# Verificar se o Vercel CLI está instalado
if ! command -v vercel &> /dev/null
then
    echo "Instalando Vercel CLI..."
    npm i -g vercel
fi

# Fazer login no Vercel (se necessário)
echo -e "${BLUE}Fazendo login no Vercel...${NC}"
vercel login

# Criar KV Database
echo -e "${BLUE}Criando KV Database...${NC}"
vercel kv add

# Linkar projeto
echo -e "${BLUE}Linkando projeto...${NC}"
vercel link

# Puxar variáveis de ambiente
echo -e "${BLUE}Configurando variáveis de ambiente...${NC}"
vercel env pull .env.local

echo -e "${GREEN}Setup completo!${NC}"
echo -e "Agora você pode executar ${BLUE}npm run dev${NC} para iniciar o projeto." 