// script.js

const API_URL = "http://localhost:3000/produtos"; // Altere para sua API se necessário

const tabela = document.getElementById("tabela-body");
const form = document.getElementById("produto-form");
const toast = document.getElementById("toast");
const filtroInput = document.getElementById("filtro");
const toggleTema = document.getElementById("toggle-tema");
const toggleSidebar = document.getElementById("toggle-sidebar");
const sidebar = document.getElementById("sidebar");

function showToast(msg, isErro = false) {
  toast.textContent = msg;
  toast.className = `toast show${isErro ? " error" : ""}`;
  setTimeout(() => toast.className = "toast", 3000);
}

function carregarProdutos() {
  fetch(API_URL)
    .then(res => res.json())
    .then(produtos => {
      tabela.innerHTML = "";
      produtos.forEach(p => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${p.id}</td>
          <td>${p.nome}</td>
          <td>${p.quantidade}</td>
          <td>R$ ${p.preco.toFixed(2)}</td>
          <td>
            <button class="edit" onclick="editarProduto(${p.id}, '${p.nome}', ${p.quantidade}, ${p.preco})">Editar</button>
            <button class="delete" onclick="deletarProduto(${p.id})">Excluir</button>
          </td>
        `;
        tabela.appendChild(tr);
      });
      atualizarContadores(produtos);
    })
    .catch(() => showToast("Erro ao carregar produtos", true));
}

function atualizarContadores(produtos) {
  document.getElementById("total-produtos").textContent = produtos.length;
  const baixos = produtos.filter(p => p.quantidade <= 5).length;
  document.getElementById("baixo-estoque").textContent = baixos;
}

form.addEventListener("submit", e => {
  e.preventDefault();
  const nome = document.getElementById("nome").value.trim();
  const quantidade = parseInt(document.getElementById("quantidade").value);
  const preco = parseFloat(document.getElementById("preco").value);

  if (!nome || quantidade < 0 || preco < 0) {
    showToast("Preencha todos os campos corretamente", true);
    return;
  }

  fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, quantidade, preco })
  })
    .then(res => res.json())
    .then(() => {
      form.reset();
      carregarProdutos();
      showToast("Produto adicionado com sucesso!");
    })
    .catch(() => showToast("Erro ao adicionar produto", true));
});

function deletarProduto(id) {
  if (!confirm("Tem certeza que deseja excluir este produto?")) return;
  fetch(`${API_URL}/${id}`, { method: "DELETE" })
    .then(res => res.json())
    .then(() => {
      carregarProdutos();
      showToast("Produto excluído com sucesso!");
    })
    .catch(() => showToast("Erro ao excluir produto", true));
}

function editarProduto(id, nome, quantidade, preco) {
  document.getElementById("nome").value = nome;
  document.getElementById("quantidade").value = quantidade;
  document.getElementById("preco").value = preco;

  form.removeEventListener("submit", salvarNovo);
  form.addEventListener("submit", salvarEdicao);

  function salvarEdicao(e) {
    e.preventDefault();
    const nome = document.getElementById("nome").value.trim();
    const quantidade = parseInt(document.getElementById("quantidade").value);
    const preco = parseFloat(document.getElementById("preco").value);

    fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, quantidade, preco })
    })
      .then(res => res.json())
      .then(() => {
        form.reset();
        carregarProdutos();
        showToast("Produto atualizado com sucesso!");
        form.removeEventListener("submit", salvarEdicao);
        form.addEventListener("submit", salvarNovo);
      })
      .catch(() => showToast("Erro ao atualizar produto", true));
  }
}

function salvarNovo(e) {
  e.preventDefault();
}

filtroInput.addEventListener("input", () => {
  const filtro = filtroInput.value.toLowerCase();
  Array.from(tabela.children).forEach(row => {
    const nome = row.children[1].textContent.toLowerCase();
    row.style.display = nome.includes(filtro) ? "table-row" : "none";
  });
});

// Aplicar modo escuro salvo ao carregar
if (localStorage.getItem("tema") === "dark") {
  document.body.classList.add("dark");
  toggleTema.querySelector("i").className = "fas fa-sun";
}

// Alternar tema e salvar no localStorage
toggleTema.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const modo = document.body.classList.contains("dark") ? "dark" : "light";
  localStorage.setItem("tema", modo);

  const icone = toggleTema.querySelector("i");
  icone.className = modo === "dark" ? "fas fa-sun" : "fas fa-moon";
});

toggleSidebar.addEventListener("click", () => {
  sidebar.classList.toggle("hidden");
});

carregarProdutos();
