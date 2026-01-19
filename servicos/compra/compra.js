document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("pedidoForm");
  const botao = document.getElementById("btnEnviar");

  const camposObrigatorios = ["nome", "whatsapp", "email", "cpf"];

  const BASE_URL = "/jl-servicos-contabeis";

  /* ===============================
     🔹 DADOS MOCK (PADRÃO COM SLUG)
     =============================== */
  const servicosMock = {
    mei: {
      "basico": {
        titulo: "Plano MEI — Básico",
        descricao: "Plano básico de serviços para MEI.",
        inclusos: [
          "Orientação inicial",
          "Emissão de DAS",
          "Suporte simples"
        ],
        valor: "R$ 99,99",
        categoriaLabel: "MEI"
      },
      "premium": {
        titulo: "Plano MEI — Premium",
        descricao: "Plano premium com atendimento completo.",
        inclusos: [
          "Tudo do Básico",
          "Consultoria estendida",
          "Relatórios adicionais"
        ],
        valor: "R$ 159,99",
        categoriaLabel: "MEI"
      },
      "abertura-mei": {
        titulo: "Abertura de MEI",
        descricao: "Abertura completa do MEI com orientação e regularização inicial.",
        inclusos: [
          "Cadastro no Portal do Empreendedor",
          "Emissão de CNPJ",
          "Orientação inicial"
        ],
        valor: "R$ 148,99",
        categoriaLabel: "MEI"
      }
    },

    "certificado-digital": {
      "renovacao-certificado": {
        titulo: "Renovação de Certificado Digital",
        descricao: "Serviço de renovação do certificado digital.",
        inclusos: [
          "Renovação imediata",
          "Suporte especializado"
        ],
        valor: "R$ 149,90",
        categoriaLabel: "Certificado Digital"
      }
    },

    "certidoes-regularizacoes": {
      "certidao-negativa": {
        titulo: "Certidão Negativa de Débitos",
        descricao: "Emissão de certidão negativa junto aos órgãos competentes.",
        inclusos: [
          "Consulta de pendências",
          "Emissão da certidão"
        ],
        valor: "R$ 79,90",
        categoriaLabel: "Certidões e Regularizações"
      }
    }
  };

  /* ===============================
     🔹 PARÂMETROS DA 
     =============================== */
  const params = new URLSearchParams(window.location.search);
  const categoria = params.get("categoria");
  const slug = params.get("servico") || params.get("plano") || params.get("slug");

  const dados = servicosMock[categoria]?.[slug];

  if (!dados) {
    document.getElementById("nomeServico").innerText = "Serviço não encontrado";
    return;
  }

  /* ===============================
     🔹 BREADCRUMB (CORRETO)
     =============================== */
  const breadcrumb = document.getElementById("breadcrumb");

  if (breadcrumb) {
    const categoriaUrl = `${BASE_URL}/servicos/${categoria}/`;

    breadcrumb.innerHTML = `
      <a href="${BASE_URL}/">Início</a>
      <span>›</span>
      <a href="${BASE_URL}/">Serviços</a>
      <span>›</span>
      <a href="${categoriaUrl}">${dados.categoriaLabel}</a>
      <span>›</span>
      <span>${dados.titulo}</span>
    `;
  }

  /* ===============================
     🔹 CONTEÚDO DO SERVIÇO
     =============================== */
  document.getElementById("nomeServico").innerText = dados.titulo;
  document.getElementById("descricaoServico").innerText = dados.descricao;
  document.getElementById("valorServico").innerText = dados.valor;

  const ul = document.getElementById("inclusosServico");
  ul.innerHTML = "";
  dados.inclusos.forEach(item => {
    const li = document.createElement("li");
    li.innerText = item;
    ul.appendChild(li);
  });

  /* ===============================
     🔹 MÁSCARAS + VALIDAÇÃO
     =============================== */
  const whatsappInput = document.getElementById("whatsapp");
  whatsappInput.addEventListener("input", () => {
    let v = whatsappInput.value.replace(/\D/g, "").slice(0, 11);
    if (v.length >= 2) v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
    if (v.length >= 10) v = `${v.slice(0, 10)}-${v.slice(10)}`;
    whatsappInput.value = v;
    validarFormulario();
  });

  const cpfInput = document.getElementById("cpf");
  cpfInput.addEventListener("input", () => {
    let v = cpfInput.value.replace(/\D/g, "").slice(0, 11);
    if (v.length >= 3) v = `${v.slice(0, 3)}.${v.slice(3)}`;
    if (v.length >= 7) v = `${v.slice(0, 7)}.${v.slice(7)}`;
    if (v.length >= 11) v = `${v.slice(0, 11)}-${v.slice(11)}`;
    cpfInput.value = v;
    validarFormulario();
  });

  const emailInput = document.getElementById("email");
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
    botao.disabled = !valido;
  }

  camposObrigatorios.forEach(id => {
    document.getElementById(id).addEventListener("input", validarFormulario);
  });
});
