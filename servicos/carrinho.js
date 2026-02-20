// GERENCIAMENTO DO CARRINHO DE SERVIÇOS - VERSÃO FINAL ROBUSTA

// Inicializar estilos do Modal
const styleModal = document.createElement('style');
styleModal.textContent = `
  #modalConfirmacao {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
  }

  .modal-overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(5px);
    align-items: center;
    justify-content: center;
    z-index: 9999;
  }

  .modal-content {
    background: rgba(10, 25, 47, 0.95);
    border: 2px solid #bd9617;
    border-radius: 20px;
    padding: 40px;
    max-width: 450px;
    width: 90%;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(10px);
    animation: slideIn 0.3s ease-out;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .modal-buttons {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  .modal-btn {
    flex: 1;
    min-width: 120px;
    padding: 12px 20px;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.95rem;
    cursor: pointer;
    transition: 0.3s;
    font-family: 'Montserrat', sans-serif;
  }

  .modal-btn-confirm {
    background: #bd9617;
    color: white;
  }

  .modal-btn-confirm:hover {
    background: #a68414;
    transform: translateY(-2px);
  }

  .modal-btn-cancel {
    background: rgba(255, 68, 68, 0.2);
    color: #ff6b6b;
    border: 1px solid #ff6b6b;
  }

  .modal-btn-cancel:hover {
    background: rgba(255, 68, 68, 0.3);
    transform: translateY(-2px);
  }

  @media (max-width: 600px) {
    .modal-content {
      padding: 30px 20px;
      max-width: 90%;
    }

    .modal-btn {
      min-width: 100px;
      padding: 10px 15px;
      font-size: 0.9rem;
    }
  }
`;
document.head.appendChild(styleModal);

// Modal de Confirmação Personalizado
function mostrarModalConfirmacao(titulo, mensagem, onConfirm, onCancel = null) {
  let modal = document.getElementById('modalConfirmacao');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modalConfirmacao';
    modal.innerHTML = `
      <div class="modal-overlay" id="modalOverlay">
        <div class="modal-content">
          <h2 id="modalTitulo" style="color: #bd9617; font-family: 'Playfair Display', serif; margin-bottom: 15px; font-size: 1.5rem;"></h2>
          <p id="modalMensagem" style="color: rgba(255,255,255,0.9); margin-bottom: 30px; line-height: 1.6; white-space: pre-wrap;"></p>
          <div class="modal-buttons">
            <button id="modalConfirm" class="modal-btn modal-btn-confirm">Confirmar</button>
            <button id="modalCancel" class="modal-btn modal-btn-cancel">Cancelar</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  document.getElementById('modalTitulo').textContent = titulo;
  document.getElementById('modalMensagem').textContent = mensagem;
  document.getElementById('modalOverlay').style.display = 'flex';

  const btnConfirm = document.getElementById('modalConfirm');
  const btnCancel = document.getElementById('modalCancel');
  const overlay = document.getElementById('modalOverlay');

  // Remover listeners antigos
  const newConfirm = btnConfirm.cloneNode(true);
  const newCancel = btnCancel.cloneNode(true);
  btnConfirm.parentNode.replaceChild(newConfirm, btnConfirm);
  btnCancel.parentNode.replaceChild(newCancel, btnCancel);

  const fecharModal = () => {
    overlay.style.display = 'none';
  };

  const handleConfirm = () => {
    fecharModal();
    if (onConfirm) onConfirm();
  };

  const handleCancel = () => {
    fecharModal();
    if (onCancel) onCancel();
  };

  const handleOverlayClick = (e) => {
    if (e.target === overlay) {
      fecharModal();
    }
  };

  document.getElementById('modalConfirm').addEventListener('click', handleConfirm);
  document.getElementById('modalCancel').addEventListener('click', handleCancel);
  overlay.addEventListener('click', handleOverlayClick);
}

// Funções de Carrinho
function adicionarAoCarrinho(categoria, servico, titulo, valor) {
  let carrinho = JSON.parse(localStorage.getItem('carrinhoServicos')) || [];
  carrinho.push({ categoria, servico, titulo, valor, id: Date.now() });
  localStorage.setItem('carrinhoServicos', JSON.stringify(carrinho));
  atualizarCarrinho();
  console.log('Serviço adicionado ao carrinho:', { categoria, servico, titulo, valor });
}

function atualizarCarrinho() {
  const carrinho = JSON.parse(localStorage.getItem('carrinhoServicos')) || [];
  const carrinhoFlutante = document.getElementById('carrinhoFlutante');
  const carrinhoLista = document.getElementById('carrinhoLista');

  if (!carrinhoFlutante || !carrinhoLista) return;

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
  mostrarModalConfirmacao('Limpar Carrinho', 'Tem certeza que deseja limpar todos os serviços?', () => {
    localStorage.removeItem('carrinhoServicos');
    atualizarCarrinho();
  });
}

function fecharCarrinho() {
  const carrinhoFlutante = document.getElementById('carrinhoFlutante');
  if (carrinhoFlutante) {
    carrinhoFlutante.style.display = 'none';
  }
}

async function finalizarCarrinho() {
  const carrinho = JSON.parse(localStorage.getItem('carrinhoServicos')) || [];
  if (carrinho.length === 0) {
    mostrarModalConfirmacao('Carrinho Vazio', 'Seu carrinho está vazio! Selecione um serviço para continuar.');
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
document.addEventListener('click', async function(e) {
  const link = e.target.closest('a[href*="/servicos/area_do_cliente/index.html"]');
  if (!link) return;

  const url = new URL(link.href, window.location.origin);
  const categoria = url.searchParams.get('categoria');
  const servico = url.searchParams.get('servico');

  if (!categoria || !servico) return;

  // Extrair dados do card
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

  e.preventDefault();
  e.stopPropagation();

  const { data: { session } } = await client.auth.getSession();

  if (session) {
    // Usuário logado: mostrar opção de adicionar ao carrinho ou ir direto para compra
    mostrarModalConfirmacao(
      'Adicionar ao Carrinho',
      'Deseja adicionar "' + titulo + '" ao carrinho?\n\nVocê poderá adicionar mais serviços depois.',
      () => {
        adicionarAoCarrinho(categoria, servico, titulo, valor);
      },
      () => {
        // Ir direto para compra (sem carrinho)
        window.location.href = link.href;
      }
    );
  } else {
    // Usuário não logado: mostrar opção de adicionar ao carrinho ou finalizar (ir para login)
    mostrarModalConfirmacao(
      'Adicionar ao Carrinho',
      'Deseja adicionar "' + titulo + '" ao carrinho?\n\nVocê poderá adicionar mais serviços antes de finalizar.',
      () => {
        adicionarAoCarrinho(categoria, servico, titulo, valor);
      },
      () => {
        // Ir para login/compra
        window.location.href = link.href;
      }
    );
  }
}, true); // Usar captura para interceptar antes dos handlers padrão

// Atualizar carrinho ao carregar a página
document.addEventListener('DOMContentLoaded', atualizarCarrinho);
