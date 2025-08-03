# 🔥 Configuração do Firebase para GitHub Pages

## **Por que Firebase?**
✅ **Banco de dados em tempo real** - Todos veem as confirmações instantaneamente  
✅ **Funciona no GitHub Pages** - Não precisa de servidor  
✅ **Gratuito** - Até 10GB de dados e 100.000 leituras/dia  
✅ **Seguro** - Você controla quem pode acessar  

---

## **Passo 1: Criar Projeto no Firebase**

1. Acesse: https://console.firebase.google.com/
2. Clique em **"Adicionar projeto"**
3. Nome do projeto: `casamento-react` (ou outro nome)
4. **Desabilite** o Google Analytics (não é necessário)
5. Clique em **"Criar projeto"**

---

## **Passo 2: Configurar Realtime Database**

1. No painel do Firebase, vá em **"Realtime Database"**
2. Clique em **"Criar banco de dados"**
3. Escolha **"Começar no modo de teste"** (você pode alterar depois)
4. Selecione a localização: **"us-central1"**

---

## **Passo 3: Obter Configurações**

1. Vá em **"Configurações do projeto"** (ícone de engrenagem)
2. Vá na aba **"Geral"**
3. Em **"Seus aplicativos"**, clique em **"Web"** `</>`
4. Registre o app com nome: `casamento-react`
5. **Copie o objeto `firebaseConfig`**

---

## **Passo 4: Configurar no Projeto**

1. Abra o arquivo: `src/firebase/config.js`
2. Substitua as configurações pelos seus dados:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...", // Cole aqui sua API Key
  authDomain: "casamento-react.firebaseapp.com",
  databaseURL: "https://casamento-react-default-rtdb.firebaseio.com", // Cole aqui sua URL
  projectId: "casamento-react",
  storageBucket: "casamento-react.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:..."
};
```

---

## **Passo 5: Migrar Dados Iniciais**

Para migrar os convidados existentes para o Firebase:

### **Método 1: Painel de Administração (Recomendado)**
1. Execute a aplicação: `npm run start-static`
2. Vá para a página "Confirmar Presença"
3. Digite o código: `ADMIN`
4. Clique em "Buscar"
5. No painel que abrir:
   - Clique em "Testar Conexão Firebase"
   - Se OK, clique em "Migrar Dados"
   - Aguarde a migração completar

### **Método 2: Console do Firebase**
1. Acesse: https://console.firebase.google.com/
2. Vá no seu projeto > Realtime Database
3. Importe o arquivo `public/static/convidados.json`

### **Método 3: Script manual**
1. Execute: `npm run migrate-to-firebase`

---

## **Passo 6: Deploy para GitHub Pages**

```bash
npm run build
npm run deploy
```

---

## **Como Funciona:**

### **Para os Convidados:**
- Acessam o site no GitHub Pages
- Digitam o código do convite
- Confirmam presença
- **Dados são salvos para TODOS verem!**

### **Para Você (Organizador):**
- Use o código especial: `M0M0` para ver resumo das confirmações
- Use o código especial: `ADMIN` para acessar o painel de administração completo
- No painel admin: veja relatórios detalhados, migre dados e teste conexão
- Acesse o painel do Firebase para backup e configurações avançadas
- **Data limite para confirmações: 30/08/2025**

---

## **Comandos Úteis:**

```bash
# Rodar localmente (desenvolvimento)
npm run start-static

# Build para GitHub Pages
npm run build

# Deploy para GitHub Pages
npm run deploy

# Ver dados no Firebase Console
# https://console.firebase.google.com/
```

---

## **Vantagens desta Solução:**

✅ **Dados centralizados** - Todos veem as mesmas confirmações  
✅ **Tempo real** - Atualizações instantâneas  
✅ **Backup automático** - Firebase guarda tudo  
✅ **Sem servidor** - Funciona 100% no GitHub Pages  
✅ **Móvel-friendly** - Funciona em qualquer dispositivo  

---

## **Suporte:**
Se tiver problemas, verifique:
1. Configuração do Firebase em `src/firebase/config.js`
2. Console do navegador (F12) para erros
3. Regras de segurança do Firebase
