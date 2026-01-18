import { supabase } from '/jl-servicos-contabeis/supabase.js'

// ================= SERVIÇOS =================
const servicos = {
  'abertura-mei': {
    titulo: 'Abertura de MEI',
    inclusos: [
      'Análise do perfil do empreendedor',
      'Cadastro no Portal do Empreendedor',
      'Definição correta da atividade (CNAE)',
      'Emissão do CNPJ',
      'Orientações iniciais',
      'Suporte após a abertura'
    ]
  },
  'regularizacao-mei': {
    titulo: 'Regularização de MEI',
    inclusos: [
      'Diagnóstico da situação',
      'Identificação de pendências',
      'Regularização de DAS',
      'Orientações fiscais',
      'Suporte completo'
    ]
  },
  'encerramento-mei': {
    titulo: 'Encerramento de MEI',
    inclusos: [
      'Análise antes da baixa',
      'Encerramento correto',
      'Verificação de pendências',
      'Orientações pós-baixa',
      'Suporte'
    ]
  },
  'emissao-das': {
    titulo: 'Emissão de DAS',
    inclusos: [
      'Emissão da guia DAS',
      'Orientações de vencimento',
      'Envio da guia',
      'Suporte'
    ]
  },
  'dasn': {
    titulo: 'Declaração Anual DASN-SIMEI',
    inclusos: [
      'Conferência de dados',
      'Envio da declaração',
      'Comprovante',
      'Orientações'
    ]
  },
  'parcelamento': {
    titulo: 'Parcelamento de Débitos',
    inclusos: [
      'Análise dos débitos',
      'Simulação de parcelamento',
      'Solicitação junto à Receita',
      'Orientações'
    ]
  },
  'alteracao-mei': {
    titulo: 'Alteração de Dados do MEI',
    inclusos: [
      'Alteração cadastral',
      'Atualização no portal',
      'Conferência final',
      'Orientações'
    ]
  }
}

// ================= SERVIÇO =================
const params = new URLSearchParams(window.location.search)
const servicoKey = params.get('servico')

if (!servicoKey || !servicos[servicoKey]) {
  alert('Serviço inválido.')
  throw new Error('Serviço inválido')
}

const servico = servicos[servicoKey]

// ================= RENDER =================
document.getElementById('titulo-servico').textContent = servico.titulo
document.getElementById('servico').value = servicoKey

const lista = document.getElementById('lista-inclusos')
lista.innerHTML = ''
servico.inclusos.forEach(item => {
  const li = document.createElement('li')
  li.textContent = item
  lista.appendChild(li)
})

// ================= CAMPOS =================
const form = document.getElementById('form-pedido')
const btnEnviar = document.getElementById('btn-enviar')

const campoNome = form.querySelector('[name="nome"]')
const campoEmail = form.querySelector('[name="email"]')
const campoCPF = form.querySelector('[name="cpf"]')
const campoWhats = form.querySelector('[name="whatsapp"]')
const campoObs = form.querySelector('[name="obs"]')

// botão começa travado
btnEnviar.disabled = true

function validarFormulario() {
  const valido =
    campoNome.value.trim() &&
    campoEmail.value.trim() &&
    campoCPF.value.trim() &&
    campoWhats.value.trim()

  btnEnviar.disabled = !valido
  btnEnviar.classList.toggle('ativo', !!valido)
}

;[campoNome, campoEmail, campoCPF, campoWhats].forEach(campo => {
  campo.addEventListener('input', validarFormulario)
})

// bloqueia submit nativo
form.addEventListener('submit', e => e.preventDefault())

// ================= ENVIO =================
btnEnviar.addEventListener('click', () => {
  if (btnEnviar.disabled) return

  btnEnviar.textContent = 'Enviando...'
  btnEnviar.disabled = true

  const pedido = {
    servico: servicoKey,
    nome: campoNome.value.trim(),
    email: campoEmail.value.trim(),
    cpf: campoCPF.value.trim(),
    whatsapp: campoWhats.value.trim(),
    obs: campoObs.value.trim()
  }

  const mensagem = `
Novo pedido de serviço:

📌 Serviço: ${servico.titulo}
👤 Nome: ${pedido.nome}
📧 Email: ${pedido.email}
📄 CPF: ${pedido.cpf}
📱 WhatsApp: ${pedido.whatsapp}
📝 Observações: ${pedido.obs || 'Nenhuma'}
`.trim()

  // ✅ WhatsApp abre IMEDIATAMENTE
  window.open(
    `https://wa.me/5561920041427?text=${encodeURIComponent(mensagem)}`,
    '_blank'
  )

  // salva em segundo plano
  supabase.from('pedidos').insert(pedido)
})

// ================= MÁSCARAS =================
campoCPF.addEventListener('input', () => {
  let v = campoCPF.value.replace(/\D/g, '').slice(0, 11)
  v = v.replace(/(\d{3})(\d)/, '$1.$2')
  v = v.replace(/(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
  v = v.replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4')
  campoCPF.value = v
})

campoWhats.addEventListener('input', () => {
  let v = campoWhats.value.replace(/\D/g, '').slice(0, 11)
  v = v.replace(/^(\d{2})(\d)/, '($1) $2')
  v = v.replace(/(\d{5})(\d)/, '$1-$2')
  campoWhats.value = v
})
