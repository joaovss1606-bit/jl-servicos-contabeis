document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("pedidoForm");
  const botao = document.getElementById("btnEnviar");

  const camposObrigatorios = ["nome", "whatsapp", "email", "cpf"];

  // BASE do GitHub Pages
  const BASE_URL = "/jl-servicos-contabeis";

  /* ===============================
     🔹 DADOS MOCK (TEMPORÁRIOS)
     =============================== */
  const servicosMock = {
    mei: {
      basico: {
        titulo: "Plano MEI — Básico",
        descricao: "Plano básico de serviços para MEI.",
        inclusos: ["Orientação inicial", "Emissão de DAS", "Suporte simples"],
        valor: "R$ 99,90",
        categoriaLabel: "MEI",
        categoriaPath: "/servicos/mei/"
      },
      premium: {
        titulo: "Plano MEI — Premium",
        descricao: "Plano premium com atendimento completo.",
        inclusos: ["Tudo do Básico", "Consultoria estendida", "Relatórios adicionais"],
        valor: "R$ 149,90",
        categoriaLabel: "MEI",
        categoriaPath: "/servicos/mei/"
      }
    },
    certificado: {
      renovacao: {
        titulo: "Renovação de Certificado Digital",
        descricao: "Serviço de renovação do seu certificado digital.",
        inclusos: ["Renovação imediata", "Suporte especializado"],
        valor: "R$ 150,00",
        categoriaLabel: "Certificado Digital",
        categoriaPath: "/servicos/certificado/"
      }
    }
  };

  /* ===============================
     🔹 PARÂMETROS DA URL
     =============================== */
  const params = new URLSearchParams(window.location.search);
  const categoria = params.get("categoria");
  const plano = params.get("plano");

  const dados = servicosMock[categoria]?.[plano];

  if (!dados) {
    document.getElementById("nomeServico").innerText = "Serviço não encontrado";
    return;
  }

  /* ===============================
     🔹 BREADCRUMB (FUNCIONAL EM TODAS)
     =============================== */
  const breadcrumb = document.getElementById("breadcrumb");

  if (breadcrumb) {
    breadcrumb.innerHTML = `
      <a href="${BASE_URL}/">Início</a>
      <span>›</span>
      <a href="${BASE_URL}/">Serviços</a>
      <span>›</span>
      <a href="${BASE_URL}${dados.categoriaPath}">
        ${dados.categoriaLabel}
      </a>
      <span>›</span>
      <span>${dados.titulo}</span>
    `;
  }

  /* ===============================
     🔹 CONTEÚDO DA PÁGINA
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
     🔹 MÁSCARA WHATSAPP
     =============================== */
  const whatsappInput = document.getElementById("whatsapp");
  whatsappInput.addEventListener("input", () => {
    let v = whatsappInput.value.replace(/\D/g, "").slice(0, 11);
    if (v.length >= 2) v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
    if (v.length >= 10) v = `${v.slice(0, 10)}-${v.slice(10)}`;
    whatsappInput.value = v;
    validarFormulario();
  });

  /* ===============================
     🔹 MÁSCARA CPF
     =============================== */
  const cpfInput = document.getElementById("cpf");
  cpfInput.addEventListener("input", () => {
    let v = cpfInput.value.replace(/\D/g, "").slice(0, 11);
    if (v.length >= 3) v = `${v.slice(0, 3)}.${v.slice(3)}`;
    if (v.length >= 7) v = `${v.slice(0, 7)}.${v.slice(7)}`;
    if (v.length >= 11) v = `${v.slice(0, 11)}-${v.slice(11)}`;
    cpfInput.value = v;
    validarFormulario();
  });

  /* ===============================
     🔹 VALIDAÇÃO EMAIL
     =============================== */
  const emailInput = document.getElementById("email");
  function emailValido(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /* ===============================
     🔹 VALIDAÇÃO GERAL
     =============================== */
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
