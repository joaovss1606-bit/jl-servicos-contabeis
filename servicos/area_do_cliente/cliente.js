const SB_URL = 'https://qdgsmnfhpbkbovptwwjp.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkZ3NtbmZocGJrYm92cHR3d2pwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxNTQ1MzYsImV4cCI6MjA4MzczMDUzNn0.-fpxGBv738LflicnI2edM7ywwAmed3Uka4111fzTj8c'; 

// Configuração para garantir persistência da sessão
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
    // Verificar se já está logado antes de mostrar o formulário
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
        if (session) {
            redirecionarUsuario(session.user);
        }
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            alert("Erro no login: " + error.message);
        } else {
            redirecionarUsuario(data.user);
        }
    });
}

async function redirecionarUsuario(user) {
    // Buscamos a ROLE para garantir que o Admin sempre vá para o lugar certo
    const { data: profile } = await supabaseClient
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    const EMAIL_ADMIN = "jlservicoscontabeis0@gmail.com";

    if (profile?.role === 'admin' || user.email === EMAIL_ADMIN) {
        window.location.href = "/servicos/area_do_cliente/admin.html";
    } else {
        const urlParams = new URLSearchParams(window.location.search);
        const servicoEscolhido = urlParams.get('servico');
        const categoriaEscolhida = urlParams.get('categoria');
        
        let redirectUrl = '/servicos/area_do_cliente/dashboard.html';
        const params = new URLSearchParams();
        
        if (servicoEscolhido) {
            params.append('contratar', servicoEscolhido);
            if (categoriaEscolhida) {
                params.append('categoria', categoriaEscolhida);
            }
            redirectUrl += `?${params.toString()}`;
        }
        
        window.location.href = redirectUrl;
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
