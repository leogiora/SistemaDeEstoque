# 📦 Sistema de Estoque

Sistema de controle de produtos simples e funcional com frontend moderno e backend em Node.js + SQLite.

![Capa](./capa.png)

## 🚀 Funcionalidades

- Adicionar, editar e remover produtos
- Contadores automáticos (estoque baixo, total)
- Filtro de busca dinâmica na tabela
- Toasts de sucesso/erro animados
- Tema claro/escuro com salvamento
- Sidebar responsiva recolhível

---

## 🧰 Tecnologias Utilizadas

- HTML + CSS + JS (Vanilla)
- Node.js + Express
- SQLite3

---

## 📂 Estrutura do Projeto

```
Sistema-de-Estoque/
├── Frontend/
│   ├── index.html
│   ├── logo.png
│   ├── script.js
│   └── style.css
├── app.js               # Servidor Node.js + SQLite
├── estoque.db           # Banco SQLite (gerado automaticamente)
├── package.json
├── README.md
└── instruções postman.txt
```

---

## ⚙️ Como Rodar Localmente

### 1. Instalar dependências
```bash
npm install
```

### 2. Rodar o servidor
```bash
node app.js
```
Servidor: `http://localhost:3000`

### 3. Abrir o sistema
Abra o arquivo `Frontend/index.html` no navegador (clique duplo ou use extensão Live Server do VSCode).

---


📌 **Obs:** Este projeto foi feito com fins de aprendizado e portfólio pessoal.
