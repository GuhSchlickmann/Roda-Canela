# Como Testar Localmente

## Problema
O Firebase Authentication não funciona com `file://` (abrir HTML diretamente).

## Solução: Usar servidor local

### Opção 1: Python (Recomendado)
```bash
# No diretório do projeto, execute:
python -m http.server 8000
```
Depois abra: http://localhost:8000

### Opção 2: Node.js
```bash
npx http-server -p 8000
```
Depois abra: http://localhost:8000

### Opção 3: VS Code Live Server
1. Instale a extensão "Live Server"
2. Clique com botão direito em `index.html`
3. Selecione "Open with Live Server"

## Configurar Firebase
Depois de escolher uma opção, adicione o domínio no Firebase:
1. Firebase Console > Authentication > Settings > Authorized domains
2. Adicione: `localhost`
