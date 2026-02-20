// GERENCIAMENTO DO CARRINHO DE SERVIÇOS
function adicionarAoCarrinho(categoria, servico, titulo, valor) {
  let carrinho = JSON.parse(localStorage.getItem('carrinhoServicos')) || [];
  carrinho.push({ categoria, servico, titulo, valor, id: Date.now() });
  localStorage.setItem('carrinhoServicos', JSON.stringify(carrinho));
  atualizarCarrinho();
}

function atualizarCarrinho() {
  const carrinho = JSON.parse(localStorage.getItem('carrinhoServicos')) || [];
  const carrinhoFlutante = document.getElementById('carrinhoFlutante');
  const carrinhoLista = document.getElementById('carrinhoLista');

  if (carrinho.length === 0) {
    carrinhoFlutante.style.display = 'none';
    return;
  }

  carrinhoFlutante.style.display = 'flex';
  carrinhoLista.innerHTML = carrinho.map((item) => `
    <div class="carrinho-item">
      <div class="carrinho-item-info">
        <strong style="color: #bd9617;">${item.titulo}</strong>
        <small style="color: #888;">${item.valor}</small>
      </div>
      <button onclick="removerDoCarrinho(${item.id})" style="background: none; border: none; color: #ff4444; cursor: pointer; font-size: 0.9rem;">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `).join('');
}

function removerDoCarrinho(id) {
  let carrinho = JSON.parse(localStorage.getItem('carrinhoServicos')) || [];
  carrinho = carrinho.filter(item => item.id !== id);
  localStorage.setItem('carrinhoServicos', JSON.stringify(carrinho));
  atualizarCarrinho();
}

function limparCarrinho() {
  if (confirm('Tem certeza que deseja limpar todos os serviços?')) {
    localStorage.removeItem('carrinhoServicos');
    atualizarCarrinho();
  }
}

function fecharCarrinho() {
  document.getElementById('carrinhoFlutante').style.display = 'none';
}

async function finalizarCarrinho() {
  const carrinho = JSON.parse(localStorage.getItem('carrinhoServicos')) || [];
  if (carrinho.length === 0) {
    alert('Seu carrinho está vazio!');
    return;
  }

  const client = initSupabase();
  if (!client) {
    window.location.href = '/servicos/area_do_cliente/index.html';
    return;
  }

  const { data: { session } } = await client.auth.getSession();
  if (!session) {
    window.location.href = '/servicos/area_do_cliente/index.html';
    return;
  }

  window.location.href = '/servicos/compra/index.html?carrinho=1';
}

// Interceptar cliques em links de serviço
document.addEventListener('click', function(e) {
  const link = e.target.closest('a[href*="/servicos/area_do_cliente/index.html"]');
  if (!link) return;

  const url = new URL(link.href, window.location.origin);
  const categoria = url.searchParams.get('categoria');
  const servico = url.searchParams.get('servico');

  if (!categoria || !servico) return;

  const card = link.closest('.service-card') || link.closest('.service-link-card') || link.closest('[style*="background:#0e2a47"]');
  if (!card) return;

  const spans = card.querySelectorAll('span');
  let titulo = '';
  let valor = '';

  if (spans.length >= 3) {
    titulo = spans[0]?.textContent?.trim() || '';
    valor = spans[1]?.textContent?.trim() || '';
  }

  if (!titulo || !valor) return;

  const client = initSupabase();
  if (!client) return;

  client.auth.getSession().then(({ data: { session } }) => {
    if (!session) return;

    e.preventDefault();
    const resposta = confirm('Deseja adicionar "' + titulo + '" ao carrinho?\n\nClique OK para adicionar, ou Cancelar para ir direto para compra.');
    if (resposta) {
      adicionarAoCarrinho(categoria, servico, titulo, valor);
    } else {
      window.location.href = link.href;
    }
  });
});

// Atualizar carrinho ao carregar a página
document.addEventListener('DOMContentLoaded', atualizarCarrinho);
