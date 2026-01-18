document.querySelectorAll(".service-card").forEach(card => {
  card.addEventListener("click", () => {
    const servico = card.dataset.servico;
    if (servico) {
      window.location.href = `/servicos/mei/compra/?servico=${servico}`;
    }
  });
});

document.querySelectorAll('.btn-plan').forEach(botao => {
  botao.addEventListener('click', () => {
    const plano = botao.dataset.plano
    if (!plano) return

    window.location.href =
      `/jl-servicos-contabeis/servicos/mei/compra/?plano=${plano}`
  })
})