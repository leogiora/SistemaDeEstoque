// script.js

const API_URL = "http://localhost:3000/produtos";
const MOV_URL = "http://localhost:3000/movimentacoes";

const tabela = document.getElementById("tabela-body");
const form = document.getElementById("produto-form");
const toast = document.getElementById("toast");
const filtroInput = document.getElementById("filtro");
const toggleTema = document.getElementById("toggle-tema");
const toggleSidebar = document.getElementById("toggle-sidebar");
const sidebar = document.getElementById("sidebar");

const modal = document.getElementById("modal-movimentacao");
const inputQtd = document.getElementById("quantidade-mov");
const btnConfirmar = document.getElementById("confirmar-mov");
const btnCancelar = document.getElementById("cancelar-mov");
let movProdutoId = null;
let movTipo = null;

let editandoId = null;

function showToast(msg, isErro = false) {
  toast.textContent = msg;
  toast.className = `toast show${isErro ? " error" : ""}`;
  setTimeout(() => (toast.className = "toast"), 3000);
}

function carregarProdutos() {
  fetch(API_URL)
    .then((res) => res.json())
    .then((produtos) => {
      tabela.innerHTML = "";
      produtos.forEach((p) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${p.id}</td>
          <td>${p.nome}</td>
          <td>${p.quantidade}</td>
          <td>R$ ${p.preco.toFixed(2)}</td>
          <td>
            <button class="btn-mov entrada" data-id="${
              p.id
            }" data-tipo="entrada">Entrada</button>
            <button class="btn-mov saida" data-id="${
              p.id
            }" data-tipo="saida">Saída</button>
            <button class="edit" onclick="editarProduto(${p.id}, '${p.nome}', ${
          p.quantidade
        }, ${p.preco})">Editar</button>
            <button class="delete" onclick="deletarProduto(${
              p.id
            })">Excluir</button>
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
  const baixos = produtos.filter((p) => p.quantidade <= 5).length;
  document.getElementById("baixo-estoque").textContent = baixos;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const quantidade = parseInt(document.getElementById("quantidade").value);
  const preco = parseFloat(document.getElementById("preco").value);

  if (!nome || quantidade < 0 || preco < 0) {
    showToast("Preencha todos os campos corretamente", true);
    return;
  }

  if (editandoId !== null) {
    fetch(`${API_URL}/${editandoId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, quantidade, preco }),
    })
      .then((res) => res.json())
      .then(() => {
        showToast("Produto atualizado com sucesso!");
        form.reset();
        carregarProdutos();
        editandoId = null;
      })
      .catch(() => showToast("Erro ao atualizar produto", true));
  } else {
    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, quantidade, preco }),
    })
      .then((res) => res.json())
      .then(() => {
        showToast("Produto adicionado com sucesso!");
        form.reset();
        carregarProdutos();
      })
      .catch(() => showToast("Erro ao adicionar produto", true));
  }
});

function editarProduto(id, nome, quantidade, preco) {
  document.getElementById("nome").value = nome;
  document.getElementById("quantidade").value = quantidade;
  document.getElementById("preco").value = preco;
  editandoId = id;
}

function deletarProduto(id) {
  if (!confirm("Tem certeza que deseja excluir este produto?")) return;
  fetch(`${API_URL}/${id}`, { method: "DELETE" })
    .then((res) => res.json())
    .then(() => {
      carregarProdutos();
      showToast("Produto excluído com sucesso!");
    })
    .catch(() => showToast("Erro ao excluir produto", true));
}

filtroInput.addEventListener("input", () => {
  const filtro = filtroInput.value.toLowerCase();
  Array.from(tabela.children).forEach((row) => {
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

// Modal movimentação

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-mov")) {
    movProdutoId = e.target.dataset.id;
    movTipo = e.target.dataset.tipo;
    document.getElementById(
      "modal-titulo"
    ).textContent = `Registrar ${movTipo}`;
    inputQtd.value = "";
    modal.classList.remove("hidden");
  }
});

btnConfirmar.addEventListener("click", async () => {
  const quantidade = parseInt(inputQtd.value);
  if (!quantidade || quantidade <= 0) {
    showToast("Informe uma quantidade válida", true);
    return;
  }

  const response = await fetch(MOV_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      produto_id: movProdutoId,
      tipo: movTipo,
      quantidade,
    }),
  });

  const data = await response.json();
  if (response.ok) {
    showToast(data.message);
    carregarProdutos();
  } else {
    showToast(data.error || "Erro ao registrar movimentação", true);
  }

  modal.classList.add("hidden");
});

btnCancelar.addEventListener("click", () => {
  modal.classList.add("hidden");
});

carregarProdutos();
