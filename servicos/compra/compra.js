document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("pedidoForm");
  const botao = document.getElementById("btnEnviar");
  const camposObrigatorios = ["nome", "whatsapp", "email", "cpf"];
  const BASE_URL = "/jl-servicos-contabeis";

  // --- BASE DE DADOS (MOCK) ---
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
      irpf: { titulo: "Declaração de Imposto de Renda (IRPF)", categoriaLabel: "Pessoa Física", valor: "R$ 139,99", descricao: "Elaboração e envio da declaração de Imposto de Renda Pessoa Física.", inclusos: ["Análise de documentos", "Apuração de imposto", "Envio da declaração"] },
      "cpf-regularizacao": { titulo: "Regularização de CPF", categoriaLabel: "Pessoa Física", valor: "R$ 79,99", descricao: "Regularização de CPF suspenso ou pendente junto à Receita Federal.", inclusos: ["Consulta de pendências", "Protocolo de regularização", "Acompanhamento"] },
      "orientacao-fiscal-pf": { titulo: "Orientação Fiscal Pessoa Física", categoriaLabel: "Pessoa Física", valor: "R$ 119,99", descricao: "Consultoria para planejamento tributário de pessoas físicas.", inclusos: ["Análise de rendimentos", "Dicas de economia fiscal", "Suporte técnico"] }
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

  servicosMock["outros-servicos"] = servicosMock.outros;
  servicosMock["certidoes"] = servicosMock["certidoes-regularizacoes"];

  // --- CAPTURA DE PARÂMETROS DA URL ---
  const params = new URLSearchParams(window.location.search);
  const cat = params.get("categoria");
  const serv = params.get("servico") || params.get("plano") || params.get("slug");
  const dados = servicosMock[cat]?.[serv];

  if (!dados) {
      console.error("Dados do serviço não encontrados na URL.");
      return;
  }

  // --- PREENCHIMENTO AUTOMÁTICO ---
  const elNome = document.getElementById("nomeServico");
  const elDesc = document.getElementById("descricaoServico");
  const elValor = document.getElementById("valorServico");
  const elInclu = document.getElementById("inclusosServico");

  if(elNome) elNome.innerText = dados.titulo;
  if(elDesc) elDesc.innerText = dados.descricao;
  if(elValor) elValor.innerText = dados.valor;
  if(elInclu) elInclu.innerHTML = dados.inclusos.map(i => `<li>${i}</li>`).join("");

 // --- BREADCRUMB DINÂMICO NO COMPRA.JS ---
  const bread = document.getElementById("breadcrumb");
  if (bread) {
    bread.innerHTML = `
      <a href="${BASE_URL}/index.html">Início</a> <span>›</span> 
      <a href="${BASE_URL}/index.html#servicos">Serviços</a> <span>›</span> 
      <a href="${BASE_URL}/servicos/${cat}/index.html">${dados.categoriaLabel}</a> <span>›</span> 
      <strong>${dados.titulo}</strong>
    `;
  }

  // --- MÁSCARAS BLINDADAS ---
  const maskWhatsApp = (val) => {
    val = val.replace(/\D/g, "").slice(0, 11);
    if (val.length > 0) val = "(" + val;
    if (val.length > 3) val = val.slice(0, 3) + ") " + val.slice(3);
    if (val.length > 10) val = val.slice(0, 10) + "-" + val.slice(10);
    return val;
  };

  const maskCPF = (val) => {
    val = val.replace(/\D/g, "").slice(0, 11);
    if (val.length > 9) val = val.slice(0, 3) + "." + val.slice(3, 6) + "." + val.slice(6, 9) + "-" + val.slice(9);
    else if (val.length > 6) val = val.slice(0, 3) + "." + val.slice(3, 6) + "." + val.slice(6);
    else if (val.length > 3) val = val.slice(0, 3) + "." + val.slice(3);
    return val;
  };

  document.getElementById("whatsapp").addEventListener("input", (e) => {
    e.target.value = maskWhatsApp(e.target.value);
    validarFormulario();
  });

  document.getElementById("cpf").addEventListener("input", (e) => {
    e.target.value = maskCPF(e.target.value);
    validarFormulario();
  });

  // --- VALIDAÇÃO DO BOTÃO ---
  function validarFormulario() {
    const email = document.getElementById("email").value;
    const obrigatoriosOk = camposObrigatorios.every(id => document.getElementById(id).value.trim().length >= 3);
    const emailOk = email.includes("@") && email.includes(".");
    
    if (botao) {
        botao.disabled = !(obrigatoriosOk && emailOk) || botao.classList.contains("btn-loading");
    }
  }

  document.getElementById("nome").addEventListener("input", validarFormulario);
  document.getElementById("email").addEventListener("input", validarFormulario);

  // --- ENVIO WHATSAPP ---
  if (form) {
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (botao.classList.contains("btn-loading")) return;

        botao.classList.add("btn-loading");
        botao.disabled = true;
        const textoOriginal = botao.innerHTML;
        botao.innerHTML = `<span class="spinner"></span> Enviando pedido...`;

        const obs = document.getElementById("observacoes")?.value.trim() || "Nenhuma";
        
        const mensagem = 
`🚀 *NOVO PEDIDO DE SERVIÇO*

🛠️ *Serviço:* ${dados.titulo}
💰 *Valor:* ${dados.valor}

👤 *DADOS DO CLIENTE:*
📝 *Nome:* ${document.getElementById("nome").value}
📱 *WhatsApp:* ${document.getElementById("whatsapp").value}
📧 *E-mail:* ${document.getElementById("email").value}
🆔 *CPF:* ${document.getElementById("cpf").value}
💬 *Obs:* ${obs}`.trim();

        window.open(`https://wa.me/5561920041427?text=${encodeURIComponent(mensagem)}`, "_blank");

        setTimeout(() => {
          botao.classList.remove("btn-loading");
          botao.innerHTML = textoOriginal;
          validarFormulario();
        }, 3000);
    });
  }
});
