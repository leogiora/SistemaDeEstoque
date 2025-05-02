import express from "express";
import sqlite3 from "sqlite3";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("./estoque.db", (err) => {
  if (err) {
    console.error("Erro ao conectar no banco:", err.message);
  } else {
    console.log("Conectado ao banco SQLite.");

    // Criação da tabela de produtos
    db.run(`
      CREATE TABLE IF NOT EXISTS produtos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT,
        quantidade INTEGER,
        preco REAL
      )
    `);

    // Criação da tabela de movimentações
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
  }
});

// Rota de teste
app.get("/ping", (req, res) => {
  res.json({ message: "API funcionando! 🚀" });
});

// Adicionar produto
app.post("/produtos", (req, res) => {
  const { nome, preco } = req.body;

  if (!nome || preco == null) {
    return res.status(400).json({ error: "Dados incompletos" });
  }

  const query =
    "INSERT INTO produtos (nome, quantidade, preco) VALUES (?, ?, ?)";
  const params = [nome, 0, preco];

  db.run(query, params, function (err) {
    if (err) {
      return res.status(500).json({ error: "Erro ao inserir produto" });
    }
    res.status(201).json({ id: this.lastID, nome, quantidade: 0, preco });
  });
});

// Listar todos os produtos
app.get("/produtos", (req, res) => {
  db.all("SELECT * FROM produtos", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao buscar produtos" });
    }
    res.json(rows);
  });
});

// Editar produto
app.put("/produtos/:id", (req, res) => {
  const { id } = req.params;
  const { nome, quantidade, preco } = req.body;

  if (!nome || quantidade == null || preco == null) {
    return res.status(400).json({ error: "Dados incompletos" });
  }

  const query =
    "UPDATE produtos SET nome = ?, quantidade = ?, preco = ? WHERE id = ?";
  const params = [nome, quantidade, preco, id];

  db.run(query, params, function (err) {
    if (err) {
      return res.status(500).json({ error: "Erro ao atualizar produto" });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    res.json({ message: "Produto atualizado com sucesso" });
  });
});

// Deletar produto
app.delete("/produtos/:id", (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM produtos WHERE id = ?", [id], function (err) {
    if (err) {
      return res.status(500).json({ error: "Erro ao deletar produto" });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    res.json({ message: "Produto deletado com sucesso" });
  });
});

// Movimentação (entrada/saída)
app.post("/movimentacoes", (req, res) => {
  const { produto_id, tipo, quantidade } = req.body;

  if (
    produto_id == null ||
    !["entrada", "saida"].includes(tipo) ||
    quantidade == null ||
    isNaN(quantidade)
  ) {
    return res.status(400).json({ error: "Dados inválidos ou incompletos" });
  }

  const id = parseInt(produto_id);
  const qtd = parseInt(quantidade);
  const dataAtual = new Date().toISOString();

  // Buscar o produto atual
  db.get("SELECT * FROM produtos WHERE id = ?", [id], (err, produto) => {
    if (err || !produto) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    let novaQuantidade =
      tipo === "entrada" ? produto.quantidade + qtd : produto.quantidade - qtd;

    if (novaQuantidade < 0) {
      return res.status(400).json({ error: "Estoque insuficiente" });
    }

    // Atualizar quantidade
    db.run(
      "UPDATE produtos SET quantidade = ? WHERE id = ?",
      [novaQuantidade, id],
      function (err) {
        if (err) {
          return res.status(500).json({ error: "Erro ao atualizar estoque" });
        }

        // Registrar movimentação
        db.run(
          "INSERT INTO movimentacoes (produto_id, tipo, quantidade, data) VALUES (?, ?, ?, ?)",
          [id, tipo, qtd, dataAtual],
          function (err) {
            if (err) {
              return res
                .status(500)
                .json({ error: "Erro ao registrar movimentação" });
            }

            res.json({ message: "Movimentação registrada com sucesso" });
          }
        );
      }
    );
  });
});

// Listar movimentações (extra opcional)
app.get("/movimentacoes/:produto_id", (req, res) => {
  const { produto_id } = req.params;

  db.all(
    "SELECT * FROM movimentacoes WHERE produto_id = ? ORDER BY data DESC",
    [produto_id],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: "Erro ao buscar movimentações" });
      }
      res.json(rows);
    }
  );
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
