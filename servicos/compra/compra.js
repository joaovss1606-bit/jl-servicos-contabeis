document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("pedidoForm");
  const botao = document.getElementById("btnEnviar");
  const camposObrigatorios = ["nome", "whatsapp", "email", "cpf"];
  const BASE_URL = "/jl-servicos-contabeis";

  const servicosMock = {
    mei: {
      basico: { titulo: "Plano MEI — Básico", categoriaLabel: "MEI", valor: "R$ 99,99", descricao: "Plano básico para manter seu MEI regularizado mensalmente.", inclusos: ["Emissão mensal do DAS", "Lembretes de vencimento", "DASN-SIMEI (1x ao ano)", "Suporte via WhatsApp"] },
      premium: { titulo: "Plano MEI — Premium", categoriaLabel: "MEI", valor: "R$ 159,99", descricao: "Plano completo com acompanhamento e regularização total do MEI.", inclusos: ["Todos os benefícios do plano básico", "Regularização fiscal", "Parcelamento de débitos", "Emissão de certidões", "Suporte prioritário"] },
      "abertura-mei": { titulo: "Abertura de MEI", categoriaLabel: "MEI", valor: "R$ 148,99", descricao: "Abertura completa do MEI com orientação inicial.", inclusos: ["Cadastro no Portal do Empreendedor", "Emissão de CNPJ", "Orientação inicial"] },
      "regularizacao-mei": { titulo: "Regularização de MEI", categoriaLabel: "MEI", valor: "R$ 198,99", descricao: "Regularização de pendências fiscais e cadastrais do MEI.", inclusos: ["Análise de pendências", "Regularização fiscal", "Orientação corretiva"] },
      "encerramento-mei": { titulo: "Encerramento de MEI", categoriaLabel: "MEI", valor: "R$ 128,99", descricao: "Baixa completa do MEI junto aos órgãos oficiais.", inclusos: ["Encerramento no portal", "Baixa do CNPJ", "Orientação final"] },
      "emissao-das": { titulo: "Emissão de DAS", categoriaLabel: "MEI", valor: "R$ 48,99", descricao: "Emissão da guia DAS do MEI.", inclusos: ["Cálculo do imposto", "Emissão da guia"] },
      dasn: { titulo: "Declaração Anual do MEI (DASN-SIMEI)", categoriaLabel: "MEI", valor: "R$ 98,99", descricao: "Envio da declaração anual obrigatória do MEI.", inclusos: ["Apuração do faturamento", "Envio da declaração"] },
      parcelamento: { titulo: "Parcelamento de Débitos do MEI", categoriaLabel: "MEI", valor: "R$ 178,99", descricao: "Parcelamento de débitos em atraso do MEI.", inclusos: ["Análise da dívida", "Simulação e parcelamento"] },
      "alteracao-mei": { titulo: "Alteração de Dados do MEI", categoriaLabel: "MEI", valor: "R$ 78,99", descricao: "Alteração de dados cadastrais do MEI.", inclusos: ["Alteração no cadastro", "Confirmação das mudanças"] }
    },
    "pessoa-fisica": {
      irpf: { titulo: "Declaração de Imposto de Renda (IRPF)", categoriaLabel: "Pessoa Física", valor: "R$ 139,99", descricao: "Elaboração e envio da declaração de Imposto de Renda Pessoa Física.", inclusos: ["Análise de documentos", "Apuração de imposto", "Envio da declaração"] }
    },
    contabeis: {
      "consultoria-contabil": { titulo: "Consultoria Contábil", categoriaLabel: "Serviços Contábeis", valor: "R$ 199,99", descricao: "Consultoria contábil personalizada para empresas e profissionais.", inclusos: ["Análise contábil", "Orientação estratégica"] }
    },
    "certidoes-regularizacoes": {
      "certidao-negativa": { titulo: "Certidão Negativa de Débitos", categoriaLabel: "Certidões e Regularizações", valor: "R$ 79,99", descricao: "Emissão de certidão negativa junto aos órgãos competentes.", inclusos: ["Consulta de pendências", "Emissão da certidão"] }
    },
    outros: {
      "planilha-financeira": { titulo: "Planilha Financeira Pessoal", categoriaLabel: "Outros Serviços", valor: "R$ 59,99", descricao: "Planilha personalizada para controle financeiro mensal.", inclusos: ["Planilha personalizada", "Orientação de uso"] }
    }
  };

  // Aliases para compatibilidade de rotas
  servicosMock["outros-servicos"] = servicosMock.outros;
  servicosMock["certidoes"] = servicosMock["certidoes-regularizacoes"];

  const params = new URLSearchParams(window.location.search);
  const cat = params.get("categoria");
  const serv = params.get("servico") || params.get("plano") || params.get("slug");
  const dados = servicosMock[cat]?.[serv];

  if (!dados) {
    console.error("Serviço não encontrado na URL.");
    return;
  }

  // Preenche Interface
  document.getElementById("nomeServico").innerText = dados.titulo;
  document.getElementById("descricaoServico").innerText = dados.descricao;
  document.getElementById("valorServico").innerText = dados.valor;
  document.getElementById("inclusosServico").innerHTML = dados.inclusos.map(i => `<li>${i}</li>`).join("");

  // Breadcrumb Dinâmico
  const bread = document.getElementById("breadcrumb");
  if (bread) {
    bread.innerHTML = `<a href="${BASE_URL}/">Início</a> <span>›</span> <a href="${BASE_URL}/">Serviços</a> <span>›</span> <strong>${dados.titulo}</strong>`;
  }

  // Máscaras (WhatsApp e CPF)
  const mask = (el, fn) => el.addEventListener("input", (e) => { e.target.value = fn(e.target.value); validarFormulario(); });
  
  mask(document.getElementById("whatsapp"), v => {
    v = v.replace(/\D/g, "").slice(0, 11);
    if (v.length > 2) v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
    if (v.length > 7) v = `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
    return v;
  });

  mask(document.getElementById("cpf"), v => {
    v = v.replace(/\D/g, "").slice(0, 11);
    if (v.length > 3) v = v.slice(0, 3) + "." + v.slice(3);
    if (v.length > 6) v = v.slice(0, 7) + "." + v.slice(7);
    if (v.length > 9) v = v.slice(0, 11) + "-" + v.slice(11);
    return v;
  });

  function validarFormulario() {
    const email = document.getElementById("email").value;
    const ok = camposObrigatorios.every(id => document.getElementById(id).value.length > 5) && email.includes("@");
    botao.disabled = !ok || botao.classList.contains("btn-loading");
  }

  document.getElementById("nome").addEventListener("input", validarFormulario);
  document.getElementById("email").addEventListener("input", validarFormulario);

  // Envio Final
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    botao.classList.add("btn-loading");
    botao.disabled = true;
    const originalText = botao.innerHTML;
    botao.innerHTML = `<span class="spinner"></span> Enviando...`;

    const obs = document.getElementById("observacoes").value.trim() || "Nenhuma";
    
    const msg = `🚀 *NOVO PEDIDO DE SERVIÇO*

🛠️ *Serviço:* ${dados.titulo}
💰 *Valor:* ${dados.valor}

👤 *DADOS DO CLIENTE:*
📝 *Nome:* ${document.getElementById("nome").value}
📱 *WhatsApp:* ${document.getElementById("whatsapp").value}
📧 *E-mail:* ${document.getElementById("email").value}
🆔 *CPF:* ${document.getElementById("cpf").value}
💬 *Obs:* ${obs}`.trim();

    window.open(`https://wa.me/5561920041427?text=${encodeURIComponent(msg)}`, "_blank");

    setTimeout(() => {
      botao.classList.remove("btn-loading");
      botao.innerHTML = originalText;
      validarFormulario();
    }, 3000);
  });
});
