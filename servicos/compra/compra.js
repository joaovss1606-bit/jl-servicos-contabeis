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
        inclusos: ["Cálculo do imposto", "Emissão da guia"],
        valor: "R$ 48,99",
        categoriaLabel: "MEI"
      },
      dasn: {
        titulo: "Declaração Anual do MEI (DASN-SIMEI)",
        descricao: "Envio da declaração anual obrigatória do MEI.",
        inclusos: ["Apuração do faturamento", "Envio da declaração"],
        valor: "R$ 98,99",
        categoriaLabel: "MEI"
      },
      parcelamento: {
        titulo: "Parcelamento de Débitos do MEI",
        descricao: "Parcelamento de débitos em atraso do MEI.",
        inclusos: ["Análise da dívida", "Simulação e parcelamento"],
        valor: "R$ 178,99",
        categoriaLabel: "MEI"
      },
      "alteracao-mei": {
        titulo: "Alteração de Dados do MEI",
        descricao: "Alteração de dados cadastrais do MEI.",
        inclusos: ["Alteração no cadastro", "Confirmação das mudanças"],
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
      }
    },

    contabeis: {
      "consultoria-contabil": {
        titulo: "Consultoria Contábil",
        descricao: "Consultoria contábil personalizada.",
        inclusos: ["Análise contábil", "Orientação estratégica"],
        valor: "R$ 199,99",
        categoriaLabel: "Serviços Contábeis"
      }
    },

    "certidoes-regularizacoes": {
      "certidao-negativa": {
        titulo: "Certidão Negativa de Débitos",
        descricao: "Emissão de certidão negativa.",
        inclusos: ["Consulta de pendências", "Emissão da certidão"],
        valor: "R$ 79,99",
        categoriaLabel: "Certidões e Regularizações"
      }
    },

    outros: {
      "planilha-financeira": {
        titulo: "Planilha Financeira Pessoal",
        descricao: "Controle financeiro mensal.",
        inclusos: ["Planilha personalizada", "Orientação de uso"],
        valor: "R$ 59,99",
        categoriaLabel: "Outros Serviços"
      }
    }
  };

  servicosMock["outros-servicos"] = servicosMock.outros;
  servicosMock["certidoes"] = servicosMock["certidoes-regularizacoes"];

  /* ===============================
     🔹 PARÂMETROS DA URL
     =============================== */
  const params = new URLSearchParams(window.location.search);
  const categoria = params.get("categoria");
  const slug = params.get("servico") || params.get("plano") || params.get("slug");

  const dados = servicosMock[categoria]?.[slug];

  if (!dados) return;

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
     🔹 MÁSCARAS (WHATSAPP + CPF)
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

  /* ===============================
     🔹 ENVIO DO PEDIDO (WHATSAPP)
     =============================== */
  let envioEmAndamento = false;

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      if (envioEmAndamento) return;
      envioEmAndamento = true;

      const textoOriginal = botao.innerHTML;
      botao.disabled = true;
      botao.innerHTML = `<span class="spinner"></span> Enviando...`;

      const nome = document.getElementById("nome").value.trim();
      const email = document.getElementById("email").value.trim();
      const whatsapp = document.getElementById("whatsapp").value.trim();
      const cpf = document.getElementById("cpf").value.trim();
      const observacoes = document.getElementById("observacoes")?.value.trim() || "";

      const mensagem = `
📌 *Novo Pedido de Serviço*

🛎️ *Serviço:* ${dados.titulo}
📂 *Categoria:* ${dados.categoriaLabel}
💰 *Valor:* ${dados.valor}

👤 *Nome:* ${nome}
📧 *Email:* ${email}
📱 *WhatsApp:* ${whatsapp}
🆔 *CPF:* ${cpf}

📝 *Observações:*
${observacoes || "Nenhuma"}
      `.trim();

      const url = `https://wa.me/5561920041427?text=${encodeURIComponent(mensagem)}`;
      window.open(url, "_blank");

      setTimeout(() => {
        botao.innerHTML = textoOriginal;
        botao.disabled = false;
        envioEmAndamento = false;
      }, 600);
    });
  }
});

