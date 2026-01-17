import { supabase } from '/jl-servicos-contabeis/supabase.js'

/* ===============================
   SERVIÇOS
================================ */
const servicos = {
  'abertura-mei': {
    titulo: 'Abertura de MEI',
    inclusos: [
      'Análise do perfil do empreendedor',
      'Definição correta da atividade (CNAE)',
      'Cadastro no Portal do Empreendedor',
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
      'Regularização de débitos',
      'Orientações fiscais'
    ]
  },
  'encerramento-mei': {
    titulo: 'Encerramento de MEI',
    inclusos: [
      'Análise prévia',
      'Baixa correta',
      'Orientações pós-encerramento'
    ]
  },
  'emissao-das': {
    titulo: 'Emissão de DAS',
    inclusos: [
      'Emissão da guia',
      'Orientações de pagamento'
    ]
  },
  'dasn': {
    titulo: 'Declaração Anual DASN-SIMEI',
    inclusos: [
      'Conferência',
      'Envio da declaração',
      'Comprovante'
    ]
  },
  'parcelamento': {
    titulo: 'Parcelamento de Débitos',
    inclusos: [
      'Análise dos débitos',
      'Simulação',
      'Solicitação oficial'
    ]
  },
  'alteracao-mei': {
    titulo: 'Alteração de Dados do MEI',
    inclusos: [
      'Alteração cadastral',
      'Atualização no portal',
      'Conferência final'
    ]
  }
}

/* ===============================
   SERVIÇO SELECIONADO
================================ */
const params = new URLSearchParams(window.location.search)
const servicoKey = params.get('servico')
const servico = servicos[servicoKey]

if (!servico) {
  alert('Serviço inválido')
  throw new Error('Serviço inválido')
}

document.getElementById('titulo-servico').textContent = servico.titulo

const lista = document.getElementById('lista-inclusos')
lista.innerHTML = ''
servico.inclusos.forEach(item => {
  const li = document.createElement('li')
  li.textContent = item
  lista.appendChild(li)
})

/* ===============================
   FORM
================================ */
const form = document.getElementById('form-pedido')
const btnEnviar = document.getElementById('btn-enviar')

const nome = document.getElementById('nome')
const email = document.getElementById('email')
const cpf = document.getElementById('cpf')
const whatsapp = document.getElementById('whatsapp')
const obs = document.getElementById('obs')

/* ===============================
   MÁSCARAS
================================ */
cpf.addEventListener('input', () => {
  cpf.value = cpf.value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
})

whatsapp.addEventListener('input', () => {
  whatsapp.value = whatsapp.value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
})

/* ===============================
   VALIDAÇÃO (À PROVA DE FALHA)
================================ */
function somenteNumeros(valor) {
  return valor.replace(/\D/g, '')
}

function validarFormulario() {
  const cpfNum = somenteNumeros(cpf.value)
  const whatsappNum = somenteNumeros(whatsapp.value)

  const valido =
    nome.value.trim().length > 2 &&
    email.value.includes('@') &&
    cpfNum.length === 11 &&
    whatsappNum.length >= 10

  btnEnviar.disabled = !valido
  btnEnviar.classList.toggle('ativo', valido)
}

/* ESCUTA TODOS OS CAMPOS */
[nome, email, cpf, whatsapp, obs].forEach(campo => {
  campo.addEventListener('input', validarFormulario)
})

/* GARANTE ESTADO INICIAL */
validarFormulario()

/* ===============================
   ENVIO
================================ */
form.addEventListener('submit', async (e) => {
  e.preventDefault()
  if (btnEnviar.disabled) return

  btnEnviar.textContent = 'Enviando...'
  btnEnviar.disabled = true

  const pedido = {
    servico: servico.titulo,
    servico_key: servicoKey,
    nome: nome.value,
    email: email.value,
    cpf: cpf.value,
    whatsapp: whatsapp.value,
    observacao: obs.value || null
  }

  try {
    await supabase.from('pedidos').insert([pedido])
  } catch (err) {
    console.warn('Erro ao salvar no Supabase')
  }

  const mensagem = `
Olá, gostaria de contratar um serviço:

📌 Serviço: ${pedido.servico}
👤 Nome: ${pedido.nome}
📧 Email: ${pedido.email}
📄 CPF: ${pedido.cpf}
📱 WhatsApp: ${pedido.whatsapp}
📝 Observação: ${pedido.observacao || 'Não informada'}
`.trim()

  const url = `https://wa.me/61920041427?text=${encodeURIComponent(mensagem)}`
  window.open(url, '_blank')

  btnEnviar.textContent = 'Pedido enviado'
})
