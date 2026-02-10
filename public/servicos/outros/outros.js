const outrosServicos = {
  'planilha-financeira': {
    titulo: 'Planilha Financeira Pessoal',
    descricao: 'Planilha simples para controle pessoal de gastos.',
    valor: '59,99'
  },
  'organizacao-documentos': {
    titulo: 'Organização de Documentos',
    descricao: 'Suporte na triagem e arquivamento documental.',
    valor: '179,99'
  },
  'orientacao-financeira': {
    titulo: 'Orientação Financeira Básica',
    descricao: 'Orientação inicial para finanças pessoais.',
    valor: '129,99'
  }
};

// Redirecionamento para a página de compra
document.querySelectorAll(".service-card").forEach(card => {
  card.addEventListener("click", () => {
    const key = card.getAttribute("data-servico");
    if (key) {
      // Redireciona para ../compra/ para manter a hierarquia de pastas
      window.location.href = `../compra/?categoria=outros-servicos&servico=${key}`;
    }
  });
});

window.servicosCategoria = outrosServicos;
