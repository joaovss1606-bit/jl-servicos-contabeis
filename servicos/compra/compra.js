document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("pedidoForm");
  const botao = document.getElementById("btnEnviar");

  // --- BASE DE DADOS (MOCK) ---
  const servicosMock = {
    mei: {
      "mei-plano-basico": { titulo: "Plano MEI Básico", valor: "R$ 59,99/mês", categoriaLabel: "MEI", valor: "R$ 59,99", descricao: "Manutenção mensal essencial para seu MEI.", inclusos: ["DAS Mensal", "DASN Anual", "Suporte"] },
      "mei-plano-premium": { titulo: "Plano MEI Premium", valor: "R$ 89,99/mês", categoriaLabel: "MEI", valor: "R$ 89,99", descricao: "Gestão completa para o seu negócio.", inclusos: ["DAS Mensal", "Certidões", "Parcelamentos", "Suporte Prioritário"] },
      "abertura-mei": { titulo: "Abertura de MEI", categoriaLabel: "MEI", valor: "R$ 99,99", descricao: "Formalização completa do seu CNPJ MEI.", inclusos: ["CNPJ", "Inscrição Municipal", "CCMEI"] },
      "regularizacao-mei": { titulo: "Regularização de MEI", categoriaLabel: "MEI", valor: "R$ 139,99", descricao: "Coloque seu MEI em dia com o governo.", inclusos: ["Análise de Débitos", "Regularização Fiscal"] },
      "baixa-mei": { titulo: "Baixa de MEI", categoriaLabel: "MEI", valor: "R$ 128,99", descricao: "Encerramento formal das atividades do MEI.", inclusos: ["Baixa CNPJ", "DASN de Extinção"] },
      "encerramento-mei": { titulo: "Encerramento de MEI", categoriaLabel: "MEI", valor: "R$ 89,99", descricao: "Baixa completa do MEI junto aos órgãos oficiais.", inclusos: ["Encerramento no portal", "Baixa do CNPJ", "Orientação final"] },
      "emissao-das": { titulo: "Emissão de DAS", categoriaLabel: "MEI", valor: "R$ 25,99", descricao: "Emissão da guia DAS do MEI.", inclusos: ["Cálculo do imposto", "Emissão da guia"] },
      dasn: { titulo: "Declaração Anual do MEI (DASN-SIMEI)", categoriaLabel: "MEI", valor: "R$ 79,99", descricao: "Envio da declaração anual obrigatória do MEI.", inclusos: ["Apuração do faturamento", "Envio da declaração"] },
      parcelamento: { titulo: "Parcelamento de Débitos do MEI", categoriaLabel: "MEI", valor: "R$ 85,99", descricao: "Parcelamento de débitos em atraso do MEI.", inclusos: ["Análise da dívida", "Simulação e parcelamento"] },
      "alteracao-mei": { titulo: "Alteração de Dados do MEI", categoriaLabel: "MEI", valor: "R$ 75,99", descricao: "Alteração de dados cadastrais do MEI.", inclusos: ["Alteração no cadastro", "Confirmação das mudanças"] }
    },
    "pessoa-fisica": {
      irpf: { titulo: "Imposto de Renda (IRPF)", categoriaLabel: "Pessoa Física", valor: "R$ 139,99", descricao: "Declaração anual completa e segura.", inclusos: ["Análise de Documentos", "Envio à Receita"] },
      "cpf-regularizacao": { titulo: "Regularização de CPF", categoriaLabel: "Pessoa Física", valor: "R$ 59,99", descricao: "Regularize seu CPF suspenso ou pendente.", inclusos: ["Consulta Receita", "Protocolo de Regularização"] },
      "carne-leao": { titulo: "Carnê-Leão", categoriaLabel: "Pessoa Física", valor: "R$ 129,99", descricao: "Gestão mensal de impostos.", inclusos: ["Emissão de DARF", "Análise de Deduções"] }
      },
    contabeis: {
      "consultoria-contabil": { titulo: "Consultoria Contábil", categoriaLabel: "Serviços Contábeis", valor: "R$ 199,99", descricao: "Suporte especializado para sua empresa.", inclusos: ["Análise de Balanço", "Orientação Fiscal"] },
      "regularizacao-empresa": { titulo: "Regularização de Empresa", categoriaLabel: "Serviços Contábeis", valor: "R$ 249,99", descricao: "Regularização de empresas (ME/EPP) em atraso.", inclusos: ["Certidões", "Regularização Junta/Receita"] },
      "alteracao-contratual": { titulo: "Alteração Contratual", categoriaLabel: "Serviços Contábeis", valor: "R$ 249,99", descricao: "Mudança de Dados", inclusos: ["Viabilidade de Alteração", "Atualização no CNPJ"] },
      "abertura-empresa": { titulo: "Abertura de Empresa", categoriaLabel: "Serviços Contábeis", valor: "R$ 299,99", descricao: "Abertura de novo CNPJ", inclusos: ["Elaboração do Contrato Social", "Emissão do CNPJ"] },
      "encerramento-empresa": { titulo: "Encerramento de Empresa", categoriaLabel: "Serviços Contábeis", valor: "R$ 499,99", descricao: "Baixa completa de empresas (ME/EPP).", inclusos: ["Distrato Social", "Baixa de Órgãos"] }
    },
    "certidoes-regularizacoes": {
      "certidao-negativa": { titulo: "Certidão Negativa de Débitos", categoriaLabel: "Certidões", valor: "R$ 35,99", descricao: "Emissão de CND Federal, Estadual ou Municipal.", inclusos: ["Consulta de Débitos", "Emissão do PDF"] },
      "certidao-fgts": { titulo: "Certidão de FGTS", categoriaLabel: "Certidões", valor: "R$ 35,99", descricao: "Emissão de regularidade FGTS.", inclusos: ["Consulta de Situação Fiscal", "Suporte à Regularização"] },
      "certidao-trabalhista": { titulo: "Certidão Trabalhista (CNDT)", categoriaLabel: "Certidões", valor: "R$ 35,99", descricao: "Comprovação de regularidade trabalhista.", inclusos: ["Consulta de Débitos", "Suporte à Regularização"] },
      "certidao-debitos": { titulo: "Certidão de Débitos Previdenciários", categoriaLabel: "Certidões", valor: "R$ 35,99", descricao: "Regularidade de contribuições previdenciárias.", inclusos: ["Consulta de Situação Fiscal", "Suporte à Regularização"] }
    },
    "certificado-digital": {
      "certificado-cpf": { titulo: "Certificado Digital e-CPF", categoriaLabel: "Certificado Digital", valor: "A partir de R$ 189,99", descricao: "Emissão de certificado digital para pessoa física.", inclusos: ["Validação Online", "Suporte"] },
      "certificado-cnpj": { titulo: "Certificado Digital e-CNPJ", categoriaLabel: "Certificado Digital", valor: "A partir de R$ 249,99", descricao: "Certificado em arquivo com validade de 1 ano.", inclusos: ["Validação Online", "Suporte"] },
      "renovacao-certificado": { titulo: "Renovação de Certificado Digital", categoriaLabel: "Certificado Digital", valor: "A partir de R$ 129,99", descricao: "Atualização de identidade digital.", inclusos: ["Validação Online", "Suporte"] }
    },
    outros: {
      "regularizacao-pendencias": { titulo: "Regularização de Pendências", categoriaLabel: "Outros", valor: "R$ 139,99", descricao: "Saneamento de débitos fiscais.", inclusos: ["Levantamento de Débitos", "Emissão de Relatório Final"] },
      "emissao-notas": { titulo: "Emissão de Notas Fiscais", categoriaLabel: "Outros", valor: "R$ 39,99", descricao: "Faturamento de serviços e vendas.", inclusos: ["Emissão de Notas (NF-e/NFS-e)", "Cancelamento e Correção"] }
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

  const params = new URLSearchParams(window.location.search);
  const cat = params.get("categoria")?.trim();
  const serv = (params.get("servico") || params.get("plano") || params.get("slug"))?.trim();
  const dados = servicosMock[cat]?.[serv];

  if (!dados) {
      const elDesc = document.getElementById("descricaoServico");
      if(elDesc) elDesc.innerHTML = `<span style="color: #ff4444;">Serviço não localizado.</span>`;
      return;
  }

  document.getElementById("nomeServico") && (document.getElementById("nomeServico").innerText = dados.titulo);
  document.getElementById("descricaoServico") && (document.getElementById("descricaoServico").innerText = dados.descricao);
  document.getElementById("valorServico") && (document.getElementById("valorServico").innerText = dados.valor);
  document.getElementById("inclusosServico") && (document.getElementById("inclusosServico").innerHTML = dados.inclusos.map(i => `<li>${i}</li>`).join(""));

  const bread = document.getElementById("breadcrumb");
  if (bread && cat) {
    const nomeCatAmigavel = nomesCategorias[cat] || "Categoria";
    const linkCategoria = `../${cat}/index.html`; 
    bread.innerHTML = `
        <a href="../../index.html">Início</a> 
        <span> › </span> 
        <a href="../index.html">Serviços</a> 
        <span> › </span> 
        <a href="${linkCategoria}">${nomeCatAmigavel}</a> 
        <span> › </span> 
        <strong style="color: #fff;">${dados.titulo}</strong>
    `;
  }

  const handleWhatsApp = (e) => {
    let v = e.target.value.replace(/\D/g, "");
    if (v.length > 11) v = v.slice(0, 11);
    v = v.replace(/^(\d{2})(\d)/g, "($1) $2");
    v = v.replace(/(\d{5})(\d)/, "$1-$2");
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
    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const whatsapp = document.getElementById("whatsapp").value.replace(/\D/g, "");
    const cpf = document.getElementById("cpf").value.replace(/\D/g, "");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    const nomeOk = nome.split(" ").length >= 2;
    const emailOk = emailRegex.test(email);
    const whatsappOk = whatsapp.length === 11;
    const cpfOk = cpf.length === 11;
    const todosOk = nomeOk && emailOk && whatsappOk && cpfOk;
    document.getElementById("btnEnviar").disabled = !todosOk;
    document.getElementById("btnAdicionarMais").disabled = !todosOk;
  }

  form.querySelectorAll('input, textarea').forEach(el => {
    el.addEventListener("input", validarFormulario);
  });

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const nome = document.getElementById("nome").value.trim();
      const email = document.getElementById("email").value.trim();
      const whatsapp = document.getElementById("whatsapp").value;
      const cpf = document.getElementById("cpf").value;

      botao.classList.add("loading");
      botao.disabled = true;
      botao.innerHTML = `<i class="fas fa-circle-notch fa-spin"></i> Enviando pedido...`;

      try {
          if (typeof supabase !== 'undefined') {
              const SB_URL = 'https://qdgsmnfhpbkbovptwwjp.supabase.co';
              const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkZ3NtbmZocGJrYm92cHR3d2pwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxNTQ1MzYsImV4cCI6MjA4MzczMDUzNn0.-fpxGBv738LflicnI2edM7ywwAmed3Uka4111fzTj8c'; 
              const client = supabase.createClient(SB_URL, SB_KEY);
              
              const { data: { session } } = await client.auth.getSession();
              
              if (session) {
                  // SALVANDO DADOS NO PERFIL (profiles)
                  // Tenta atualizar Nome, WhatsApp e CPF na tabela profiles
                  await client.from('profiles').upsert({ 
                      id: session.user.id,
                      nome: nome,
                      whatsapp: whatsapp,
                      cpf_cnpj: cpf,
                      email: session.user.email
                  });

                  // REGISTRANDO PEDIDO (assinaturas)
                  const payload = {
                      cliente_id: session.user.id,
                      plano_id: serv,
                      status: 'Pendente'
                  };

                  const { error: insertError } = await client.from('assinaturas').insert(payload);
                  if (insertError) {
                      console.error("Erro na tabela assinaturas:", insertError.message);
                  } else {
                      console.log("Pedido registrado com sucesso!");
                  }
              }
          }
      } catch (err) {
          console.error("Erro fatal no Supabase:", err);
      }

      const obs = document.getElementById("observacoes")?.value || "Nenhuma";
      
      // Emojis codificados diretamente para URL para evitar problemas de renderização/transmissão
      const rocket = '%F0%9F%9A%80'; // 🚀
      const tools = '%F0%9F%9B%A0';  // 🛠️
      const money = '%F0%9F%92%B0';  // 💰
      const person = '%F0%9F%91%A4'; // 👤
      const clipboard = '%F0%9F%93%9D'; // 📝
      const phone = '%F0%9F%93%B1';  // 📱
      const email_icon = '%F0%9F%93%A7'; // 📧
      const id_icon = '%F0%9F%86%94'; // 🆔
      const speech = '%F0%9F%92%A1'; // 💡

      const mensagemEncoded = 
        rocket + ' *NOVO PEDIDO - JL SERVIÇOS*%0A%0A' +
        tools + ' *Serviço:* ' + encodeURIComponent(dados.titulo) + '%0A' +
        money + ' *Valor:* ' + encodeURIComponent(dados.valor) + '%0A%0A' +
        person + ' *DADOS DO CLIENTE:*%0A' +
        clipboard + ' *Nome:* ' + encodeURIComponent(nome) + '%0A' +
        phone + ' *WhatsApp:* ' + encodeURIComponent(whatsapp) + '%0A' +
        email_icon + ' *E-mail:* ' + encodeURIComponent(email) + '%0A' +
        id_icon + ' *CPF:* ' + encodeURIComponent(cpf) + '%0A%0A' +
        speech + ' *Obs:* ' + encodeURIComponent(obs);

      const urlWhatsApp = `https://wa.me/5561920041427?text=${mensagemEncoded}`;
      window.open(urlWhatsApp, "_blank");
      
      // Redirecionar para o dashboard após o envio
      setTimeout(() => {
        window.location.href = '/servicos/area_do_cliente/dashboard.html';
      }, 1500);
    });
  }
});
