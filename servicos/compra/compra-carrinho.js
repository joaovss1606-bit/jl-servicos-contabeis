// LÓGICA DE CARRINHO - VERSÃO SIMPLES E ESTÁVEL

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const isCarrinho = params.get("carrinho") === "1";

  if (!isCarrinho) return;

  const form = document.getElementById("pedidoForm");
  const botao = document.getElementById("btnEnviar");
  const btnAdicionarMais = document.getElementById("btnAdicionarMais");

  if (!form || !botao || !btnAdicionarMais) return;

  const carrinho = JSON.parse(localStorage.getItem('carrinhoServicos')) || [];

  // Ocultar card de serviço único
  const serviceSummaryCard = document.querySelector('.service-summary-card');
  if (serviceSummaryCard) {
    serviceSummaryCard.style.display = 'none';
  }

  // Criar resumo do carrinho
  const resumoCarrinho = document.createElement('div');
  resumoCarrinho.className = 'service-summary-card';
  resumoCarrinho.innerHTML = `
    <h2 class="section-subtitle">Resumo do Carrinho</h2>
    <div id="carrinhoResumo" style="max-height: 300px; overflow-y: auto; border: 1px solid rgba(189, 150, 23, 0.2); border-radius: 8px; padding: 10px;"></div>
    <div class="price-box" style="margin-top: 20px;">
      <span>Total de Serviços:</span>
      <strong id="totalServicos">${carrinho.length}</strong>
    </div>
  `;

  const formCard = document.querySelector('.form-card');
  if (formCard && formCard.parentNode) {
    formCard.parentNode.insertBefore(resumoCarrinho, formCard);
  }

  // Preencher resumo
  const carrinhoResumo = document.getElementById('carrinhoResumo');
  if (carrinhoResumo) {
    carrinhoResumo.innerHTML = carrinho.map((item) => `
      <div style="padding: 12px; border-bottom: 1px solid rgba(255,255,255,0.1);">
        <strong style="color: #bd9617;">${item.titulo}</strong>
        <div style="font-size: 0.8rem; color: #888;">${item.valor}</div>
      </div>
    `).join('');
  }

  // Validação simples
  function validar() {
    const nome = (document.getElementById("nome")?.value || '').trim();
    const email = (document.getElementById("email")?.value || '').trim();
    const whatsapp = (document.getElementById("whatsapp")?.value || '').replace(/\D/g, '');
    const cpf = (document.getElementById("cpf")?.value || '').replace(/\D/g, '');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const ok = nome.split(' ').length >= 2 && emailRegex.test(email) && whatsapp.length === 11 && cpf.length === 11;

    botao.disabled = !ok;
    btnAdicionarMais.disabled = !ok;
  }

  // Formatadores
  document.getElementById("whatsapp")?.addEventListener("input", (e) => {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length > 11) v = v.slice(0, 11);
    v = v.replace(/^(\d{2})(\d)/g, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2');
    e.target.value = v;
    validar();
  });

  document.getElementById("cpf")?.addEventListener("input", (e) => {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length > 11) v = v.slice(0, 11);
    v = v.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    e.target.value = v;
    validar();
  });

  // Listeners
  form.querySelectorAll('input, textarea').forEach(el => {
    el.addEventListener('input', validar);
    el.addEventListener('change', validar);
  });

  // Validação inicial
  validar();

  // Botão adicionar mais
  btnAdicionarMais.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = '/servicos/index.html';
  });

  // Enviar
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const whatsapp = document.getElementById("whatsapp").value;
    const cpf = document.getElementById("cpf").value;

    botao.disabled = true;
    botao.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Enviando...';

    try {
      if (typeof supabase !== 'undefined') {
        const SB_URL = 'https://qdgsmnfhpbkbovptwwjp.supabase.co';
        const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkZ3NtbmZocGJrYm92cHR3d2pwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxNTQ1MzYsImV4cCI6MjA4MzczMDUzNn0.-fpxGBv738LflicnI2edM7ywwAmed3Uka4111fzTj8c';
        const client = supabase.createClient(SB_URL, SB_KEY);
        const { data: { session } } = await client.auth.getSession();

        if (session) {
          await client.from('profiles').update({
            nome, whatsapp, cpf_cnpj: cpf
          }).eq('id', session.user.id);

          for (const item of carrinho) {
            await client.from('assinaturas').insert({
              cliente_id: session.user.id,
              plano_id: item.servico,
              status: 'Pendente'
            });
          }
        }
      }
    } catch (err) {
      console.error(err);
    }

    const listaServicos = carrinho.map(item => `  • ${item.titulo} (${item.valor})`).join('\n');
    const obs = document.getElementById("observacoes")?.value || "Nenhuma";
    const mensagem = "🚀 *NOVO PEDIDO - JL SERVIÇOS*\n👤 *DADOS DO CLIENTE:*\n📝 *Nome:* " + nome + "\n📱 *WhatsApp:* " + whatsapp + "\n📧 *E-mail:* " + email + "\n🆔 *CPF:* " + cpf + "\n\n🛠️ *SERVIÇOS SOLICITADOS:*\n" + listaServicos + "\n\n💬 *Obs:* " + obs;

    setTimeout(() => {
      window.open(`https://wa.me/5561920041427?text=${encodeURIComponent(mensagem)}`, '_blank');
      localStorage.removeItem('carrinhoServicos');
      setTimeout(() => {
        window.location.href = '/servicos/area_do_cliente/dashboard.html';
      }, 1500);
    }, 800);
  });
});
