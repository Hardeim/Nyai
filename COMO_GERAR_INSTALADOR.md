# Como gerar o instalador

Você só precisa fazer uma vez por sistema. Depois você tem os arquivos
prontos pra distribuir.

## Pré-requisitos

- Node.js 18 ou superior
- Pra Windows: máquina Windows
- Pra Linux: máquina Linux (ou WSL no Windows)

## Instalação das dependências (uma vez só)

```bash
cd nyai-react
npm install
```

## Gerar instalador Windows

Numa máquina Windows:

```bash
npm run build:electron
```

Sai em `dist-electron/NYAI-Setup-1.0.0.exe`. Quem receber dá duplo clique
e instala. Pede pasta de instalação, cria atalho na área de trabalho.

## Gerar instalador Linux

Numa máquina Linux:

```bash
npm run build:linux
```

Saem dois arquivos em `dist-electron/`:

- `NYAI-1.0.0-x64.AppImage` — formato universal Linux. Quem receber dá
  permissão de execução (`chmod +x`) e executa direto, sem instalar.
- `NYAI-1.0.0-x64.deb` — pacote Debian/Ubuntu. Instala com `sudo dpkg -i`
  ou clicando duas vezes.

## Gerar os dois ao mesmo tempo

Numa máquina Linux que tenha Wine instalado (ou no GitHub Actions):

```bash
npm run build:all
```

## Atualizando o instalador

Sempre que mudar o código, rode novamente o comando do sistema desejado.

## Importante

A chave de API nunca fica no instalador. Cada usuário coloca a chave dele
na primeira vez que abre o app, e ela fica salva só no PC dele.

- Windows: `%APPDATA%\nyai\nyai-config.json`
- Linux: `~/.config/nyai/nyai-config.json`

Você pode compartilhar o instalador sem se preocupar.
