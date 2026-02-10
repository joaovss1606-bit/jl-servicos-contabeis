const servicosCertificadoDigital = {
  'certificado-a1': {
    titulo: 'Certificado Digital A1',
    descricao: 'Certificado digital em arquivo eletrônico.',
    valor: '189,99'
  },
  'certificado-a3': {
    titulo: 'Certificado Digital A3',
    descricao: 'Certificado digital em token ou cartão.',
    valor: '249,99'
  },
  'renovacao-certificado': {
    titulo: 'Renovação de Certificado Digital',
    descricao: 'Renovação de certificados vencidos.',
    valor: '149,99'
  }
};

// Redirecionamento para a página de compra
document.querySelectorAll(".service-card").forEach(card => {
  card.addEventListener("click", () => {
    const key = card.getAttribute("data-servico");
    if (key) {
      // Caminho relativo para a pasta compra que está no mesmo nível de servicos/mei etc.
      window.location.href = `../compra/?categoria=certificado-digital&servico=${key}`;
    }
  });
});

window.servicosCategoria = servicosCertificadoDigital;
