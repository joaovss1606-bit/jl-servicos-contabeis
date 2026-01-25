const SB_URL = 'https://qdgsmnfhpbkbovptwwjp.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkZ3NtbmZocGJrYm92cHR3d2pwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxNTQ1MzYsImV4cCI6MjA4MzczMDUzNn0.-fpxGBv738LflicnI2edM7ywwAmed3Uka4111fzTj8c'; // Sua chave completa aqui

const supabaseClient = supabase.createClient(SB_URL, SB_KEY);

// --- LÓGICA DE LOGIN INTELIGENTE ---
const loginForm = document.getElementById('login-form');

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            alert("Erro no login: " + error.message);
        } else {
            // --- CONFIGURAÇÃO DE ADMIN ---
            const EMAIL_ADMIN = "jlservicoscontabeis0@gmail.com"; // <-- COLOQUE SEU E-MAIL EXATO AQUI

            if (data.user.email === EMAIL_ADMIN) {
                // Se for você, vai direto para o painel de controle
                window.location.href = 'admin.html';
            } else {
                // Se for cliente, mantém a lógica original de contratação
                const urlParams = new URLSearchParams(window.location.search);
                const servicoEscolhido = urlParams.get('servico');
                
                window.location.href = servicoEscolhido 
                    ? `dashboard.html?contratar=${servicoEscolhido}` 
                    : 'dashboard.html';
            }
        }
    });
}
// --- FUNÇÕES DE APOIO PARA O DASHBOARD ---

// 1. Verifica se o usuário está logado e retorna os dados
async function checkUser() {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
        window.location.href = 'index.html';
        return null;
    }
    return user;
}

// 2. Busca o nome no perfil (Profiles) em vez de usar o email
async function getProfileName(userId) {
    const { data, error } = await supabaseClient
        .from('profiles')
        .select('nome')
        .eq('id', userId)
        .single();
    
    return data ? data.nome : null;
}

// 3. Busca a última assinatura/pedido do usuário
async function getUltimaAssinatura(userId) {
    const { data, error } = await supabaseClient
        .from('pedidos')
        .select('*')
        .eq('id_usuario', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
    
    return data;
}

// 4. Logout
async function logout() {
    await supabaseClient.auth.signOut();
    window.location.href = 'index.html';
}
