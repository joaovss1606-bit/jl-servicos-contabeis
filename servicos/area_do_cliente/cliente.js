const SB_URL = 'https://qdgsmnfhpbkbovptwwjp.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkZ3NtbmZocGJrYm92cHR3d2pwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxNTQ1MzYsImV4cCI6MjA4MzczMDUzNn0.-fpxGBv738LflicnI2edM7ywwAmed3Uka4111fzTj8c'; 
const supabaseClient = supabase.createClient(SB_URL, SB_KEY);

// --- LÓGICA DE LOGIN INTELIGENTE ---
const loginForm = document.getElementById('login-form');

if (loginForm) {
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
            // Buscamos a ROLE para garantir que o Admin sempre vá para o lugar certo
            const { data: profile } = await supabaseClient
                .from('profiles')
                .select('role')
                .eq('id', data.user.id)
                .single();

            const EMAIL_ADMIN = "jlservicoscontabeis0@gmail.com";

            // REDIRECIONAMENTO ESTRATÉGICO
            if (profile?.role === 'admin' || data.user.email === EMAIL_ADMIN) {
                // Se você estiver na raiz, esse caminho está correto:
                window.location.href = window.location.href = "admin.html";
            } else {
                const urlParams = new URLSearchParams(window.location.search);
                const servicoEscolhido = urlParams.get('servico');
                
                const basePath = 'servicos/area_do_cliente/dashboard.html';
                window.location.href = servicoEscolhido 
                    ? `${basePath}?contratar=${servicoEscolhido}` 
                    : basePath;
            }
        }
    });
}

// --- FUNÇÕES DE APOIO (PARA USO NO DASHBOARD) ---

async function checkUser() {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
        // Se estiver dentro de /area_do_cliente/, precisa de ../../ para voltar
        window.location.href = '../../index.html'; 
        return null;
    }
    return user;
}

async function getProfileName(userId) {
    try {
        const { data } = await supabaseClient
            .from('profiles')
            .select('nome')
            .eq('id', userId)
            .single();
        return data ? data.nome : null;
    } catch (e) { return null; }
}

async function getUltimaAssinatura(userId) {
    const { data } = await supabaseClient
        .from('assinaturas')
        .select('*')
        .eq('cliente_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
    return data;
}

async function logout() {
    await supabaseClient.auth.signOut();
    window.location.href = '../../index.html';
}
