const API_URL = "http://localhost:3000/produtos";

document.addEventListener("DOMContentLoaded", listarProdutos);

const form = document.getElementById("produto-form");
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const quantidade = document.getElementById("quantidade").value;
  const preco = document.getElementById("preco").value;

  const novoProduto = {
    nome,
    quantidade: Number(quantidade),
    preco: Number(preco),
  };

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(novoProduto),
  });

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
    `;
    tbody.appendChild(linha);
  });
}
