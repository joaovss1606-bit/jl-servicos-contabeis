/* FAQ Widget Logic - JL Serviços Contábeis */
// Importação direta do Supabase para garantir funcionamento em qualquer nível de pasta
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://qdgsmnfhpbkbovptwwjp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkZ3NtbmZocGJrYm92cHR3d2pwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxNTQ1MzYsImV4cCI6MjA4MzczMDUzNn0.-fpxGBv738LflicnI2edM7ywwAmed3Uka4111fzTj8c';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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
                <a href="https://wa.me/5561920041427" target="_blank" class="faq-menu-link" style="border-color: #25d366; color: #25d366;"><i class="fab fa-whatsapp"></i> Falar no WhatsApp</a>
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
    
    // Injetar CSS se não existir
    if (!document.querySelector('link[href*="faq-widget.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/faq-widget.css';
        document.head.appendChild(link);
    }

    // Garantir que o body existe antes de injetar
    const injectHTML = () => {
        if (!document.getElementById('faqFloatBtn')) {
            document.body.insertAdjacentHTML('beforeend', faqHTML);
            initFaq();
        }
    };

    if (document.body) {
        injectHTML();
    } else {
        document.addEventListener('DOMContentLoaded', injectHTML);
    }

    // 2. Elementos e Funções
    function initFaq() {
        const floatBtn = document.getElementById('faqFloatBtn');
        const menu = document.getElementById('faqMenu');
        const menuClose = document.getElementById('faqMenuClose');
        const modal = document.getElementById('faqModal');
        const modalClose = document.getElementById('faqModalClose');
        const openModalBtn = document.getElementById('faqOpenModalBtn');
        const faqForm = document.getElementById('faqForm');

        if (!floatBtn) return;

        const toggleMenu = () => menu.classList.toggle('active');
        const closeMenu = () => menu.classList.remove('active');
        const openModal = () => { closeMenu(); modal.classList.add('active'); };
        const closeModal = () => { modal.classList.remove('active'); if(faqForm) faqForm.reset(); };

        // Exportar para o escopo global
        window.openFaqModal = openModal;

        floatBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleMenu(); });
        menuClose.addEventListener('click', closeMenu);
        openModalBtn.addEventListener('click', openModal);
        modalClose.addEventListener('click', closeModal);

        if (faqForm) {
            faqForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const btn = document.getElementById('faqSubmitBtn');
                const pergunta = document.getElementById('faqPergunta').value;

                try {
                    btn.disabled = true;
                    btn.innerText = 'Enviando...';

                    const { data: { session } } = await supabase.auth.getSession();
                    
                    let userId = null;
                    let nomeCliente = 'Visitante';

                    if (session) {
                        userId = session.user.id;
                        const { data: profile } = await supabase.from('profiles').select('nome').eq('id', userId).maybeSingle();
                        nomeCliente = profile?.nome || session.user.user_metadata?.nome || session.user.email.split('@')[0];
                    }

                    const { error } = await supabase.from('faq').insert([
                        { 
                            pergunta: pergunta, 
                            cliente_id: userId,
                            cliente_nome: nomeCliente,
                            status: 'pendente'
                        }
                    ]);

                    if (error) throw error;

                    alert('Sua pergunta foi enviada com sucesso! Você poderá ver a resposta na página de Tira-Dúvidas assim que nossa equipe responder.');
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

        window.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
            if (e.target !== floatBtn && !menu.contains(e.target)) closeMenu();
        });
    }
})();
