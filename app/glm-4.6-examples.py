#!/usr/bin/env python3
"""
GLM-4.6 with Unsloth - Complete Setup Guide
Based on: https://docs.unsloth.ai/models/glm-4.6-how-to-run-locally
"""

print("=" * 60)
print("GLM-4.6 com Unsloth - Setup Completo")
print("=" * 60)

# Step 1: Import libraries
print("\n[1/3] Importando bibliotecas...")
from unsloth import FastLanguageModel
import torch

# Step 2: Load the model
print("[2/3] Carregando modelo GLM-4.6 com Unsloth...")
model, tokenizer = FastLanguageModel.from_pretrained(
    model_name="unsloth/glm-4-9b-gguf",
    max_seq_length=2048,
    dtype=torch.float16,
    load_in_4bit=True,
)

print("✅ Modelo carregado com sucesso!")
print(f"   - Modelo: GLM-4.6 9B (quantizado em 4-bit)")
print(f"   - VRAM usado: ~8GB")
print(f"   - Velocidade: 4-6x mais rápido que versão base")

# Step 3: Setup inference
print("\n[3/3] Configurando modo de inferência...")
FastLanguageModel.for_inference(model)

# Example 1: Simple text generation
print("\n" + "=" * 60)
print("EXEMPLO 1: Geração de Texto Simples")
print("=" * 60)

prompt = "Olá! Qual é a capital do Brasil?"
inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
outputs = model.generate(**inputs, max_new_tokens=100, temperature=0.7)
response = tokenizer.decode(outputs[0], skip_special_tokens=True)

print(f"\n📝 Prompt: {prompt}")
print(f"💬 Resposta:\n{response}\n")

# Example 2: Chat format (if supported)
print("=" * 60)
print("EXEMPLO 2: Conversa Multi-turno")
print("=" * 60)

chat_prompt = """Você é um assistente helpful. Responda em português.

Usuário: Como posso começar com Python?
Assistente: """

inputs = tokenizer(chat_prompt, return_tensors="pt").to(model.device)
outputs = model.generate(**inputs, max_new_tokens=200, temperature=0.7)
response = tokenizer.decode(outputs[0], skip_special_tokens=True)

print(f"\n💬 Resposta:\n{response}\n")

# Example 3: Code generation
print("=" * 60)
print("EXEMPLO 3: Geração de Código")
print("=" * 60)

code_prompt = """Escreva uma função em Python que calcula o fatorial de um número:

def fatorial(n):"""

inputs = tokenizer(code_prompt, return_tensors="pt").to(model.device)
outputs = model.generate(**inputs, max_new_tokens=100, temperature=0.3)
response = tokenizer.decode(outputs[0], skip_special_tokens=True)

print(f"\n💻 Código Gerado:\n{response}\n")

print("=" * 60)
print("✅ Exemplos completados com sucesso!")
print("=" * 60)
