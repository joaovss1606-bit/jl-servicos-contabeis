document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("pedidoForm");
  const botao = document.getElementById("btnEnviar");
  const camposObrigatorios = ["nome", "whatsapp", "email", "cpf"];

  // --- BASE DE DADOS (MOCK) ---
  const servicosMock = {
    mei: {
      basico: { titulo: "Plano MEI — Básico", categoriaLabel: "MEI", valor: "R$ 99,99", descricao: "Manutenção mensal essencial para seu MEI.", inclusos: ["DAS Mensal", "DASN Anual", "Suporte"] },
      premium: { titulo: "Plano MEI — Premium", categoriaLabel: "MEI", valor: "R$ 159,99", descricao: "Gestão completa para o seu negócio.", inclusos: ["DAS Mensal", "Certidões", "Parcelamentos", "Suporte Prioritário"] },
      "abertura-mei": { titulo: "Abertura de MEI", categoriaLabel: "MEI", valor: "R$ 148,99", descricao: "Formalização completa do seu CNPJ MEI.", inclusos: ["CNPJ", "Inscrição Municipal", "CCMEI"] },
      "regularizacao-mei": { titulo: "Regularização de MEI", categoriaLabel: "MEI", valor: "R$ 198,99", descricao: "Coloque seu MEI em dia com o governo.", inclusos: ["Análise de Débitos", "Regularização Fiscal"] },
      "baixa-mei": { titulo: "Baixa de MEI", categoriaLabel: "MEI", valor: "R$ 128,99", descricao: "Encerramento formal das atividades do MEI.", inclusos: ["Baixa CNPJ", "DASN de Extinção"] },
      "encerramento-mei": { titulo: "Encerramento de MEI", categoriaLabel: "MEI", valor: "R$ 128,99", descricao: "Baixa completa do MEI junto aos órgãos oficiais.", inclusos: ["Encerramento no portal", "Baixa do CNPJ", "Orientação final"] },
      "emissao-das": { titulo: "Emissão de DAS", categoriaLabel: "MEI", valor: "R$ 48,99", descricao: "Emissão da guia DAS do MEI.", inclusos: ["Cálculo do imposto", "Emissão da guia"] },
      dasn: { titulo: "Declaração Anual do MEI (DASN-SIMEI)", categoriaLabel: "MEI", valor: "R$ 98,99", descricao: "Envio da declaração anual obrigatória do MEI.", inclusos: ["Apuração do faturamento", "Envio da declaração"] },
      parcelamento: { titulo: "Parcelamento de Débitos do MEI", categoriaLabel: "MEI", valor: "R$ 178,99", descricao: "Parcelamento de débitos em atraso do MEI.", inclusos: ["Análise da dívida", "Simulação e parcelamento"] },
      "alteracao-mei": { titulo: "Alteração de Dados do MEI", categoriaLabel: "MEI", valor: "R$ 78,99", descricao: "Alteração de dados cadastrais do MEI.", inclusos: ["Alteração no cadastro", "Confirmação das mudanças"] }
    },
    "pessoa-fisica": {
      irpf: { titulo: "Imposto de Renda (IRPF)", categoriaLabel: "Pessoa Física", valor: "R$ 139,99", descricao: "Declaração anual completa e segura.", inclusos: ["Análise de Documentos", "Envio à Receita"] },
      "cpf-regularizacao": { titulo: "Regularização de CPF", categoriaLabel: "Pessoa Física", valor: "R$ 79,99", descricao: "Regularize seu CPF suspenso ou pendente.", inclusos: ["Consulta Receita", "Protocolo de Regularização"] },
      "planejamento-tributario": { titulo: "Planejamento Tributário", categoriaLabel: "Pessoa Física", valor: "R$ 199,99", descricao: "Estudo para redução legal de impostos.", inclusos: ["Análise de Renda", "Simulação Tributária"] },
      "orientacao-fiscal-pf": { titulo: "Orientação Fiscal Pessoa Física", categoriaLabel: "Pessoa Física", valor: "R$ 119,99", descricao: "Consultoria para planejamento tributário de pessoas físicas.", inclusos: ["Análise de rendimentos", "Dicas de economia fiscal", "Suporte técnico"] }
    },
    contabeis: {
      "consultoria-contabil": { titulo: "Consultoria Contábil", categoriaLabel: "Serviços Contábeis", valor: "R$ 199,99", descricao: "Suporte especializado para sua empresa.", inclusos: ["Análise de Balanço", "Orientação Fiscal"] },
      "elaboracao-balanco": { titulo: "Elaboração de Balanço", categoriaLabel: "Serviços Contábeis", valor: "R$ 349,99", descricao: "Fechamento contábil e balanço patrimonial.", inclusos: ["DRE", "Balanço Patrimonial"] },
      "regularizacao-empresa": { titulo: "Regularização de Empresa", categoriaLabel: "Serviços Contábeis", valor: "R$ 249,99", descricao: "Regularização de empresas (ME/EPP) em atraso.", inclusos: ["Certidões", "Regularização Junta/Receita"] },
      "encerramento-empresa": { titulo: "Encerramento de Empresa", categoriaLabel: "Serviços Contábeis", valor: "R$ 499,99", descricao: "Baixa completa de empresas (ME/EPP).", inclusos: ["Distrato Social", "Baixa de Órgãos"] }
    },
    "certidoes-regularizacoes": {
      "certidao-negativa": { titulo: "Certidão Negativa de Débitos", categoriaLabel: "Certidões", valor: "R$ 79,99", descricao: "Emissão de CND Federal, Estadual ou Municipal.", inclusos: ["Consulta de Débitos", "Emissão do PDF"] },
      "certidao-estadual": { titulo: "Certidão Estadual", categoriaLabel: "Certidões", valor: "R$ 89,99", descricao: "Certidão de regularidade tributária estadual.", inclusos: ["Consulta SEFAZ", "Emissão"] },
      "regularizacao-cadastral": { titulo: "Regularização Cadastral", categoriaLabel: "Certidões", valor: "R$ 99,99", descricao: "Ajustes de dados em cadastros oficiais.", inclusos: ["Protocolos", "Alteração Cadastral"] }
    },
    "certificado-digital": {
      "emissao-a1": { titulo: "Certificado Digital A1", categoriaLabel: "Certificado Digital", valor: "A partir de R$ 189,99", descricao: "Emissão de certificado digital para pessoa jurídica ou física.", inclusos: ["Validação Online", "Instalação"] },
      "emissao-a3": { titulo: "Certificado Digital A3", categoriaLabel: "Certificado Digital", valor: "A partir de R$ 249,99", descricao: "Certificado em token ou cartão com validade de até 3 anos.", inclusos: ["Token incluso", "Suporte"] }
    },
    outros: {
      "planilha-financeira": { titulo: "Planilha Financeira Pessoal", categoriaLabel: "Outros", valor: "R$ 59,99", descricao: "Organização completa das suas contas.", inclusos: ["Planilha Excel/Google", "Aula de uso"] },
      "organizacao-documentos": { titulo: "Organização de Documentos", categoriaLabel: "Outros", valor: "R$ 149,99", descricao: "Digitalização e separação contábil de arquivos.", inclusos: ["Digitalização", "Classificação"] },
      "orientacao-financeira": { titulo: "Orientação Financeira Básica", categoriaLabel: "Outros", valor: "R$ 119,99", descricao: "Consultoria simples para finanças pessoais.", inclusos: ["Sessão de 40min", "Plano de Ação"] }
    }
  };

  const nomesCategorias = {
    "mei": "MEI",
    "pessoa-fisica": "Pessoa Física",
    "contabeis": "Serviços Contábeis",
    "certidoes-regularizacoes": "Certidões",
    "certificado-digital": "Certificado Digital",
    "outros": "Outros"
  };

  // --- CAPTURA DE PARÂMETROS DA URL ---
  const params = new URLSearchParams(window.location.search);
  const cat = params.get("categoria")?.trim();
  const serv = (params.get("servico") || params.get("plano") || params.get("slug"))?.trim();

  const dados = servicosMock[cat]?.[serv];

  if (!dados) {
      console.warn("Serviço não encontrado:", cat, serv);
      const elDesc = document.getElementById("descricaoServico");
      if(elDesc) elDesc.innerHTML = `<span style="color: #ff4444;">Serviço não localizado.</span>`;
      return;
  }

  // --- PREENCHIMENTO DO HTML ---
  document.getElementById("nomeServico") && (document.getElementById("nomeServico").innerText = dados.titulo);
  document.getElementById("descricaoServico") && (document.getElementById("descricaoServico").innerText = dados.descricao);
  document.getElementById("valorServico") && (document.getElementById("valorServico").innerText = dados.valor);
  document.getElementById("inclusosServico") && (document.getElementById("inclusosServico").innerHTML = dados.inclusos.map(i => `<li>${i}</li>`).join(""));

  // --- BREADCRUMB DINÂMICO ---
  const bread = document.getElementById("breadcrumb");
  if (bread) {
    const nomeCatAmigavel = nomesCategorias[cat] || "Categoria";
    const linkCategoria = `../servicos/${cat}/index.html`;

    bread.innerHTML = `
      <a href="../index.html" style="color: #bd9617; text-decoration: none;">Início</a> 
      <span style="margin: 0 8px;">›</span> 
      <a href="../servicos/index.html" style="color: #bd9617; text-decoration: none;">Serviços</a> 
      <span style="margin: 0 8px;">›</span> 
      <a href="${linkCategoria}" style="color: #bd9617; text-decoration: none;">${nomeCatAmigavel}</a> 
      <span style="margin: 0 8px;">›</span> 
      <strong style="color: #ffffff;">${dados.titulo}</strong>
    `;
  }

  // --- MÁSCARAS ---
  const handleWhatsApp = (e) => {
    let v = e.target.value.replace(/\D/g, "");
    if (v.length > 11) v = v.slice(0, 11);
    if (v.length > 2) v = "(" + v.slice(0, 2) + ") " + v.slice(2);
    if (v.length > 9) v = v.slice(0, 9) + "-" + v.slice(9);
    e.target.value = v;
    validarFormulario();
  };

  const handleCPF = (e) => {
    let v = e.target.value.replace(/\D/g, "");
    if (v.length > 11) v = v.slice(0, 11);
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    e.target.value = v;
    validarFormulario();
  };

  document.getElementById("whatsapp")?.addEventListener("input", handleWhatsApp);
  document.getElementById("cpf")?.addEventListener("input", handleCPF);

  function validarFormulario() {
    const emailEl = document.getElementById("email");
    if(!emailEl || !botao) return;
    
    const email = emailEl.value;
    const obrigatoriosOk = camposObrigatorios.every(id => {
        const el = document.getElementById(id);
        return el && el.value.trim().length >= 8; // Aumentado para validar máscaras
    });
    
    const emailOk = email.includes("@") && email.includes(".");
    botao.disabled = !(obrigatoriosOk && emailOk);
  }

  ["nome", "email"].forEach(id => document.getElementById(id)?.addEventListener("input", validarFormulario));

  if (form) {
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        
        botao.disabled = true;
        const textoOriginal = botao.innerHTML;
        botao.innerHTML = `Enviando pedido...`;

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
          botao.disabled = false;
          botao.innerHTML = textoOriginal;
          validarFormulario();
        }, 3000);
    });
  }
});
  }
});
