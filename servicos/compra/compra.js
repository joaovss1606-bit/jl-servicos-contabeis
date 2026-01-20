document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("pedidoForm");
  const botao = document.getElementById("btnEnviar");

  const camposObrigatorios = ["nome", "whatsapp", "email", "cpf"];

  const BASE_URL = "/jl-servicos-contabeis";

  /* =================================================
     🔹 DADOS MOCK (PADRÃO COM SLUG)
     🔹 TODO: substituir futuramente por Supabase
     ================================================= */
  const servicosMock = {
  mei: {
    basico: {
      titulo: "Plano MEI — Básico",
      descricao: "Plano básico para manter seu MEI regularizado mensalmente.",
      inclusos: [
        "Emissão mensal do DAS",
        "Lembretes de vencimento",
        "DASN-SIMEI (1x ao ano)",
        "Suporte via WhatsApp"
      ],
      valor: "R$ 99,99",
      categoriaLabel: "MEI"
    },

    premium: {
      titulo: "Plano MEI — Premium",
      descricao: "Plano completo com acompanhamento e regularização total do MEI.",
      inclusos: [
        "Todos os benefícios do plano básico",
        "Regularização fiscal",
        "Parcelamento de débitos",
        "Emissão de certidões",
        "Suporte prioritário"
      ],
      valor: "R$ 159,99",
      categoriaLabel: "MEI"
    },

    "abertura-mei": {
      titulo: "Abertura de MEI",
      descricao: "Abertura completa do MEI com orientação inicial.",
      inclusos: [
        "Cadastro no Portal do Empreendedor",
        "Emissão de CNPJ",
        "Orientação inicial"
      ],
      valor: "R$ 148,99",
      categoriaLabel: "MEI"
    },

    "regularizacao-mei": {
      titulo: "Regularização de MEI",
      descricao: "Regularização de pendências fiscais e cadastrais do MEI.",
      inclusos: [
        "Análise de pendências",
        "Regularização fiscal",
        "Orientação corretiva"
      ],
      valor: "R$ 198,99",
      categoriaLabel: "MEI"
    },

    "encerramento-mei": {
      titulo: "Encerramento de MEI",
      descricao: "Baixa completa do MEI junto aos órgãos oficiais.",
      inclusos: [
        "Encerramento no portal",
        "Baixa do CNPJ",
        "Orientação final"
      ],
      valor: "R$ 128,99",
      categoriaLabel: "MEI"
    },

    "emissao-das": {
      titulo: "Emissão de DAS",
      descricao: "Emissão da guia DAS do MEI.",
      inclusos: [
        "Cálculo do imposto",
        "Emissão da guia"
      ],
      valor: "R$ 48,99",
      categoriaLabel: "MEI"
    },

    dasn: {
      titulo: "Declaração Anual do MEI (DASN-SIMEI)",
      descricao: "Envio da declaração anual obrigatória do MEI.",
      inclusos: [
        "Apuração do faturamento",
        "Envio da declaração"
      ],
      valor: "R$ 98,99",
      categoriaLabel: "MEI"
    },

    parcelamento: {
      titulo: "Parcelamento de Débitos do MEI",
      descricao: "Parcelamento de débitos em atraso do MEI.",
      inclusos: [
        "Análise da dívida",
        "Simulação e parcelamento"
      ],
      valor: "R$ 178,99",
      categoriaLabel: "MEI"
    },

    "alteracao-mei": {
      titulo: "Alteração de Dados do MEI",
      descricao: "Alteração de dados cadastrais do MEI.",
      inclusos: [
        "Alteração no cadastro",
        "Confirmação das mudanças"
      ],
      valor: "R$ 78,99",
      categoriaLabel: "MEI"
    }
  },

  "pessoa-fisica": {
    irpf: {
      titulo: "Declaração de Imposto de Renda",
      descricao: "Elaboração e envio da declaração de IRPF.",
      inclusos: [
        "Análise de documentos",
        "Apuração de imposto",
        "Envio da declaração"
      ],
      valor: "R$ 139,99",
      categoriaLabel: "Pessoa Física"
    },

    "cpf-regularizacao": {
      titulo: "Regularização de CPF",
      descricao: "Correção de pendências do CPF junto à Receita Federal.",
      inclusos: [
        "Análise da situação",
        "Regularização cadastral"
      ],
      valor: "R$ 79,99",
      categoriaLabel: "Pessoa Física"
    },

    "orientacao-fiscal-pf": {
      titulo: "Orientação Fiscal Pessoa Física",
      descricao: "Orientação tributária personalizada.",
      inclusos: [
        "Análise da situação fiscal",
        "Orientação especializada"
      ],
      valor: "R$ 99,99",
      categoriaLabel: "Pessoa Física"
    }
  },

  contabeis: {
    "consultoria-contabil": {
      titulo: "Consultoria Contábil",
      descricao: "Consultoria contábil personalizada.",
      inclusos: [
        "Análise contábil",
        "Orientação estratégica"
      ],
      valor: "R$ 199,99",
      categoriaLabel: "Serviços Contábeis"
    },

    "planejamento-tributario": {
      titulo: "Planejamento Tributário",
      descricao: "Planejamento para redução legal de impostos.",
      inclusos: [
        "Análise tributária",
        "Estratégias de economia fiscal"
      ],
      valor: "R$ 249,99",
      categoriaLabel: "Serviços Contábeis"
    },

    "balanco-patrimonial": {
      titulo: "Elaboração de Balanço",
      descricao: "Elaboração de balanço patrimonial e DRE.",
      inclusos: [
        "Balanço patrimonial",
        "DRE"
      ],
      valor: "R$ 299,99",
      categoriaLabel: "Serviços Contábeis"
    },

    "regularizacao-empresa": {
      titulo: "Regularização de Empresa",
      descricao: "Regularização fiscal, contábil e cadastral.",
      inclusos: [
        "Análise de pendências",
        "Regularização completa"
      ],
      valor: "R$ 349,99",
      categoriaLabel: "Serviços Contábeis"
    },

    "encerramento-empresa": {
      titulo: "Encerramento de Empresa",
      descricao: "Baixa completa da empresa.",
      inclusos: [
        "Encerramento fiscal",
        "Baixa nos órgãos"
      ],
      valor: "R$ 399,99",
      categoriaLabel: "Serviços Contábeis"
    }
  },

  "certidoes-regularizacoes": {
    "certidao-negativa": {
      titulo: "Certidão Negativa de Débitos",
      descricao: "Emissão de certidão negativa.",
      inclusos: [
        "Consulta de pendências",
        "Emissão da certidão"
      ],
      valor: "R$ 79,99",
      categoriaLabel: "Certidões e Regularizações"
    },

    "regularizacao-cadastral": {
      titulo: "Regularização Cadastral",
      descricao: "Regularização de dados cadastrais.",
      inclusos: [
        "Análise cadastral",
        "Correção de dados"
      ],
      valor: "R$ 149,99",
      categoriaLabel: "Certidões e Regularizações"
    },

    "certidao-estadual": {
      titulo: "Certidão Estadual",
      descricao: "Emissão de certidão estadual.",
      inclusos: [
        "Consulta estadual",
        "Emissão da certidão"
      ],
      valor: "R$ 69,99",
      categoriaLabel: "Certidões e Regularizações"
    },

    "certidao-municipal": {
      titulo: "Certidão Municipal",
      descricao: "Emissão de certidão municipal.",
      inclusos: [
        "Consulta municipal",
        "Emissão da certidão"
      ],
      valor: "R$ 69,99",
      categoriaLabel: "Certidões e Regularizações"
    }
  },

  outros: {
    "planilha-financeira": {
      titulo: "Planilha Financeira Pessoal",
      descricao: "Controle financeiro mensal.",
      inclusos: [
        "Planilha personalizada",
        "Orientação de uso"
      ],
      valor: "R$ 59,99",
      categoriaLabel: "Outros Serviços"
    },

    "organizacao-documentos": {
      titulo: "Organização de Documentos",
      descricao: "Organização e digitalização de documentos.",
      inclusos: [
        "Classificação",
        "Organização digital"
      ],
      valor: "R$ 179,99",
      categoriaLabel: "Outros Serviços"
    },

    "orientacao-financeira": {
      titulo: "Orientação Financeira Básica",
      descricao: "Orientação financeira personalizada.",
      inclusos: [
        "Diagnóstico financeiro",
        "Orientação prática"
      ],
      valor: "R$ 129,99",
      categoriaLabel: "Outros Serviços"
    }
  }
};

  /* ===============================
   🔹 ALIASES DE CATEGORIA (COMPATIBILIDADE)
   =============================== */
