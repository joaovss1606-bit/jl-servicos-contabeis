const servicos = {
  'abertura-mei': {
    titulo: 'Abertura de MEI',
    inclusos: [
      'Análise do perfil',
      'Cadastro no Portal do Empreendedor',
      'Definição do CNAE',
      'Emissão do CNPJ',
      'Orientações iniciais'
    ]
  },
  'regularizacao-mei': {
    titulo: 'Regularização de MEI',
    inclusos: [
      'Diagnóstico completo',
      'Regularização de pendências',
      'Orientações fiscais'
    ]
  },
  'encerramento-mei': {
    titulo: 'Encerramento de MEI',
    inclusos: [
      'Análise prévia',
      'Baixa correta',
      'Orientações finais'
    ]
  }
}

// SERVIÇO ATUAL
const params = new URLSearchParams(window.location.search)
const servicoKey = params.get('servico')
const servico = servicos[servicoKey]

if (!servico) {
  document.body.innerHTML = '<p>Serviço não encontrado.</p>'
  throw new Error('Serviço inválido')
}

// RENDERIZA
document.getElementById('titulo-servico').textContent = servico.titulo
document.getElementById('servico').value = servicoKey

const lista = document.getElementById('lista-inclusos')
servico.inclusos.forEach(item => {
  const li = document.createElement('li')
  li.textContent = item
  lista.appendChild(li)
})

// VALIDAÇÃO
const nome = document.getElementById('nome')
const whatsapp = document.getElementById('whatsapp')
const btnEnviar = document.getElementById('btn-enviar')
const btnWhatsapp = document.getElementById('btn-whatsapp')

function validar() {
  if (nome.value.trim() && whatsapp.value.trim()) {
    btnEnviar.disabled = false
    btnEnviar.classList.add('ativo')
    btnWhatsapp.classList.remove('disabled')
  } else {
    btnEnviar.disabled = true
    btnEnviar.classList.remove('ativo')
    btnWhatsapp.classList.add('disabled')
  }
}

nome.addEventListener('input', validar)
whatsapp.addEventListener('input', validar)

// ENVIO
document.getElementById('form-pedido').addEventListener('submit', (e) => {
  e.preventDefault()

  const mensagem =
    `Olá! Meu nome é ${nome.value}.
Quero contratar o serviço: ${servico.titulo}.
WhatsApp: ${whatsapp.value}`

  const url = `https://wa.me/5500000000000?text=${encodeURIComponent(mensagem)}`
  window.open(url, '_blank')
})
