const API_URL = "http://localhost:3000/produtos";

document.addEventListener("DOMContentLoaded", listarProdutos);

const form = document.getElementById("produto-form");
let produtoEditandoId = null;

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const quantidade = Number(document.getElementById("quantidade").value);
  const preco = Number(document.getElementById("preco").value);

  const produto = { nome, quantidade, preco };

  if (produtoEditandoId) {
    // Atualizar produto
    await fetch(`${API_URL}/${produtoEditandoId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(produto),
    });
    produtoEditandoId = null;
  } else {
    // Adicionar novo produto
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(produto),
    });
  }

  form.reset();
  listarProdutos();
});

async function listarProdutos() {
  const resposta = await fetch(API_URL);
  const produtos = await resposta.json();

  const tbody = document.querySelector("#tabela-produtos tbody");
  tbody.innerHTML = "";

  produtos.forEach((produto) => {
    const linha = document.createElement("tr");
    linha.innerHTML = `
      <td>${produto.id}</td>
      <td>${produto.nome}</td>
      <td>${produto.quantidade}</td>
      <td>R$ ${produto.preco.toFixed(2)}</td>
      <td>
        <button onclick="editarProduto(${produto.id}, '${produto.nome}', ${
      produto.quantidade
    }, ${produto.preco})">Editar</button>
        <button onclick="deletarProduto(${produto.id})">Excluir</button>
      </td>
    `;
    tbody.appendChild(linha);
  });
}

function editarProduto(id, nome, quantidade, preco) {
  document.getElementById("nome").value = nome;
  document.getElementById("quantidade").value = quantidade;
  document.getElementById("preco").value = preco;
  produtoEditandoId = id;
}

async function deletarProduto(id) {
  if (confirm("Tem certeza que deseja excluir este produto?")) {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    listarProdutos();
  }
}
