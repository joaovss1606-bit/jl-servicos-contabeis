document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("pedidoForm");
  const botao = document.getElementById("btnEnviar");

  const camposObrigatorios = ["nome", "whatsapp", "email", "cpf"];
  const BASE_URL = "/jl-servicos-contabeis";

  /* =================================================
     🔹 DADOS MOCK (PADRÃO COM SLUG)
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
      titulo: "Declaração de Imposto de Renda (IRPF)",
      descricao: "Elaboração e envio da declaração de Imposto de Renda Pessoa Física.",
      inclusos: [
        "Análise de documentos",
        "Apuração de imposto",
        "Envio da declaração"
      ],
      valor: "R$ 139,99",
      categoriaLabel: "Pessoa Física"
    }
  },

  contabeis: {
    "consultoria-contabil": {
      titulo: "Consultoria Contábil",
      descricao: "Consultoria contábil personalizada para empresas e profissionais.",
      inclusos: [
        "Análise contábil",
        "Orientação estratégica"
      ],
      valor: "R$ 199,99",
      categoriaLabel: "Serviços Contábeis"
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
      valor: "R$ 79,99",
      categoriaLabel: "Certidões e Regularizações"
    }
  },

  outros: {
    "planilha-financeira": {
      titulo: "Planilha Financeira Pessoal",
      descricao: "Planilha personalizada para controle financeiro mensal.",
      inclusos: [
        "Planilha personalizada",
        "Orientação de uso"
      ],
      valor: "R$ 59,99",
      categoriaLabel: "Outros Serviços"
    }
  }
};

/* aliases seguros (não remover) */
servicosMock["outros-servicos"] = servicosMock.outros;
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

  /* ===============================
     🔹 TRATAMENTO DE ERRO (SEM QUEBRAR SCRIPT)
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
     🔹 POPULA DADOS DO SERVIÇO
     =============================== */
  document.getElementById("nomeServico").innerText = dados.titulo;
  document.getElementById("descricaoServico").innerText = dados.descricao;
  document.getElementById("valorServico").innerText = dados.valor;

  const lista = document.getElementById("inclusosServico");
  if (lista && dados.inclusos) {
    lista.innerHTML = "";
    dados.inclusos.forEach(item => {
      const li = document.createElement("li");
      li.innerText = item;
      lista.appendChild(li);
    });
  }

  /* ===============================
     🔹 BREADCRUMB
     =============================== */
  const breadcrumb = document.getElementById("breadcrumb");
  if (breadcrumb) {
    breadcrumb.innerHTML = `
      <a href="${BASE_URL}/">Início</a>
      <span>›</span>
      <a href="${BASE_URL}/">Serviços</a>
      <span>›</span>
      <a href="${BASE_URL}/servicos/${categoria}/">
        ${dados.categoriaLabel}
      </a>
      <span>›</span>
      <strong>${dados.titulo}</strong>
    `;
  }

  /* ===============================
     🔹 VALIDAÇÃO
     =============================== */
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
    const campo = document.getElementById(id);
    if (campo) campo.addEventListener("input", validarFormulario);
  });

/* ===============================
   🔹 MÁSCARA WHATSAPP (FORMATO BR)
   =============================== */
const inputWhatsapp = document.getElementById("whatsapp");

if (inputWhatsapp) {
  let apagando = false;

  inputWhatsapp.addEventListener("keydown", (e) => {
    apagando = e.key === "Backspace";
  });

  inputWhatsapp.addEventListener("input", () => {
    if (apagando) return;

    let v = inputWhatsapp.value.replace(/\D/g, "").slice(0, 11);

    // DDD
    if (v.length >= 2) {
      v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
    }

    // Celular com 9 dígitos
    if (v.length >= 11) {
      v = `(${v.slice(1, 3)}) ${v.slice(3, 4)}${v.slice(4, 8)}-${v.slice(8, 12)}`;
    }

    inputWhatsapp.value = v;
  });
}

  /* ===============================
   🔹 VALIDAÇÃO DE DDD EXISTENTE
   =============================== */
if (inputWhatsapp) {
  inputWhatsapp.addEventListener("blur", () => {
    const numeros = inputWhatsapp.value.replace(/\D/g, "");

    if (numeros.length < 2) return;

    const ddd = numeros.slice(0, 2);

    if (!DDD_VALIDOS.includes(ddd)) {
      inputWhatsapp.setCustomValidity("DDD inválido. Informe um DDD existente.");
      inputWhatsapp.reportValidity();
    } else {
      inputWhatsapp.setCustomValidity("");
    }
  });
}

  /* ===============================
     🔹 MÁSCARA CPF
     =============================== */
  const inputCpf = document.getElementById("cpf");
  if (inputCpf) {
    inputCpf.addEventListener("input", () => {
      let v = inputCpf.value.replace(/\D/g, "").slice(0, 11);
      if (v.length > 3) v = `${v.slice(0, 3)}.${v.slice(3)}`;
      if (v.length > 7) v = `${v.slice(0, 7)}.${v.slice(7)}`;
      if (v.length > 11) v = `${v.slice(0, 11)}-${v.slice(11)}`;
      inputCpf.value = v;
    });
  }

  /* ===============================
     🔹 ENVIO DO PEDIDO (WHATSAPP)
     =============================== */
  let envioEmAndamento = false;

  form.addEventListener("submit", e => {
    e.preventDefault();
    if (envioEmAndamento) return;

    envioEmAndamento = true;
    const textoOriginal = botao.innerHTML;

    botao.disabled = true;
    botao.innerHTML = `<span class="spinner"></span> Enviando...`;

    const mensagem = `
📌 *Novo Pedido de Serviço*

🛎️ *Serviço:* ${dados.titulo}
📂 *Categoria:* ${dados.categoriaLabel}
💰 *Valor:* ${dados.valor}
    `.trim();

    window.open(
      `https://wa.me/5561920041427?text=${encodeURIComponent(mensagem)}`,
      "_blank"
    );

    setTimeout(() => {
      botao.innerHTML = textoOriginal;
      botao.disabled = false;
      envioEmAndamento = false;
    }, 600);
  });
});

