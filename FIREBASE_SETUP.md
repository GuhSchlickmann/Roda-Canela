# 🔥 Configuração do Firebase

## Passo 1: Criar Projeto no Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em **"Adicionar projeto"**
3. Digite o nome do projeto (ex: "avaliacoes-google")
4. Desabilite o Google Analytics (opcional)
5. Clique em **"Criar projeto"**

## Passo 2: Configurar Realtime Database

1. No menu lateral, clique em **"Realtime Database"**
2. Clique em **"Criar banco de dados"**
3. Selecione a localização (recomendado: **United States**)
4. Escolha **"Iniciar no modo de teste"** (por enquanto)
5. Clique em **"Ativar"**

## Passo 3: Configurar Google Sign-In (Autenticação)

1. No menu lateral, clique em **"Authentication"**
2. Clique em **"Get started"**
3. Na aba **"Sign-in method"**, clique em **"Google"**
4. Ative o toggle **"Enable"**
5. Selecione um email de suporte do projeto
6. Clique em **"Save"**

> ✅ Agora os usuários poderão fazer login com suas contas Google!

## Passo 4: Configurar Regras de Segurança

No Firebase Console, vá em **Realtime Database > Regras** e cole:

```json
{
  "rules": {
    "feedbacks": {
      ".read": false,
      ".write": true,
      "$feedbackId": {
        ".validate": "newData.hasChildren(['rating', 'feedback', 'timestamp'])",
        "rating": {
          ".validate": "newData.isNumber() && newData.val() >= 1 && newData.val() <= 5"
        },
        "name": {
          ".validate": "newData.isString() && newData.val().length <= 100"
        },
        "email": {
          ".validate": "newData.isString() && newData.val().length <= 100"
        },
        "feedback": {
          ".validate": "newData.isString() && newData.val().length >= 10 && newData.val().length <= 1000"
        },
        "timestamp": {
          ".validate": "newData.val() === now"
        }
      }
    }
  }
}
```

**Explicação das regras:**
- ✅ Qualquer um pode **escrever** feedbacks (`.write: true`)
- ❌ Ninguém pode **ler** feedbacks publicamente (`.read: false`)
- ✅ Validação de dados (rating entre 1-5, feedback mínimo 10 caracteres)

## Passo 4: Obter Credenciais do Firebase

1. No Firebase Console, clique no ícone de **engrenagem ⚙️** > **Configurações do projeto**
2. Role até **"Seus apps"**
3. Clique no ícone **</>** (Web)
4. Registre o app com um apelido (ex: "Landing Page")
5. **NÃO** marque "Firebase Hosting"
6. Clique em **"Registrar app"**
7. Copie o objeto `firebaseConfig`

Exemplo:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyAbc123...",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto-id",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123",
  databaseURL: "https://seu-projeto-default-rtdb.firebaseio.com"
};
```

## Passo 5: Configurar no Código

Abra o arquivo **`script.js`** e substitua o objeto `CONFIG.firebase`:

```javascript
const CONFIG = {
    firebase: {
        apiKey: "SUA_API_KEY_AQUI",
        authDomain: "seu-projeto.firebaseapp.com",
        projectId: "seu-projeto-id",
        storageBucket: "seu-projeto.appspot.com",
        messagingSenderId: "123456789",
        appId: "1:123456789:web:abc123",
        databaseURL: "https://seu-projeto-default-rtdb.firebaseio.com"
    },
    // ... resto da configuração
};
```

## Passo 6: Testar

1. Abra o arquivo `index.html` no navegador
2. Selecione 1-3 estrelas
3. Preencha o formulário e envie
4. Volte ao Firebase Console > Realtime Database
5. Você deve ver os dados salvos em `feedbacks/`

## 📊 Visualizar Feedbacks

### Opção 1: Firebase Console (Simples)

Acesse **Firebase Console > Realtime Database** para ver todos os feedbacks.

### Opção 2: Criar Painel Admin (Recomendado)

Vou criar um painel administrativo para você visualizar as estatísticas!

## 🔒 Segurança em Produção

Quando for para produção, configure regras mais restritivas:

```json
{
  "rules": {
    "feedbacks": {
      ".read": "auth != null",  // Apenas usuários autenticados podem ler
      ".write": true,            // Qualquer um pode escrever
      "$feedbackId": {
        ".validate": "newData.hasChildren(['rating', 'feedback', 'timestamp'])"
      }
    }
  }
}
```

## 💰 Custos

O Firebase tem um plano **GRATUITO** generoso:

- ✅ **Spark Plan (Grátis)**:
  - 1 GB de armazenamento
  - 10 GB/mês de transferência
  - 100 conexões simultâneas

Para a maioria dos casos de uso, isso é mais que suficiente!

## Passo 7: Configurar Firebase Storage (Fotos/Vídeos)

1. No menu lateral, clique em **"Storage"**
2. Clique em **"Get started"** (Começar)
3. Clique em **"Next"** e selecione a localização (mesma do Database)
4. Clique em **"Done"**
5. Na aba **"Rules"** (Regras), você verá que por padrão ele exige login. Para permitir que seus clientes enviem fotos sem precisar criar conta, mude para:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /feedbacks/{allPaths=**} {
      // Permite que qualquer um envie fotos para a pasta feedbacks
      allow read: if true;
      allow write: if request.resource.size < 10 * 1024 * 1024 // Máximo 10MB
                   && request.resource.contentType.matches('image/.*|video/.*');
    }
  }
}
```
6. Clique em **"Publish"**.

---

## Passo 8: Resolver Erro de CORS (Fotos não sobem no Netlify)

Se você viu o erro **"blocked by CORS policy"** no console, significa que o Google Storage está bloqueando pedidos que vêm do seu domínio do Netlify. Siga estes passos para liberar:

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/) (use a mesma conta do Firebase).
2. Selecione o seu projeto do Firebase no topo da página.
3. Clique no ícone do **Terminal (Cloud Shell) >_** no topo direito.
4. Quando o terminal abrir lá embaixo, clique no ícone de "Open Editor" (Lápis) ou use o comando abaixo para criar um arquivo:
   
   Execute este comando no terminal:
   ```bash
   echo '[{"origin": ["*"],"method": ["GET", "POST", "PUT", "DELETE", "HEAD"],"responseHeader": ["Content-Type"],"maxAgeSeconds": 3600}]' > cors.json
   ```

5. Agora, aplique essa regra ao seu balde do Firebase (substitua `SEU-PROJETO.appspot.com` pelo seu Storage Bucket que está no `script.js`):
   
   ```bash
   gsutil cors set cors.json gs://avaliacao-c0504.firebasestorage.app
   ```
   *(Dica: O nome do bucket está na linha 13 do seu `script.js`)*

6. Você receberá uma mensagem de sucesso. Pronto! As fotos agora carregarão instantaneamente.

---

## 🆘 Problemas Comuns (Atualizado)

### Erro: "blocked by CORS policy"
- **Causa**: O domínio do Netlify/Vercel tenta enviar dados para o Google sem "autorização prévia".
- **Solução**: Siga o **Passo 8** acima religiosamente. É o único jeito de liberar uploads via navegador.

## 📚 Documentação Oficial

- [Firebase Realtime Database](https://firebase.google.com/docs/database)
- [Regras de Segurança](https://firebase.google.com/docs/database/security)
