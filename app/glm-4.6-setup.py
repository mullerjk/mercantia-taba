#!/usr/bin/env python3
"""
Setup script to download and use GLM-4.6 with Unsloth
Based on: https://docs.unsloth.ai/models/glm-4.6-how-to-run-locally
"""

from unsloth import FastLanguageModel
import torch

# Download and setup GLM-4.6 with Unsloth
print("Downloading GLM-4.6 model with Unsloth quantization...")

model, tokenizer = FastLanguageModel.from_pretrained(
    model_name="unsloth/glm-4-9b-gguf",
    max_seq_length=2048,
    dtype=torch.float16,
    load_in_4bit=True,
)

print("Model loaded successfully!")
print(f"Model: {model}")
print(f"Tokenizer: {tokenizer}")

# Test the model
prompt = "Hello! How are you?"
inputs = tokenizer(prompt, return_tensors="pt").to("cuda" if torch.cuda.is_available() else "cpu")
outputs = model.generate(**inputs, max_new_tokens=100)
result = tokenizer.decode(outputs[0], skip_special_tokens=True)

print(f"\nPrompt: {prompt}")
print(f"Response: {result}")
