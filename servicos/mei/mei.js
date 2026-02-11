// Lógica para Serviços Avulsos
document.querySelectorAll(".service-card").forEach(card => {
  card.addEventListener("click", (e) => {
    e.preventDefault();
    const servico = card.getAttribute("data-servico");
    if (servico) {
      // Redireciona para a sua página de compra com os parâmetros
      window.location.href = `../compra/?categoria=mei&servico=${servico}`;
    }
  });
});

// Lógica para Planos
document.querySelectorAll('.btn-plan').forEach(botao => {
  botao.addEventListener('click', () => {
    const plano = botao.getAttribute("data-plano");
    if (plano) {
      window.location.href = `../compra/?categoria=mei&plano=${plano}`;
    }
  });
});
