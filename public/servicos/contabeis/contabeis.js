const servicosContabeis = {
  'consultoria-contabil': {
    titulo: 'Consultoria Contábil',
    descricao: 'Análise e orientação contábil especializada.',
    valor: '249,99'
  },
  'planejamento-tributario': {
    titulo: 'Planejamento Tributário',
    descricao: 'Estratégias para redução legal de impostos.',
    valor: '399,99'
  },
  'balanco-patrimonial': {
    titulo: 'Elaboração de Balanço',
    descricao: 'Balanço patrimonial e demonstrativos.',
    valor: '349,99'
  },
  'regularizacao-empresa': {
    titulo: 'Regularização de Empresa',
    descricao: 'Ajuste de pendências em órgãos públicos.',
    valor: '299,99'
  },
  'encerramento-empresa': {
    titulo: 'Encerramento de Empresa',
    descricao: 'Baixa completa de CNPJ e obrigações.',
    valor: '279,99'
  }
};

// Redirecionamento para a página de compra
document.querySelectorAll(".service-card").forEach(card => {
  card.addEventListener("click", () => {
    const key = card.getAttribute("data-servico");
    if (key) {
      window.location.href = `../compra/?categoria=contabeis&servico=${key}`;
    }
  });
});

window.servicosCategoria = servicosContabeis;
