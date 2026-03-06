/* FAQ Widget Logic - JL Serviços Contábeis */
(function() {
    const SUPABASE_URL = 'https://qdgsmnfhpbkbovptwwjp.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkZ3NtbmZocGJrYm92cHR3d2pwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxNTQ1MzYsImV4cCI6MjA4MzczMDUzNn0.-fpxGBv738LflicnI2edM7ywwAmed3Uka4111fzTj8c';

    // 1. Injetar CSS Crítico diretamente para garantir visibilidade
    const style = document.createElement('style');
    style.innerHTML = `
        .faq-float-btn {
            position: fixed !important;
            bottom: 30px !important;
            left: 30px !important;
            width: 60px !important;
            height: 60px !important;
            background: #bd9617 !important;
            color: white !important;
            border-radius: 50% !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 30px !important;
            font-weight: bold !important;
            cursor: pointer !important;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3) !important;
            z-index: 9999999 !important;
            transition: 0.3s !important;
            border: 2px solid rgba(255, 255, 255, 0.2) !important;
            text-decoration: none !important;
            font-family: Arial, sans-serif !important;
        }
        .faq-float-btn:hover { transform: scale(1.1); }
        .faq-menu {
            position: fixed !important;
            bottom: 100px !important;
            left: 30px !important;
            width: 280px !important;
            background: rgba(10, 25, 47, 0.98) !important;
            border: 1px solid #bd9617 !important;
            border-radius: 15px !important;
            padding: 20px !important;
            display: none;
            z-index: 9999998 !important;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5) !important;
            backdrop-filter: blur(10px) !important;
            color: white !important;
        }
        .faq-menu.active { display: block !important; }
        .faq-menu-link, .faq-menu-btn {
            display: block !important;
            width: 100% !important;
            padding: 12px !important;
            margin-bottom: 10px !important;
            background: rgba(255, 255, 255, 0.05) !important;
            border: 1px solid rgba(189, 150, 23, 0.3) !important;
            border-radius: 8px !important;
            color: white !important;
            text-decoration: none !important;
            text-align: left !important;
            font-size: 0.9rem !important;
            cursor: pointer !important;
        }
        .faq-modal {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            background: rgba(0, 0, 0, 0.8) !important;
            display: none;
            align-items: center !important;
            justify-content: center !important;
            z-index: 99999999 !important;
        }
        .faq-modal.active { display: flex !important; }
        .faq-modal-content {
            background: #0a192f !important;
            width: 90% !important;
            max-width: 500px !important;
            padding: 30px !important;
            border-radius: 20px !important;
            border: 1px solid #bd9617 !important;
            position: relative !important;
            color: white !important;
        }
    `;
    document.head.appendChild(style);

    // 2. Injetar HTML
    const faqHTML = `
        <div class="faq-float-btn" id="faqFloatBtn" title="Tira Dúvidas">?</div>
        <div id="faqMenu" class="faq-menu">
            <h3 style="color:#bd9617; margin-bottom:15px;">Central de Ajuda</h3>
            <a href="/servicos/tira-duvidas.html" class="faq-menu-link">Ver Perguntas Frequentes</a>
            <button id="faqOpenModalBtn" class="faq-menu-btn">Enviar uma Pergunta</button>
            <a href="https://wa.me/5561920041427" target="_blank" class="faq-menu-link" style="border-color: #25d366; color: #25d366;">Falar no WhatsApp</a>
        </div>
        <div id="faqModal" class="faq-modal">
            <div class="faq-modal-content">
                <h2 style="color:#bd9617;">Tira Dúvidas</h2>
                <p>Envie sua pergunta abaixo e responderemos em breve.</p>
                <textarea id="faqPergunta" rows="5" style="width:100%; background:rgba(255,255,255,0.05); border:1px solid #bd9617; color:white; padding:10px; margin-bottom:15px; border-radius:8px;"></textarea>
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
