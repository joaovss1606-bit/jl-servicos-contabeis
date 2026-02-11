const servicosCertidoes = {
  'certidao-negativa': {
    titulo: 'Certidão Negativa de Débitos',
    valor: '79,99'
  },
  'regularizacao-cadastral': {
    titulo: 'Regularização Cadastral',
    valor: '149,99'
  },
  'certidao-estadual': {
    titulo: 'Certidão Estadual',
    valor: '69,99'
  },
  'certidao-municipal': {
    titulo: 'Certidão Municipal',
    valor: '69,99'
  }
};

// Lógica de Redirecionamento para Compra
document.querySelectorAll(".service-card").forEach(card => {
  card.addEventListener("click", () => {
    const servicoKey = card.getAttribute("data-servico");
    if (servicoKey) {
      // Redireciona para a página de compra (uma pasta acima, na pasta 'compra')
      // Ajuste o caminho se sua página de compra estiver em outro local
      window.location.href = `../compra/?categoria=certidoes-regularizacoes&servico=${servicoKey}`;
    }
  });
});

window.servicosCategoria = servicosCertidoes;
