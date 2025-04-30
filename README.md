# 🧾 Sistema de Estoque

Sistema simples de gerenciamento de estoque com backend em Node.js + Express + SQLite e frontend em HTML, CSS e JavaScript puro.

## 🚀 Funcionalidades

- ✅ Listagem de produtos
- ➕ Cadastro de novos produtos
- 📝 Edição de produtos existentes
- 🗑️ Remoção de produtos
- 🔗 Integração entre frontend e backend via API REST
- 🔒 Validação de dados no backend

---

## 🛠 Tecnologias utilizadas

### Backend:
- Node.js
- Express
- SQLite3
- CORS

### Frontend:
- HTML5
- CSS3
- JavaScript puro (fetch API)

---

## 📁 Estrutura do Projeto

```bash
SistemaDeEstoque/
├── backend/
│   └── app.js
├── frontend/
│   ├── index.html
│   ├── script.js
│   └── style.css
├── estoque.db  # será gerado automaticamente
├── package.json

⚙️ Como rodar o projeto localmente
git clone https://github.com/leogiora/Sistema-de-Estoque.git

cd SistemaDeEstoque
npm install

node backend/app.js
(O backend ficará disponível em http://localhost:3000)

4. Abra o frontend
Vá até a pasta frontend

Clique com o botão direito no index.html e selecione "Abrir com Live Server"

Ou apenas abra o arquivo no navegador

🧪 Testar com Postman (opcional)
GET http://localhost:3000/ping → Testa se API está online

GET /produtos → Lista produtos

POST /produtos → Adiciona produto

PUT /produtos/:id → Edita produto

DELETE /produtos/:id → Deleta produto

produto

📌 Requisitos
Node.js instalado

Editor como Visual Studio Code

Extensão Live Server (opcional)

