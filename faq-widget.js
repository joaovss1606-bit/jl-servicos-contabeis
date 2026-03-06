/* FAQ Widget Logic - JL Serviços Contábeis */
(function() {
    const SUPABASE_URL = 'https://qdgsmnfhpbkbovptwwjp.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkZ3NtbmZocGJrYm92cHR3d2pwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxNTQ1MzYsImV4cCI6MjA4MzczMDUzNn0.-fpxGBv738LflicnI2edM7ywwAmed3Uka4111fzTj8c';

    // 1. Injetar HTML
    const faqHTML = `
        <div class="faq-float-btn" id="faqFloatBtn" title="Tira Dúvidas">?</div>
        <div id="faqMenu" class="faq-menu">
            <h3 style="color:#bd9617; margin-bottom:15px; font-family: 'Playfair Display', serif;">Central de Ajuda</h3>
            <a href="/servicos/tira-duvidas.html" class="faq-menu-link">Ver Perguntas Frequentes</a>
            <button id="faqOpenModalBtn" class="faq-menu-btn">Enviar uma Pergunta</button>
            <a href="https://wa.me/5561920041427" target="_blank" class="faq-menu-link" style="border-color: #25d366; color: #25d366;">Falar no WhatsApp</a>
        </div>
        <div id="faqModal" class="faq-modal">
            <div class="faq-modal-content">
                <h2 style="color:#bd9617; font-family: 'Playfair Display', serif;">Tira Dúvidas</h2>
                <p style="color: #ccc; margin-bottom: 20px;">Envie sua pergunta abaixo e responderemos em breve.</p>
                <textarea id="faqPergunta" rows="5" style="width:100%; background:rgba(255,255,255,0.05); border:1px solid #bd9617; color:white; padding:10px; margin-bottom:15px; border-radius:8px; resize: none;"></textarea>
                <button id="faqSubmitBtn" style="width:100%; background:#bd9617; color:white; border:none; padding:12px; border-radius:8px; font-weight:bold; cursor:pointer;">Enviar Pergunta</button>
                <button id="faqModalClose" style="margin-top:10px; background:transparent; color:#aaa; border:none; cursor:pointer; width:100%;">Fechar</button>
            </div>
        </div>
    `;

    const init = () => {
        if (document.getElementById('faqFloatBtn')) return;
        document.body.insertAdjacentHTML('beforeend', faqHTML);

        const floatBtn = document.getElementById('faqFloatBtn');
        const menu = document.getElementById('faqMenu');
        const modal = document.getElementById('faqModal');
        const openModalBtn = document.getElementById('faqOpenModalBtn');
        const closeModalBtn = document.getElementById('faqModalClose');
        const submitBtn = document.getElementById('faqSubmitBtn');

        floatBtn.onclick = (e) => { e.stopPropagation(); menu.classList.toggle('active'); };
        openModalBtn.onclick = () => { menu.classList.remove('active'); modal.classList.add('active'); };
        closeModalBtn.onclick = () => { modal.classList.remove('active'); };

        submitBtn.onclick = async () => {
            const pergunta = document.getElementById('faqPergunta').value;
            if (!pergunta) return alert('Digite sua dúvida.');
            
            submitBtn.disabled = true;
            submitBtn.innerText = 'Enviando...';

            try {
                // Carregar Supabase dinamicamente se necessário
                if (typeof supabase === 'undefined') {
                    const script = document.createElement('script');
                    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
                    document.head.appendChild(script);
                    await new Promise(r => script.onload = r);
                }

                const client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
                const { error } = await client.from('faq').insert([{ pergunta, status: 'pendente' }]);
                if (error) throw error;
                alert('Pergunta enviada com sucesso!');
                document.getElementById('faqPergunta').value = '';
                modal.classList.remove('active');
            } catch (err) {
                alert('Erro ao enviar. Tente o WhatsApp.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerText = 'Enviar Pergunta';
            }
        };

        window.onclick = (e) => {
            if (e.target === modal) modal.classList.remove('active');
            if (e.target !== floatBtn && !menu.contains(e.target)) menu.classList.remove('active');
        };
    };

    if (document.body) init(); else document.addEventListener('DOMContentLoaded', init);
})();
