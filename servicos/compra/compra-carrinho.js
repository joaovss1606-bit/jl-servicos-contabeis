// LÓGICA DE CARRINHO PARA MÚLTIPLOS SERVIÇOS - VERSÃO FINAL COM VALIDAÇÃO ABSOLUTA

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const isCarrinho = params.get("carrinho") === "1";

  if (!isCarrinho) {
    return;
  }

  const form = document.getElementById("pedidoForm");
  const botao = document.getElementById("btnEnviar");
  const btnAdicionarMais = document.getElementById("btnAdicionarMais");

  const carrinho = JSON.parse(localStorage.getItem('carrinhoServicos')) || [];

  if (!form || !botao || !btnAdicionarMais) {
    console.error('Elementos não encontrados');
    return;
  }

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

  // Preencher resumo do carrinho
  const carrinhoResumo = document.getElementById('carrinhoResumo');
  if (carrinhoResumo) {
    carrinhoResumo.innerHTML = carrinho.map((item) => `
      <div style="padding: 12px; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; align-items: center;">
        <div>
          <strong style="color: #bd9617;">${item.titulo}</strong>
          <div style="font-size: 0.8rem; color: #888;">${item.valor}</div>
        </div>
      </div>
    `).join('');
  }

  // VALIDAÇÃO ABSOLUTA - Função que valida TUDO
  function validarFormularioAbsoluto() {
    const nomeInput = document.getElementById("nome");
    const emailInput = document.getElementById("email");
    const whatsappInput = document.getElementById("whatsapp");
    const cpfInput = document.getElementById("cpf");

    if (!nomeInput || !emailInput || !whatsappInput || !cpfInput) {
      botao.disabled = true;
      btnAdicionarMais.disabled = true;
      return;
    }

    const nome = nomeInput.value.trim();
    const email = emailInput.value.trim();
    const whatsapp = whatsappInput.value.replace(/\D/g, "");
    const cpf = cpfInput.value.replace(/\D/g, "");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nomeOk = nome.split(" ").length >= 2 && nome.length > 0;
    const emailOk = emailRegex.test(email);
    const whatsappOk = whatsapp.length === 11;
    const cpfOk = cpf.length === 11;
    const todosOk = nomeOk && emailOk && whatsappOk && cpfOk;

    // FORÇAR A ATUALIZAÇÃO DOS BOTÕES
    botao.disabled = !todosOk;
    btnAdicionarMais.disabled = !todosOk;

    console.log('Validação:', { nomeOk, emailOk, whatsappOk, cpfOk, todosOk, btnDisabled: botao.disabled });
  }

  // Handlers de formatação
  const handleWhatsApp = (e) => {
    let v = e.target.value.replace(/\D/g, "");
    if (v.length > 11) v = v.slice(0, 11);
    v = v.replace(/^(\d{2})(\d)/g, "($1) $2");
    v = v.replace(/(\d{5})(\d)/, "$1-$2");
    e.target.value = v;
    validarFormularioAbsoluto();
  };

  const handleCPF = (e) => {
    let v = e.target.value.replace(/\D/g, "");
    if (v.length > 11) v = v.slice(0, 11);
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    e.target.value = v;
    validarFormularioAbsoluto();
  };

  // Adicionar listeners a TODOS os campos
  const inputWhatsApp = document.getElementById("whatsapp");
  const inputCPF = document.getElementById("cpf");
  const inputNome = document.getElementById("nome");
  const inputEmail = document.getElementById("email");

  if (inputWhatsApp) {
    inputWhatsApp.addEventListener("input", handleWhatsApp);
    inputWhatsApp.addEventListener("change", validarFormularioAbsoluto);
    inputWhatsApp.addEventListener("blur", validarFormularioAbsoluto);
  }

  if (inputCPF) {
    inputCPF.addEventListener("input", handleCPF);
    inputCPF.addEventListener("change", validarFormularioAbsoluto);
    inputCPF.addEventListener("blur", validarFormularioAbsoluto);
  }

  if (inputNome) {
    inputNome.addEventListener("input", validarFormularioAbsoluto);
    inputNome.addEventListener("change", validarFormularioAbsoluto);
    inputNome.addEventListener("blur", validarFormularioAbsoluto);
  }

  if (inputEmail) {
    inputEmail.addEventListener("input", validarFormularioAbsoluto);
    inputEmail.addEventListener("change", validarFormularioAbsoluto);
    inputEmail.addEventListener("blur", validarFormularioAbsoluto);
  }

  // Adicionar listeners a TODOS os inputs do formulário
  const inputs = form.querySelectorAll('input, textarea');
  inputs.forEach(el => {
    el.addEventListener("input", validarFormularioAbsoluto);
    el.addEventListener("change", validarFormularioAbsoluto);
    el.addEventListener("blur", validarFormularioAbsoluto);
    el.addEventListener("keyup", validarFormularioAbsoluto);
  });

  // Validação inicial IMEDIATA
  validarFormularioAbsoluto();

  // Validação periódica a cada 100ms para garantir
  const intervalValidacao = setInterval(() => {
    validarFormularioAbsoluto();
  }, 100);

  // Botão "Adicionar mais serviços?"
  btnAdicionarMais.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    clearInterval(intervalValidacao);
    window.location.href = '/servicos/index.html';
  });

  // Enviar pedido (múltiplos serviços)
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearInterval(intervalValidacao);

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const whatsapp = document.getElementById("whatsapp").value;
    const cpf = document.getElementById("cpf").value;

    botao.classList.add("loading");
    botao.disabled = true;
    botao.innerHTML = `<i class="fas fa-circle-notch fa-spin"></i> Enviando pedidos...`;

    try {
      if (typeof supabase !== 'undefined') {
        const SB_URL = 'https://qdgsmnfhpbkbovptwwjp.supabase.co';
        const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkZ3NtbmZocGJrYm92cHR3d2pwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxNTQ1MzYsImV4cCI6MjA4MzczMDUzNn0.-fpxGBv738LflicnI2edM7ywwAmed3Uka4111fzTj8c';
        const client = supabase.createClient(SB_URL, SB_KEY);

        const { data: { session } } = await client.auth.getSession();

        if (session) {
          await client.from('profiles').update({
            nome: nome,
            whatsapp: whatsapp,
            cpf_cnpj: cpf
          }).eq('id', session.user.id);

          for (const item of carrinho) {
            const payload = {
              cliente_id: session.user.id,
              plano_id: item.servico,
              status: 'Pendente'
            };

            await client.from('assinaturas').insert(payload);
          }
        }
      }
    } catch (err) {
      console.error("Erro fatal no Supabase:", err);
    }

    const listaServicos = carrinho.map(item => `  • ${item.titulo} (${item.valor})`).join('\n');
    const mensagem =
`🚀 *NOVO PEDIDO - JL SERVIÇOS*
👤 *DADOS DO CLIENTE:*
📝 *Nome:* ${nome}
📱 *WhatsApp:* ${whatsapp}
📧 *E-mail:* ${email}
🆔 *CPF:* ${cpf}

🛠️ *SERVIÇOS SOLICITADOS:*
${listaServicos}

💬 *Obs:* ${document.getElementById("observacoes")?.value || "Nenhuma"}`;

    setTimeout(() => {
      const urlWhatsApp = `https://wa.me/5561920041427?text=${encodeURIComponent(mensagem)}`;
      window.open(urlWhatsApp, "_blank");

      localStorage.removeItem('carrinhoServicos');

      setTimeout(() => {
        botao.classList.remove("loading");
        botao.disabled = false;
        botao.innerHTML = `Confirmar e Enviar via WhatsApp <i class="fab fa-whatsapp"></i>`;
        window.location.href = '/servicos/area_do_cliente/dashboard.html';
      }, 2000);
    }, 1200);
  });
});
