document.querySelectorAll(".service-card").forEach(card => {
  card.addEventListener("click", () => {
    const servico = card.dataset.servico;
    if (servico) {
      window.location.href = `/servicos/mei/compra/?servico=${servico}`;
    }
  });
});