servicosMock["outros-servicos"] = servicosMock.outros;
servicosMock["certificado-digital"] = {
  "certificado-a1": {
    titulo: "Certificado Digital A1",
    descricao: "Certificado digital tipo A1.",
    inclusos: [
      "Emissão do certificado",
      "Suporte técnico"
    ],
    valor: "R$ 189,99",
    categoriaLabel: "Certificado Digital"
  },

  "certificado-a3": {
    titulo: "Certificado Digital A3",
    descricao: "Certificado digital tipo A3.",
    inclusos: [
      "Emissão do certificado",
      "Suporte técnico"
    ],
    valor: "R$ 249,99",
    categoriaLabel: "Certificado Digital"
  },

  "renovacao-certificado": {
    titulo: "Renovação de Certificado Digital",
    descricao: "Renovação de certificado digital.",
    inclusos: [
      "Renovação imediata",
      "Suporte técnico"
    ],
    valor: "R$ 149,99",
    categoriaLabel: "Certificado Digital"
  }
};

servicosMock["certidoes"] = servicosMock["certidoes-regularizacoes"];

  /* ===============================
     🔹 PARÂMETROS DA URL
     =============================== */
  const params = new URLSearchParams(window.location.search);
  const categoria = params.get("categoria");
  const slug =
    params.get("servico") ||
    params.get("plano") ||
    params.get("slug");

  const dados = servicosMock[categoria]?.[slug];

 // ===== BREADCRUMB (SEMPRE RENDERIZA) =====
