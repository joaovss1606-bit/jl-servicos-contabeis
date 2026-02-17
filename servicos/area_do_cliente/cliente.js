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
    return supabase.createClient(SB_URL, SB_KEY, {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
            storage: window.localStorage
        }
    });
}

// Função centralizada de redirecionamento
async function redirecionarUsuario(user) {
    console.log("Iniciando redirecionamento para:", user.email);
    
    try {
        const { data: profile } = await supabaseClient
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
        window.location.replace(targetUrl);
    } catch (err) {
        console.error("Erro no redirecionamento:", err);
        window.location.replace("/servicos/area_do_cliente/dashboard.html");
    }
}

// Inicialização da página
document.addEventListener('DOMContentLoaded', async () => {
    supabaseClient = initSupabase();
    if (!supabaseClient) return;

    const loginForm = document.getElementById('login-form');
    const errorMsg = document.getElementById('error-msg');

    // 1. Verifica se já existe uma sessão ativa
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session) {
        console.log("Sessão ativa detectada.");
        redirecionarUsuario(session.user);
        return;
    }

    // 2. Listener do formulário
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;

            if (errorMsg) errorMsg.style.display = 'none';

            try {
                const { data, error } = await supabaseClient.auth.signInWithPassword({
                    email,
                    password,
                });

                if (error) {
                    console.error("Erro Auth:", error.message);
                    if (errorMsg) {
                        errorMsg.innerText = "Usuário ou senha inválidos.";
                        errorMsg.style.display = 'block';
                    } else {
                        alert("Erro ao entrar: " + error.message);
                    }
                } else if (data.user) {
                    await redirecionarUsuario(data.user);
                }
            } catch (err) {
                console.error("Erro inesperado:", err);
            }
        });
    }
});

// Expor funções globais
window.checkUser = async function() {
    if (!supabaseClient) supabaseClient = initSupabase();
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (!session) {
        window.location.replace('/servicos/area_do_cliente/index.html');
        return null;
    }
    return session.user;
};

window.logout = async function() {
    if (!supabaseClient) supabaseClient = initSupabase();
    await supabaseClient.auth.signOut();
    window.location.replace('/servicos/area_do_cliente/index.html');
};

// Expor o cliente para uso em outras partes se necessário
window.supabaseClient = supabaseClient;
