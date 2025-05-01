const API_URL = 'http://localhost:3000/produtos';
const form = document.getElementById('produto-form');
const tabelaBody = document.getElementById('tabela-body');
const totalProdutosEl = document.getElementById('total-produtos');
const filtroInput = document.getElementById('filtro');
const toast = document.getElementById('toast');

let produtoEditandoId = null;

// Toast
function mostrarToast(mensagem, tipo = 'sucesso') {
  toast.textContent = mensagem;
  toast.className = 'toast show' + (tipo === 'erro' ? ' error' : '');
  setTimeout(() => {
    toast.classList.remove('show', 'error');
  }, 3000);
}

// Carregar produtos
async function listarProdutos() {
  try {
    const res = await fetch(API_URL);
    const produtos = await res.json();

    tabelaBody.innerHTML = '';
    totalProdutosEl.textContent = produtos.length;

    produtos.forEach(produto => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${produto.id}</td>
        <td>${produto.nome}</td>
        <td>${produto.quantidade}</td>
        <td>R$ ${produto.preco.toFixed(2)}</td>
        <td>
          <button class="edit" onclick="editarProduto(${produto.id}, '${produto.nome}', ${produto.quantidade}, ${produto.preco})">Editar</button>
          <button class="delete" onclick="deletarProduto(${produto.id})">Excluir</button>
        </td>
      `;
      tabelaBody.appendChild(tr);
    });
  } catch (error) {
    mostrarToast('Erro ao carregar produtos.', 'erro');
  }
}

// Adicionar ou atualizar
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const nome = document.getElementById('nome').value.trim();
  const quantidade = Number(document.getElementById('quantidade').value);
  const preco = Number(document.getElementById('preco').value);

  if (!nome || quantidade <= 0 || preco <= 0) {
    mostrarToast('Preencha todos os campos corretamente.', 'erro');
    return;
  }

  const produto = { nome, quantidade, preco };

  try {
    if (produtoEditandoId) {
      await fetch(`${API_URL}/${produtoEditandoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(produto)
      });
      mostrarToast('Produto atualizado!');
      produtoEditandoId = null;
    } else {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(produto)
      });
      mostrarToast('Produto adicionado!');
    }
    form.reset();
    listarProdutos();
  } catch (error) {
    mostrarToast('Erro ao salvar produto.', 'erro');
  }
});

// Editar produto
function editarProduto(id, nome, quantidade, preco) {
  document.getElementById('nome').value = nome;
  document.getElementById('quantidade').value = quantidade;
  document.getElementById('preco').value = preco;
  produtoEditandoId = id;
}

// Deletar produto
async function deletarProduto(id) {
  const confirmar = confirm('Deseja mesmo excluir este produto?');
  if (!confirmar) return;
  try {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    mostrarToast('Produto excluído!');
    listarProdutos();
  } catch (error) {
    mostrarToast('Erro ao excluir produto.', 'erro');
  }
}

// Filtro
filtroInput.addEventListener('input', (e) => {
  const termo = e.target.value.toLowerCase();
  document.querySelectorAll('#tabela-body tr').forEach(linha => {
    const nome = linha.children[1].textContent.toLowerCase();
    linha.style.display = nome.includes(termo) ? '' : 'none';
  });
});

// Inicializar
listarProdutos();

// Modo escuro com persistência
const body = document.body;
const toggleTema = document.getElementById('toggle-tema');

if (localStorage.getItem('tema') === 'dark') {
  body.classList.add('dark');
}

toggleTema.addEventListener('click', () => {
  body.classList.toggle('dark');
  localStorage.setItem('tema', body.classList.contains('dark') ? 'dark' : 'light');
});


document.getElementById('toggle-sidebar').addEventListener('click', () => {
  document.querySelector('.sidebar').classList.toggle('hidden');
});

