// Configurações do Supabase
const SB_URL = 'https://qdgsmnfhpbkbovptwwjp.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkZ3NtbmZocGJrYm92cHR3d2pwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxNTQ1MzYsImV4cCI6MjA4MzczMDUzNn0.-fpxGBv738LflicnI2edM7ywwAmed3Uka4111fzTj8c'; 

let supabaseClient;

// Função para inicializar o cliente Supabase
function initSupabase() {
    if (typeof supabase === 'undefined') {
        console.error("Supabase SDK não carregado!");
        return null;
    }
    if (!supabaseClient) {
        supabaseClient = supabase.createClient(SB_URL, SB_KEY, {
            auth: {
                persistSession: true,
                autoRefreshToken: true,
                detectSessionInUrl: true,
                storage: window.localStorage
            }
        });
    }
    return supabaseClient;
}

// Função centralizada de redirecionamento
async function redirecionarUsuario(user) {
    console.log("Iniciando redirecionamento para:", user.email);
    
    try {
        const client = initSupabase();
        if (!client) return;

        const { data: profile, error: profileError } = await client
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        const EMAIL_ADMIN = "jlservicoscontabeis0@gmail.com";
        let targetUrl = "";

        if (profile?.role === 'admin' || user.email === EMAIL_ADMIN) {
            targetUrl = "/servicos/area_do_cliente/admin.html";
        } else {
            const urlParams = new URLSearchParams(window.location.search);
            const servico = urlParams.get('servico');
            const categoria = urlParams.get('categoria');
            
            if (servico) {
                targetUrl = `/servicos/compra/index.html?categoria=${categoria || ''}&servico=${servico}`;
            } else {
                targetUrl = "/servicos/area_do_cliente/dashboard.html";
            }
        }
        
        console.log("Destino definido:", targetUrl);
        window.location.href = targetUrl;
    } catch (err) {
        console.error("Erro crítico no redirecionamento:", err);
        window.location.href = "/servicos/area_do_cliente/dashboard.html";
    }
}

// Expor funções globais IMEDIATAMENTE
window.checkUser = async function() {
    const client = initSupabase();
    if (!client) return null;
    const { data: { session } } = await client.auth.getSession();
    if (!session) {
        window.location.href = '/servicos/area_do_cliente/index.html';
        return null;
    }
    return session.user;
};

window.logout = async function() {
    const client = initSupabase();
    if (client) {
        await client.auth.signOut();
    }
    window.location.href = '/servicos/area_do_cliente/index.html';
};

// Inicialização da página
async function startApp() {
    console.log("Inicializando aplicação...");
    const client = initSupabase();
    if (!client) {
        // Tenta novamente em 500ms se o SDK ainda não estiver pronto
        setTimeout(startApp, 500);
        return;
    }

    const loginForm = document.getElementById('login-form');
    const errorMsg = document.getElementById('error-msg');

    // 1. Verifica sessão ativa
    const { data: { session } } = await client.auth.getSession();
    if (session) {
        console.log("Sessão ativa detectada.");
        redirecionarUsuario(session.user);
        return;
    }

    // 2. Listener do formulário
    if (loginForm) {
        loginForm.onsubmit = async (e) => {
            e.preventDefault();
            console.log("Formulário enviado.");
            
            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');
            const submitBtn = loginForm.querySelector('button[type="submit"]');

            if (!emailInput || !passwordInput) return false;

            const email = emailInput.value.trim();
            const password = passwordInput.value;

            if (errorMsg) errorMsg.style.display = 'none';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerText = "ENTRANDO...";
            }

            try {
                const { data, error } = await client.auth.signInWithPassword({
                    email,
                    password,
                });

                if (error) {
                    console.error("Erro Auth:", error.message);
                    if (errorMsg) {
                        errorMsg.innerText = "Usuário ou senha inválidos.";
                        errorMsg.style.display = 'block';
                    }
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerText = "ENTRAR NO PAINEL";
                    }
                } else if (data.user) {
                    console.log("Login OK.");
                    await redirecionarUsuario(data.user);
                }
            } catch (err) {
                console.error("Erro inesperado:", err);
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerText = "ENTRAR NO PAINEL";
                }
            }
            return false;
        };
    }
}

// Executa a inicialização
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startApp);
} else {
    startApp();
}
