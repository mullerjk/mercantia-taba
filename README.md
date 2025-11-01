# MagicUI Integration Guide

## 📁 Arquitetura de Workspace

Esta configuração permite usar o MagicUI diretamente do repositório clonado, sem precisar de npm packages ou build separados.

## 🚀 Como Usar

### 1. Instalar Dependências

```bash
# Entrar na pasta da sua app
cd app

# Instalar dependências da app (MagicUI components já estão incluídos)
npm install
```

### 2. Usar Componentes MagicUI

Agora você pode importar componentes diretamente do MagicUI:

```tsx
// No seu arquivo app/src/components/MyComponent.tsx

import { Dock, DockIcon } from "./magicui/dock"
import { Marquee } from "./magicui/marquee"
import BlurFade from "./magicui/blur-fade"
import { FileText, Image, Settings } from "lucide-react"

export function MyDockComponent() {
  return (
    <Dock className="mt-8">
      <DockIcon>
        <FileText className="h-5 w-5" />
      </DockIcon>
      <DockIcon>
        <Image className="h-5 w-5" />
      </DockIcon>
      <DockIcon>
        <Settings className="h-5 w-5" />
      </DockIcon>
    </Dock>
  )
}
```

### 3. Componentes Disponíveis

Mais de 70 componentes estão disponíveis em:
- `magicui/apps/www/registry/magicui/`

Alguns populares:
- `blur-fade` - Animações de fade/blur
- `dock` - Dock estilo macOS
- `marquee` - Texto/scrolling animations
- `flickering-grid` - Grid com efeito flicker
- `border-beam` - Bordas com efeito beam
- `aurora-text` - Texto com gradiente aurora
- `bento-grid` - Layout grid responsivo
- `confetti` - Confete e efeitos de celebração

### 4. Scripts Disponíveis

```bash
# Desenvolvimento (entrar na pasta app)
cd app
npm run dev           # Rodar sua app
npm run build         # Build da sua app
npm run start         # Start da sua app

# MagicUI (opcional - desenvolvimento do MagicUI)
cd ../magicui/apps/www
npm run dev           # Rodar MagicUI docs/demo
npm run build         # Build do MagicUI
```

## 📦 Estrutura de Arquivos

```
taba/
├── app/                    # Sua aplicação Next.js
│   ├── src/
│   │   ├── app/           # App router
│   │   ├── components/    # Seus componentes
│   │   └── lib/           # Utilitários
│   └── package.json
├── magicui/               # Repositório MagicUI
│   └── apps/www/
│       ├── registry/magicui/  # Componentes
│       └── lib/utils.ts       # Utilitários
├── package.json           # Workspace root
├── pnpm-workspace.yaml    # Configuração workspaces
└── turbo.json             # Configuração Turbo
```

## 🔧 Configuração TypeScript

O TypeScript está configurado com alias `@magicui/*` que aponta para os componentes no repositório MagicUI:

```json
{
  "paths": {
    "@/*": ["./src/*"],
    "@magicui/*": ["../magicui/apps/www/registry/magicui/*"]
  }
}
```

## 🎨 Dependências Comuns

Todos os componentes MagicUI necessários já estão na pasta `app/src/components/magicui/`. 

Se precisar de dependências extras para novos componentes:

```bash
cd app
npm install motion framer-motion @radix-ui/react-* lucide-react
```

## 🔄 Atualizando MagicUI

Para atualizar para a versão mais recente:

```bash
cd magicui
git pull origin main
```

## 🎯 Exemplos de Uso

### Dock Component
```tsx
import { Dock, DockIcon } from "./components/magicui/dock"
import { FileText } from "lucide-react"

export function AppDock() {
  return (
    <Dock>
      <DockIcon>
        <FileText className="h-5 w-5" />
      </DockIcon>
    </Dock>
  )
}
```

### Marquee Component
```tsx
import { Marquee } from "./components/magicui/marquee"

export function TestimonialMarquee() {
  return (
    <Marquee className="py-4">
      <p>Great product!</p>
      <p>Amazing UI!</p>
      <p>Love it!</p>
    </Marquee>
  )
}
```

### Blur Fade Animation
```tsx
import BlurFade from "./components/magicui/blur-fade"

export function AnimatedComponent() {
  return (
    <BlurFade delay={0.25}>
      <div>Conteúdo com animação de blur fade</div>
    </BlurFade>
  )
}
```

## 📝 Notas Importantes

1. **TypeScript**: Certifique-se de que o TypeScript está configurado corretamente
2. **Styling**: O MagicUI usa Tailwind CSS, certifique-se que está instalado
3. **Dependencies**: Some componentes precisam de dependências específicas
4. **Updates**: Para atualizar componentes, faça git pull no repositório magicui

## 🛠️ Desenvolvimento

Para contribuir ou modificar componentes do MagicUI:

1. **App Principal**: Edite componentes em `app/src/components/magicui/`
2. **MagicUI Base**: Acesse o repositório em `magicui/apps/www/registry/magicui/`
3. **Teste**: Use `npm run dev` na pasta app para hot reload

## 🎯 Resultado Final

✅ **MagicUI Integration Complete!**
- ✅ MagicUI clonado e integrado via workspace
- ✅ Componentes disponíveis em `app/src/components/magicui/`
- ✅ Demo funcional em `/demo-magicui`
- ✅ 70+ componentes disponíveis para uso
- ✅ Configurado para npm (sem dependência de pnpm)
- ✅ TypeScript configurado corretamente

## 🚀 Como Usar Agora

### 1. Instalar Dependências
```bash
cd app
npm install
```

### 2. Rodar Desenvolvimento
```bash
cd app
npm run dev
```

### 3. Testar Demo
Acesse: `http://localhost:3000/demo-magicui`

### 4. Usar Componentes
```tsx
import { Dock, DockIcon } from "./components/magicui/dock"
import { Marquee } from "./components/magicui/marquee"
import BlurFade from "./components/magicui/blur-fade"
```

---

**🎉 Pronto para usar! MagicUI integrado com sucesso!**

---

**🎉 MagicUI Integration Complete!**
