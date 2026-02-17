const SB_URL = 'https://qdgsmnfhpbkbovptwwjp.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkZ3NtbmZocGJrYm92cHR3d2pwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxNTQ1MzYsImV4cCI6MjA4MzczMDUzNn0.-fpxGBv738LflicnI2edM7ywwAmed3Uka4111fzTj8c'; 

console.log("cliente.js carregado");

const supabaseClient = supabase.createClient(SB_URL, SB_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// --- LÓGICA DE LOGIN INTELIGENTE ---
const loginForm = document.getElementById('login-form');

if (loginForm) {
    console.log("Formulário de login encontrado");
    
    // Verificar se já está logado antes de mostrar o formulário
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
        if (session) {
            console.log("Sessão ativa encontrada, redirecionando...");
            redirecionarUsuario(session.user);
        }
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("Evento de submit disparado");
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        console.log("Tentando login para:", email);

        try {
            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                console.error("Erro no login:", error.message);
                alert("Erro no login: " + error.message);
            } else {
                console.log("Login bem-sucedido, chamando redirecionarUsuario");
                await redirecionarUsuario(data.user);
            }
        } catch (err) {
            console.error("Erro inesperado durante o login:", err);
            alert("Erro inesperado: " + err.message);
        }
        
        return false;
    });
}

async function redirecionarUsuario(user) {
    console.log("Iniciando redirecionamento para o usuário:", user.id);
    
    try {
        // Buscamos a ROLE para garantir que o Admin sempre vá para o lugar certo
        const { data: profile, error: profileError } = await supabaseClient
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profileError) {
            console.warn("Erro ao buscar perfil (pode ser um novo usuário):", profileError.message);
        }

        const EMAIL_ADMIN = "jlservicoscontabeis0@gmail.com";
        let targetUrl = "";

        if (profile?.role === 'admin' || user.email === EMAIL_ADMIN) {
            console.log("Usuário é Admin");
            targetUrl = "/servicos/area_do_cliente/admin.html";
        } else {
            console.log("Usuário é Cliente");
            const urlParams = new URLSearchParams(window.location.search);
            const servicoEscolhido = urlParams.get('servico');
            const categoriaEscolhida = urlParams.get('categoria');
            
            targetUrl = '/servicos/area_do_cliente/dashboard.html';
            const params = new URLSearchParams();
            
            if (servicoEscolhido) {
                params.append('contratar', servicoEscolhido);
                if (categoriaEscolhida) {
                    params.append('categoria', categoriaEscolhida);
                }
                targetUrl += `?${params.toString()}`;
            }
        }
        
        console.log("Redirecionando para:", targetUrl);
        window.location.href = targetUrl;
    } catch (err) {
        console.error("Erro no processo de redirecionamento:", err);
        // Fallback para o dashboard em caso de erro na busca do perfil
        window.location.href = "/servicos/area_do_cliente/dashboard.html";
    }
}

// --- FUNÇÕES DE APOIO (PARA USO NO DASHBOARD) ---

async function checkUser() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (!session) {
       window.location.href = '/servicos/area_do_cliente/index.html'; 
        return null;
    }
    return session.user;
}

async function logout() {
    await supabaseClient.auth.signOut();
    window.location.href = '/servicos/area_do_cliente/index.html';
}
