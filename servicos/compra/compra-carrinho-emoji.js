// Função para criar mensagem com emojis usando códigos Unicode
function criarMensagemWhatsApp(nome, whatsapp, email, cpf, listaServicos, obs) {
  // Usando códigos Unicode diretos para emojis
  const rocket = '\u{1F680}';      // 🚀
  const person = '\u{1F464}';      // 👤
  const clipboard = '\u{1F4DD}';   // 📝
  const phone = '\u{1F4F1}';       // 📱
  const email_icon = '\u{1F4E7}';  // 📧
  const id = '\u{1F194}';          // 🆔
  const tools = '\u{1F6E0}';       // 🛠️
  const comment = '\u{1F4AC}';     // 💬
  
  const mensagem = 
    rocket + ' *NOVO PEDIDO - JL SERVIÇOS*\n' +
    person + ' *DADOS DO CLIENTE:*\n' +
    clipboard + ' *Nome:* ' + nome + '\n' +
    phone + ' *WhatsApp:* ' + whatsapp + '\n' +
    email_icon + ' *E-mail:* ' + email + '\n' +
    id + ' *CPF:* ' + cpf + '\n\n' +
    tools + ' *SERVIÇOS SOLICITADOS:*\n' +
    listaServicos + '\n\n' +
    comment + ' *Obs:* ' + obs;
  
  return mensagem;
}