const breadcrumb = document.getElementById("breadcrumb");

if (breadcrumb) {
  breadcrumb.innerHTML = `
    <a href="${BASE_URL}/">Início</a>
    <span>›</span>
    <a href="${BASE_URL}/">Serviços</a>
    <span>›</span>
    <span>${dados?.categoriaLabel || "Serviço"}</span>
  `;
}

  /* ===============================
     🔹 TRATAMENTO DE ERRO (UX)
     =============================== */
  if (!dados) {
    const nomeEl = document.getElementById("nomeServico");
    const descEl = document.getElementById("descricaoServico");

    if (nomeEl) nomeEl.innerText = "Serviço não encontrado";
    if (descEl)
      descEl.innerText =
        "O serviço selecionado não existe ou foi removido.";

    return;
  }

  /* ===============================
     🔹 CONTEÚDO DO SERVIÇO
     =============================== */
  const nomeServicoEl = document.getElementById("nomeServico");
  const descricaoServicoEl = document.getElementById("descricaoServico");
  const valorServicoEl = document.getElementById("valorServico");
  const ul = document.getElementById("inclusosServico");

  if (nomeServicoEl) nomeServicoEl.innerText = dados.titulo;
  if (descricaoServicoEl) descricaoServicoEl.innerText = dados.descricao;
  if (valorServicoEl) valorServicoEl.innerText = dados.valor;

  if (ul) {
    ul.innerHTML = "";
    dados.inclusos.forEach(item => {
      const li = document.createElement("li");
      li.innerText = item;
      ul.appendChild(li);
    });
  }

  /* ===============================
     🔹 MÁSCARAS + VALIDAÇÃO
     =============================== */
  const whatsappInput = document.getElementById("whatsapp");
  if (whatsappInput) {
    whatsappInput.addEventListener("input", () => {
      let v = whatsappInput.value.replace(/\D/g, "").slice(0, 11);
      if (v.length >= 2) v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
      if (v.length >= 10) v = `${v.slice(0, 10)}-${v.slice(10)}`;
      whatsappInput.value = v;
      validarFormulario();
    });
  }

  const cpfInput = document.getElementById("cpf");
  if (cpfInput) {
    cpfInput.addEventListener("input", () => {
      let v = cpfInput.value.replace(/\D/g, "").slice(0, 11);
      if (v.length >= 3) v = `${v.slice(0, 3)}.${v.slice(3)}`;
      if (v.length >= 7) v = `${v.slice(0, 7)}.${v.slice(7)}`;
      if (v.length >= 11) v = `${v.slice(0, 11)}-${v.slice(11)}`;
      cpfInput.value = v;
      validarFormulario();
    });
  }

  function emailValido(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validarFormulario() {
    const valido = camposObrigatorios.every(id => {
      const campo = document.getElementById(id);
      if (!campo || campo.value.trim() === "") return false;
      if (id === "email" && !emailValido(campo.value)) return false;
      return true;
    });

    if (botao) botao.disabled = !valido;
  }

  camposObrigatorios.forEach(id => {
    const campo = document.getElementById(id);
    if (campo) campo.addEventListener("input", validarFormulario);
  });
});
