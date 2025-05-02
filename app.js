// app.js
import express from "express";
import sqlite3 from "sqlite3";
import cors from "cors";

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Conexão com banco SQLite
const db = new sqlite3.Database("./estoque.db", (err) => {
  if (err) {
    console.error("Erro ao conectar no banco:", err.message);
  } else {
    console.log("Conectado ao banco de dados SQLite.");

    // Criar tabela se não existir
    db.run(`
      CREATE TABLE IF NOT EXISTS produtos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT,
        quantidade INTEGER,
        preco REAL
      )
    `);
  }
  // Criar tabela de movimentações
  db.run(`
  CREATE TABLE IF NOT EXISTS movimentacoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    produto_id INTEGER,
    tipo TEXT CHECK(tipo IN ('entrada', 'saida')),
    quantidade INTEGER,
    data TEXT,
    FOREIGN KEY (produto_id) REFERENCES produtos(id)
  )
`);
});

// Rota de teste
app.get("/ping", (req, res) => {
  res.json({ message: "API funcionando! 🚀" });
});

// Rota para adicionar um produto
app.post("/produtos", (req, res) => {
  const { nome, quantidade, preco } = req.body;

  if (!nome || quantidade == null || preco == null) {
    return res.status(400).json({ error: "Dados incompletos" });
  }

  const query =
    "INSERT INTO produtos (nome, quantidade, preco) VALUES (?, ?, ?)";
  const params = [nome, quantidade, preco];

  db.run(query, params, function (err) {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: "Erro ao inserir produto" });
    }
    res.status(201).json({ id: this.lastID, nome, quantidade, preco });
  });
});

// Rota para listar todos os produtos
app.get("/produtos", (req, res) => {
  db.all("SELECT * FROM produtos", [], (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: "Erro ao buscar produtos" });
    }
    res.json(rows);
  });
});

// Rota para editar um produto existente
app.put("/produtos/:id", (req, res) => {
  const { id } = req.params;
  const { nome, quantidade, preco } = req.body;

  if (!nome || quantidade == null || preco == null) {
    return res.status(400).json({ error: "Dados incompletos" });
  }

  const query = `
    UPDATE produtos
    SET nome = ?, quantidade = ?, preco = ?
    WHERE id = ?
  `;
  const params = [nome, quantidade, preco, id];

  db.run(query, params, function (err) {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: "Erro ao atualizar produto" });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    res.json({ message: "Produto atualizado com sucesso" });
  });
});

// Rota para deletar um produto
app.delete("/produtos/:id", (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM produtos WHERE id = ?", [id], function (err) {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: "Erro ao deletar produto" });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    res.json({ message: "Produto deletado com sucesso" });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
