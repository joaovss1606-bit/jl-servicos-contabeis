// Configurações do Supabase
const SB_URL = 'https://qdgsmnfhpbkbovptwwjp.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkZ3NtbmZocGJrYm92cHR3d2pwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxNTQ1MzYsImV4cCI6MjA4MzczMDUzNn0.-fpxGBv738LflicnI2edM7ywwAmed3Uka4111fzTj8c'; 

// Inicialização do Cliente Supabase com persistência forçada
const supabaseClient = supabase.createClient(SB_URL, SB_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage
  }
});

// Função centralizada de redirecionamento
async function redirecionarUsuario(user) {
    console.log("Iniciando redirecionamento para:", user.email);
    
    try {
        // Busca o perfil para verificar a role
        const { data: profile, error: profileError } = await supabaseClient
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        const EMAIL_ADMIN = "jlservicoscontabeis0@gmail.com";
        let targetUrl = "";

        // Lógica de decisão de destino
        if (profile?.role === 'admin' || user.email === EMAIL_ADMIN) {
            targetUrl = "/servicos/area_do_cliente/admin.html";
        } else {
            // Verifica se há intenção de contratação na URL
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
        // Uso de replace para evitar que o usuário volte para a página de login ao clicar em "voltar"
        window.location.replace(targetUrl);
    } catch (err) {
        console.error("Erro no redirecionamento:", err);
        window.location.replace("/servicos/area_do_cliente/dashboard.html");
    }
}

// Inicialização da página
document.addEventListener('DOMContentLoaded', async () => {
    const loginForm = document.getElementById('login-form');
    const errorMsg = document.getElementById('error-msg');

    // 1. Verifica se já existe uma sessão ativa ao carregar a página
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session) {
        console.log("Sessão ativa detectada no carregamento.");
        redirecionarUsuario(session.user);
        return;
    }

    // 2. Configura o listener do formulário de login
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
                    console.error("Erro Supabase Auth:", error.message);
                    if (errorMsg) {
                        errorMsg.innerText = "Usuário ou senha inválidos.";
                        errorMsg.style.display = 'block';
                    } else {
                        alert("Erro ao entrar: " + error.message);
                    }
                } else if (data.user) {
                    console.log("Login realizado com sucesso.");
                    await redirecionarUsuario(data.user);
                }
            } catch (err) {
                console.error("Erro inesperado:", err);
                alert("Ocorreu um erro inesperado. Tente novamente.");
            }
        });
    }
});

// Funções globais para uso em outras páginas (Dashboard/Admin)
window.checkUser = async function() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (!session) {
        window.location.replace('/servicos/area_do_cliente/index.html');
        return null;
    }
    return session.user;
};

window.logout = async function() {
    await supabaseClient.auth.signOut();
    window.location.replace('/servicos/area_do_cliente/index.html');
};
