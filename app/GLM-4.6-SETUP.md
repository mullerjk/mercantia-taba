# 🚀 GLM-4.6 com Unsloth no Docker

## Visão Geral

Este setup utiliza o Unsloth para rodar o GLM-4.6 de forma otimizada em um container Docker.

**Benefícios:**
- ✅ 4-6x mais rápido que versão base
- ✅ Usa ~8GB VRAM (em vez de 180GB+)
- ✅ Ambiente isolado e reproduzível
- ✅ Jupyter Lab integrado

## 📋 Pré-requisitos

- Docker instalado
- ~15GB de espaço em disco
- Mac com Apple Silicon ou Intel

## 🚀 Como Usar

### Opção 1: Script Automático (Recomendado)

```bash
./run-unsloth.sh
```

Este script:
- Inicia o container com as portas corretas
- Monta seu workspace
- Mostra o link do Jupyter Lab

### Opção 2: Comando Manual

```bash
docker run -it --rm --platform linux/amd64 \
  -p 8888:8888 \
  -p 22:22 \
  -v ~/Sites/taba/app:/workspace \
  unsloth/unsloth
```

## 🌐 Acessar Jupyter Lab

1. O container mostrará um link como: `http://127.0.0.1:8888/?token=...`
2. Copie e abra no navegador
3. Crie um novo notebook Python

## 📝 Exemplo: Usar GLM-4.6

Dentro do Jupyter Lab, crie uma célula com:

```python
from unsloth import FastLanguageModel
import torch

# Carregar modelo
model, tokenizer = FastLanguageModel.from_pretrained(
    model_name="unsloth/glm-4-9b-gguf",
    max_seq_length=2048,
    dtype=torch.float16,
    load_in_4bit=True,
)

# Modo de inferência
FastLanguageModel.for_inference(model)

# Gerar resposta
prompt = "Olá! Qual é a capital do Brasil?"
inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
outputs = model.generate(**inputs, max_new_tokens=100)
response = tokenizer.decode(outputs[0], skip_special_tokens=True)

print(response)
```

## 📚 Recursos Adicionais

- [Documentação Unsloth](https://docs.unsloth.ai/)
- [GLM-4.6 Setup Guide](https://docs.unsloth.ai/models/glm-4.6-how-to-run-locally)
- [Hugging Face Model Card](https://huggingface.co/unsloth/glm-4-9b-gguf)

## ⚙️ Configurações Avançadas

### Fine-tuning (Treinamento)

```python
from unsloth import FastLanguageModel

# Setup para treinamento
model, tokenizer = FastLanguageModel.from_pretrained(
    model_name="unsloth/glm-4-9b-gguf",
    max_seq_length=2048,
    dtype=torch.float16,
    load_in_4bit=True,
)

# Habilitar LoRA para fine-tuning eficiente
model = FastLanguageModel.get_peft_model(
    model,
    r=16,
    lora_alpha=16,
    lora_dropout=0.05,
    bias="none",
    use_gradient_checkpointing="unsloth",
    random_state=42,
)
```

### Parar o Container

Pressione `Ctrl+C` no terminal

### Remover Imagem Docker

```bash
docker rmi unsloth/unsloth
```

## 🐛 Troubleshooting

**Problema:** Container não inicia
- Solução: Verifique espaço em disco

**Problema:** Jupyter não mostra token
- Solução: Aguarde 30-60 segundos

**Problema:** Erro de memória
- Solução: Reduz `max_seq_length` ou use `load_in_8bit=True`

---

**Criado em:** 1 de novembro de 2025
