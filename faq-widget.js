/* FAQ Widget Logic */
(function() {
    // 1. Injetar HTML do Botão e Modal
    const faqHTML = `
        <a href="/servicos/tira-duvidas.html" class="faq-float-btn" title="Tira Dúvidas">?</a>
        
        <div id="faqModal" class="faq-modal">
            <div class="faq-modal-content">
                <span class="faq-modal-close" onclick="closeFaqModal()">&times;</span>
                <h2>Tira Dúvidas</h2>
                <p>Não encontrou o que procura? Envie sua pergunta abaixo e responderemos em breve.</p>
                <form id="faqForm" class="faq-form">
                    <textarea id="faqPergunta" rows="5" placeholder="Digite sua dúvida aqui..." required></textarea>
                    <button type="submit" id="faqSubmitBtn" class="faq-submit-btn">Enviar Pergunta</button>
                </form>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', faqHTML);

    // 2. Funções de Controle
    window.openFaqModal = function(e) {
        if (e) e.preventDefault();
        document.getElementById('faqModal').classList.add('active');
    };

    window.closeFaqModal = function() {
        document.getElementById('faqModal').classList.remove('active');
        document.getElementById('faqForm').reset();
    };

    // 3. Lógica de Envio
    const faqForm = document.getElementById('faqForm');
    if (faqForm) {
        faqForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('faqSubmitBtn');
            const pergunta = document.getElementById('faqPergunta').value;

            try {
                btn.disabled = true;
                btn.innerText = 'Enviando...';

                // Verificar se o Supabase está disponível
                if (typeof supabaseClient === 'undefined') {
                    throw new Error('Supabase não inicializado. Por favor, faça login primeiro.');
                }

                const { data: { user } } = await supabaseClient.auth.getUser();
                if (!user) {
                    alert('Você precisa estar logado para enviar uma pergunta.');
                    window.location.href = '/servicos/area_do_cliente/index.html';
                    return;
                }

                // Buscar nome do perfil
                const { data: profile } = await supabaseClient.from('profiles').select('nome').eq('id', user.id).maybeSingle();
                const nomeCliente = profile?.nome || user.user_metadata?.nome || user.email.split('@')[0];

                const { error } = await supabaseClient.from('faq').insert([
                    { 
                        pergunta: pergunta, 
                        cliente_id: user.id,
                        cliente_nome: nomeCliente,
                        status: 'pendente'
                    }
                ]);

                if (error) throw error;

                alert('Sua pergunta foi enviada com sucesso! Você será notificado assim que for respondida.');
                closeFaqModal();
            } catch (err) {
                console.error('Erro ao enviar FAQ:', err);
                alert('Erro ao enviar pergunta: ' + (err.message || 'Tente novamente mais tarde.'));
            } finally {
                btn.disabled = false;
                btn.innerText = 'Enviar Pergunta';
            }
        });
    }

    // Fechar modal ao clicar fora
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('faqModal');
        if (e.target === modal) closeFaqModal();
    });
})();
