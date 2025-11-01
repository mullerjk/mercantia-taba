#!/bin/bash
# Script to run Unsloth with GLM-4.6 in Docker

echo "🐳 Iniciando container Unsloth com Docker..."
echo ""
echo "O container está rodando com:"
echo "  - Jupyter Lab (http://localhost:8888)"
echo "  - SSH em localhost:22"
echo ""
echo "Para acessar o Jupyter Lab, abra seu navegador em:"
echo "  👉 http://localhost:8888"
echo ""
echo "Pressione Ctrl+C para parar o container"
echo ""

docker run -it --rm --platform linux/amd64 \
  -p 8888:8888 \
  -p 22:22 \
  -v ~/Sites/taba/app:/workspace \
  unsloth/unsloth
