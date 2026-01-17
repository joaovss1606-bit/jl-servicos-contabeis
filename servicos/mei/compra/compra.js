const servicos = {
  'abertura-mei': {
    titulo: 'Abertura de MEI',
    inclusos: [
      'Análise do perfil do empreendedor',
      'Cadastro no Portal do Empreendedor',
      'Definição correta da atividade (CNAE)',
      'Emissão do CNPJ',
      'Orientações iniciais'
    ]
  },
  'regularizacao-mei': {
    titulo: 'Regularização de MEI',
    inclusos: [
      'Diagnóstico completo',
      'Identificação de pendências',
      'Regularização fiscal',
      'Orientações'
    ]
  },
  'encerramento-mei': {
    titulo: 'Encerramento de MEI',
    inclusos: [
      'Análise prévia',
      'Encerramento correto',
      'Verificação de pendências',
      'Orientações finais'
    ]
  }
}

// CAPTURA SERVIÇO
const params = new URLSearchParams(window.location.search)
const key = params.get('servico')
const servico = servicos[key]

if (!servico) {
  document.body.innerHTML = '<p>Serviço não encontrado.</p>'
  throw new Error('Serviço inválido')
}

// RENDERIZA
document.getElementById('titulo-servico').textContent = servico.titulo
document.getElementById('servico').value = key

const lista = document.getElementById('lista-inclusos')
servico.inclusos.forEach(item => {
  const li = document.createElement('li')
  li.textContent = item
  lista.appendChild(li)
})

// AUTO-RESIZE TEXTAREA
const obs = document.getElementById('obs')
obs.addEventListener('input', () => {
  obs.style.height = 'auto'
  obs.style.height = obs.scrollHeight + 'px'
})

// VALIDAÇÃO
const nome = document.getElementById('nome')
const whatsapp = document.getElementById('whatsapp')
const btn = document.getElementById('btn-enviar')

function validar() {
  if (nome.value.trim() && whatsapp.value.trim()) {
    btn.disabled = false
    btn.classList.add('ativo')
  } else {
    btn.disabled = true
    btn.classList.remove('ativo')
  }
}

nome.addEventListener('input', validar)
whatsapp.addEventListener('input', validar)

// ENVIO WHATSAPP
document.getElementById('form-pedido').addEventListener('submit', (e) => {
  e.preventDefault()

  const mensagem = `
Olá! Quero contratar um serviço.

📌 Serviço: ${servico.titulo}
👤 Nome: ${nome.value}
📱 WhatsApp: ${whatsapp.value}
📝 Observações: ${obs.value || 'Nenhuma'}
  `.trim()

  const url = `https://ea.me/61920041427?text=${encodeURIComponent(mensagem)}`
  window.open(url, '_blank')
})
