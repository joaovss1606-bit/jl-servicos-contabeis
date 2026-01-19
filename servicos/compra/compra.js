const form = document.getElementById('formCompra');
const btn = document.getElementById('btnEnviar');
const whatsapp = document.getElementById('whatsapp');
const cpf = document.getElementById('cpf');
const observacoes = document.getElementById('observacoes');

function validar() {
  btn.disabled = !form.checkValidity();
}

form.addEventListener('input', validar);

// Máscara WhatsApp
whatsapp.addEventListener('input', () => {
  whatsapp.value = whatsapp.value
    .replace(/\D/g, '')
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .slice(0, 15);
});

// Máscara CPF
cpf.addEventListener('input', () => {
  cpf.value = cpf.value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    .slice(0, 14);
});

// Auto grow textarea
observacoes.addEventListener('input', () => {
  observacoes.style.height = 'auto';
  observacoes.style.height = observacoes.scrollHeight + 'px';
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  btn.textContent = 'Enviando...';
  btn.disabled = true;

  setTimeout(() => {
    alert('Pedido enviado!');
    btn.textContent = 'Enviar Pedido';
    form.reset();
    validar();
  }, 1500);
});
