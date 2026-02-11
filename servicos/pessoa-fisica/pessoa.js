const servicosPessoaFisica = {
  'imposto-renda': {
    titulo: 'Declaração de Imposto de Renda',
    descricao: 'Elaboração e envio da declaração anual de IRPF.',
    valor: '139,99'
  },
  'ganho-capital': {
    titulo: 'Apuração de Ganho de Capital',
    descricao: 'Cálculo de imposto sobre venda de bens.',
    valor: '189,99'
  },
  'regularizacao-cpf': {
    titulo: 'Regularização de CPF',
    descricao: 'Correção de pendências e situação cadastral.',
    valor: '79,99'
  },
  'orientacao-fiscal': {
    titulo: 'Orientação Fiscal Personalizada',
    descricao: 'Atendimento individual para dúvidas fiscais.',
    valor: '119,99'
  }
};

// Redirecionamento para a página de compra
document.querySelectorAll(".service-card").forEach(card => {
  card.addEventListener("click", () => {
    const key = card.getAttribute("data-servico");
    if (key) {
      window.location.href = `../compra/?categoria=pessoa-fisica&servico=${key}`;
    }
  });
});

window.servicosCategoria = servicosPessoaFisica;
