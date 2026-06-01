# NYAI

Aplicativo desktop para **traduzir e reescrever mensagens** com diferentes tons.
Possui sistema de **memória de estilo** que aprende seu jeito de escrever.

> **Versão React** deste projeto — feita para portfólio com decisões de
> arquitetura modernas e tipagem completa em TypeScript.

---

## Stack técnica

- **Electron 28** — empacotamento desktop multiplataforma
- **React 18** — interface de usuário com componentes
- **TypeScript 5** — tipagem estática
- **Vite 5** — build e dev server
- **CSS variables + data-tema** — sistema de temas claro/escuro sem dependências

---

## Recursos

### Telas
- **Traduzir**: 3 modos (Traduzir / Corrigir / Corrigir+Traduzir), 11 idiomas, 6 tons.
- **Reescrever**: 7 tons (formal, casual, empático, assertivo, etc.) com instrução adicional.
- **Memória de estilo**: salva exemplos do seu jeito de escrever; injetados como few-shot.
- **Configurações**: provedor, chave, modelo, prompts editáveis, atalhos customizáveis, tema.

### Provedores de IA suportados
- DeepSeek, OpenAI, Google Gemini, Anthropic Claude (com chave de API).
- Ollama (local, grátis).

### Atalhos globais
| Combinação            | Ação |
|-----------------------|------|
| `Ctrl+Shift+Espaço`   | Mostrar/ocultar a janela |
| `Ctrl+Alt+Q`          | Capturar seleção e abrir na tela Traduzir |
| `Ctrl+Alt+W`          | Traduzir seleção na hora (resultado vai pro clipboard) |
| `Ctrl+Shift+X`        | Capturar seleção e abrir na tela Reescrever |
| `Ctrl+Shift+Q`        | Colar última tradução no app onde o cursor estiver |

Todos os atalhos são editáveis em Configurações.

---

## Como rodar

### Pré-requisitos
- [Node.js 18+](https://nodejs.org)
- Windows (para os atalhos globais funcionarem 100%)

### Desenvolvimento
```bash
npm install
npm run dev
```
Abre o Vite (porta 5173) e o Electron simultaneamente, com hot reload.

### Build do instalador
```bash
npm run build:electron
```
Gera `dist-electron/NYAI-Setup-1.0.0.exe` para Windows.

---

## Estrutura de pastas

```
nyai-react/
├── electron/                    ← processo principal Electron
│   ├── main.js                  ← janela, IPC, persistência, IA
│   └── preload.js               ← ponte segura (contextBridge)
├── src/
│   ├── componentes/             ← componentes React reutilizáveis
│   │   ├── TopBar.tsx
│   │   ├── SideBar.tsx
│   │   └── Toasts.tsx
│   ├── telas/                   ← uma tela por arquivo
│   │   ├── TelaTraduzir.tsx
│   │   ├── TelaReescrever.tsx
│   │   ├── TelaEstilo.tsx
│   │   └── TelaConfiguracoes.tsx
│   ├── contextos/
│   │   └── ContextoApp.tsx      ← Provider global (config + memória + toasts)
│   ├── tipos/
│   │   └── index.ts             ← interfaces TS de tudo
│   ├── utils/
│   │   └── constantes.ts        ← listas de idiomas, tons, provedores
│   ├── estilos/
│   │   ├── global.css           ← variáveis de tema claro/escuro
│   │   ├── layout.css           ← topbar, sidebar, telas
│   │   └── componentes.css      ← pills, botões, modais
│   ├── App.tsx                  ← raiz: roteamento entre telas
│   └── main.tsx                 ← bootstrap React
├── public/                      ← assets estáticos
├── index.html                   ← entrada Vite
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## Decisões de arquitetura

### Por que `contextIsolation: true` e `preload.js`?
O padrão antigo do Electron usava `nodeIntegration: true`, expondo Node.js no
renderer. Isso é inseguro: qualquer XSS conseguia ler/escrever arquivos do
usuário. O moderno usa `contextBridge` no preload para expor APENAS funções
específicas (`window.nyai.*`), bloqueando acesso direto ao Node.

### Por que Context API e não Redux/Zustand?
Para 4 telas e estado simples (config, memória, toasts), Context API resolve
sem dependência externa. Redux só vale a pena em apps com fluxo de estado
complexo entre muitos componentes não-relacionados.

### Por que CSS variables em vez de styled-components?
Dois motivos: (1) zero runtime — variáveis CSS são nativas e gratuitas em
performance; (2) trocar tema (claro/escuro) é mudar um atributo `data-tema`
no `<html>` — instantâneo, sem re-renderizar nada.

### Por que tipos TS centralizados em `tipos/index.ts`?
Toda a forma dos dados que cruzam a IPC fica num lugar só. Mudou a Config?
Mexe em um arquivo. O TS reclama em cada componente que estiver desatualizado.

### Segurança das chaves de API
- **Chaves nunca aparecem no código** — `chaves: { deepseek: '', ... }` é o padrão.
- **Salvas apenas em `%APPDATA%/nyai/`** (PC do usuário, fora do repo).
- **Mascaradas na UI** — `obterConfiguracao()` no main retorna `'••••••••XXXX'`.
- **`.gitignore`** bloqueia commit acidental dos arquivos de config.

### Memória de estilo (few-shot learning)
Quando o usuário salva um exemplo "original → versão preferida", o main
armazena em `nyai-memoria.json`. Em cada requisição de reescrita, os 3
exemplos mais relevantes (mesmo tom, ou mais recentes) são injetados como
mensagens anteriores do chat. A IA "vê" como o usuário escreve e tende a
seguir esse estilo.

---

## Licença

MIT
