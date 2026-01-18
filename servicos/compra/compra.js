import { supabase } from '/jl-servicos-contabeis/supabase.js'

// ================= SERVIÇOS (POR CATEGORIA) =================
const catalogo = {
  mei: {
    nome: 'MEI',
    url: '/jl-servicos-contabeis/servicos/mei/',
    planosAnchor: '#planos',

    servicos: {
      'abertura-mei': {
        titulo: 'Abertura de MEI',
        valor: 'R$ 148,99',
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
        valor: 'R$ 198,99',
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
        valor: 'R$ 128,99',
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
        valor: 'R$ 48,99',
        inclusos: [
          'Emissão da guia DAS',
          'Verificação de valores',
          'Orientações de pagamento',
          'Envio da guia',
          'Suporte'
        ]
      },
      'dasn': {
        titulo: 'Declaração Anual DASN-SIMEI',
        valor: 'R$ 98,99',
        inclusos: [
          'Conferência das informações',
          'Envio da declaração',
          'Regularização de pendências',
          'Comprovante de envio',
          'Orientações finais'
        ]
      },
      'parcelamento': {
        titulo: 'Parcelamento de Débitos',
        valor: 'R$ 178,99',
        inclusos: [
          'Análise dos débitos',
          'Simulação de parcelamento',
          'Solicitação junto à Receita',
          'Acompanhamento',
          'Orientações'
        ]
      },
      'alteracao-mei': {
        titulo: 'Alteração de Dados do MEI',
        valor: 'R$ 78,99',
        inclusos: [
          'Alteração de dados cadastrais',
          'Atualização no Portal do Empreendedor',
          'Conferência final',
          'Orientações',
          'Suporte'
        ]
      }
    },

    planos: {
      basico: {
        titulo: 'Plano MEI Básico',
        valor: 'R$ 99,00 / mês',
        inclusos: [
          '✔ Emissão mensal do DAS',
          '✔ Lembretes de vencimento',
          '✔ DASN-SIMEI (1x ao ano)',
          '✔ Acompanhamento básico',
          '✔ Suporte via WhatsApp',
          '✔ 10% de desconto em serviços avulsos'
        ]
      },
      premium: {
        titulo: 'Plano MEI Premium',
        valor: 'R$ 159,00 / mês',
        inclusos: [
          '✔ Todos os benefícios do plano básico',
          '✔ Regularização fiscal completa',
          '✔ Parcelamento de débitos',
          '✔ Emissão de certidões',
          '✔ Orientação personalizada',
          '✔ Relatório mensal de situação',
          '✔ Suporte prioritário',
          '✔ 20% de desconto em serviços avulsos'
        ]
      }
    }
  }
}

// ================= PARAMS =================
const params = new URLSearchParams(window.location.search)
const categoriaKey = params.get('categoria')
const servicoKey = params.get('servico')
const planoKey = params.get('plano')

// ================= VALIDAÇÃO =================
const categoria = catalogo[categoriaKey]

if (!categoria) {
  alert('Categoria inválida.')
  throw new Error('Categoria inválida')
}

// ================= CONTEXTO =================
let tituloFinal = ''
let listaItens = []
let tipoPedido = ''
let valorFinal = ''

if (planoKey && categoria.planos[planoKey]) {
  const plano = categoria.planos[planoKey]
  tituloFinal = plano.titulo
  listaItens = plano.inclusos
  tipoPedido = `Plano - ${plano.titulo}`
  valorFinal = plano.valor

} else if (servicoKey && categoria.servicos[servicoKey]) {
  const servico = categoria.servicos[servicoKey]
  tituloFinal = servico.titulo
  listaItens = servico.inclusos
  tipoPedido = `Serviço - ${servico.titulo}`
  valorFinal = servico.valor

} else {
  alert('Serviço ou plano inválido.')
  throw new Error('Parâmetros inválidos')
}

// ================= BREADCRUMB =================
const breadcrumbCategoria = document.getElementById('breadcrumb-categoria')
breadcrumbCategoria.textContent = categoria.nome
breadcrumbCategoria.href = categoria.url

document.getElementById('breadcrumb-servico').textContent = tituloFinal
document.getElementById('titulo-servico').textContent = tituloFinal

// ================= RENDER =================
const lista = document.getElementById('lista-inclusos')
lista.innerHTML = ''
listaItens.forEach(item => {
  const li = document.createElement('li')
  li.textContent = item
  lista.appendChild(li)
})

const elValor = document.getElementById('valor-plano')
if (elValor) elValor.textContent = valorFinal

// ================= AVISO ECONOMIA =================
if (servicoKey && !planoKey) {
  const aviso = document.getElementById('aviso-economia')

  aviso.innerHTML = `
    🔥 Este serviço já está incluso nos planos mensais.<br>
    Economize contratando um plano completo.
    <br><br>
    <a href="${categoria.url}${categoria.planosAnchor}" class="btn-ver-planos">
      Ver planos
    </a>
  `
  aviso.style.display = 'block'
}

// ================= FORM =================
const form = document.getElementById('form-pedido')
const btnEnviar = document.getElementById('btn-enviar')

const campos = {
  nome: form.nome,
  email: form.email,
  cpf: form.cpf,
  whatsapp: form.whatsapp,
  obs: form.obs
}

function validar() {
  btnEnviar.disabled = !(
    campos.nome.value.trim() &&
    campos.email.value.trim() &&
    campos.cpf.value.trim() &&
    campos.whatsapp.value.trim()
  )
}

Object.values(campos).forEach(c =>
  c.addEventListener('input', validar)
)

// ================= ENVIO =================
btnEnviar.addEventListener('click', () => {
  if (btnEnviar.disabled) return

  const pedido = {
    categoria: categoriaKey,
    tipo: planoKey ? 'plano' : 'servico',
    item: tipoPedido,
    valor: valorFinal,
    nome: campos.nome.value.trim(),
    email: campos.email.value.trim(),
    cpf: campos.cpf.value.trim(),
    whatsapp: campos.whatsapp.value.trim(),
    obs: campos.obs.value.trim()
  }

  const msg = `
Novo pedido:

📌 ${pedido.item}
💰 Valor: ${pedido.valor}

👤 Nome: ${pedido.nome}
📧 Email: ${pedido.email}
📄 CPF: ${pedido.cpf}
📱 WhatsApp: ${pedido.whatsapp}
📝 Observações: ${pedido.obs || 'Nenhuma'}
`.trim()

  window.open(
    `https://wa.me/5561920041427?text=${encodeURIComponent(msg)}`,
    '_blank'
  )

  supabase.from('pedidos').insert(pedido)
})

// ================= MÁSCARAS =================
campos.cpf.addEventListener('input', () => {
  let v = campos.cpf.value.replace(/\D/g, '').slice(0, 11)
  v = v.replace(/(\d{3})(\d)/, '$1.$2')
  v = v.replace(/(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
  v = v.replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4')
  campos.cpf.value = v
})

campos.whatsapp.addEventListener('input', () => {
  let v = campos.whatsapp.value.replace(/\D/g, '').slice(0, 11)
  v = v.replace(/^(\d{2})(\d)/, '($1) $2')
  v = v.replace(/(\d{5})(\d)/, '$1-$2')
  campos.whatsapp.value = v
})