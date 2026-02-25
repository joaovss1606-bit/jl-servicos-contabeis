/* FAQ Widget Logic - JL Serviços Contábeis */
import { supabase } from './supabase.js';

(function() {
    // 1. Injetar HTML do Botão, Menu e Modal
    const faqHTML = `
        <div class="faq-float-btn" id="faqFloatBtn" title="Tira Dúvidas">?</div>
        
        <div id="faqMenu" class="faq-menu">
            <div class="faq-menu-content">
                <span class="faq-menu-close" id="faqMenuClose">&times;</span>
                <h3>Central de Ajuda</h3>
                <a href="/servicos/tira-duvidas.html" class="faq-menu-link"><i class="fas fa-question-circle"></i> Ver Perguntas Frequentes</a>
                <button id="faqOpenModalBtn" class="faq-menu-btn"><i class="fas fa-paper-plane"></i> Enviar uma Pergunta</button>
            </div>
        </div>

        <div id="faqModal" class="faq-modal">
            <div class="faq-modal-content">
                <span class="faq-modal-close" id="faqModalClose">&times;</span>
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

    // 2. Elementos
    const floatBtn = document.getElementById('faqFloatBtn');
    const menu = document.getElementById('faqMenu');
    const menuClose = document.getElementById('faqMenuClose');
    const modal = document.getElementById('faqModal');
    const modalClose = document.getElementById('faqModalClose');
    const openModalBtn = document.getElementById('faqOpenModalBtn');
    const faqForm = document.getElementById('faqForm');

    // 3. Funções de Controle
    const toggleMenu = () => menu.classList.toggle('active');
    const closeMenu = () => menu.classList.remove('active');
    const openModal = () => { closeMenu(); modal.classList.add('active'); };
    const closeModal = () => { modal.classList.remove('active'); faqForm.reset(); };

    // 4. Event Listeners
    floatBtn.addEventListener('click', toggleMenu);
    menuClose.addEventListener('click', closeMenu);
    openModalBtn.addEventListener('click', openModal);
    modalClose.addEventListener('click', closeModal);

    // 5. Lógica de Envio
    if (faqForm) {
        faqForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('faqSubmitBtn');
            const pergunta = document.getElementById('faqPergunta').value;

            try {
                btn.disabled = true;
                btn.innerText = 'Enviando...';

                const { data: { session } } = await supabase.auth.getSession();
                if (!session) {
                    alert('Você precisa estar logado para enviar uma pergunta.');
                    window.location.href = '/servicos/area_do_cliente/index.html';
                    return;
                }

                const user = session.user;
                // Buscar nome do perfil
                const { data: profile } = await supabase.from('profiles').select('nome').eq('id', user.id).maybeSingle();
                const nomeCliente = profile?.nome || user.user_metadata?.nome || user.email.split('@')[0];

                const { error } = await supabase.from('faq').insert([
                    { 
                        pergunta: pergunta, 
                        cliente_id: user.id,
                        cliente_nome: nomeCliente,
                        status: 'pendente'
                    }
                ]);

                if (error) throw error;

                alert('Sua pergunta foi enviada com sucesso! Você será notificado assim que for respondida.');
                closeModal();
            } catch (err) {
                console.error('Erro ao enviar FAQ:', err);
                alert('Erro ao enviar pergunta: ' + (err.message || 'Tente novamente mais tarde.'));
            } finally {
                btn.disabled = false;
                btn.innerText = 'Enviar Pergunta';
            }
        });
    }

    // Fechar ao clicar fora
    window.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
        if (e.target === menu) closeMenu();
    });
})();
