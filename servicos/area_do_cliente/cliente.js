const SB_URL = 'https://qdgsmnfhpbkbovptwwjp.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkZ3NtbmZocGJrYm92cHR3d2pwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxNTQ1MzYsImV4cCI6MjA4MzczMDUzNn0.-fpxGBv738LflicnI2edM7ywwAmed3Uka4111fzTj8c'; // Mantenha sua chave completa aqui

const supabaseClient = supabase.createClient(SB_URL, SB_KEY);

const loginForm = document.getElementById('login-form');

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            alert("Erro no login: " + error.message);
        } else {
            console.log("Sucesso!");

            // --- INÍCIO DA ALTERAÇÃO ---
            // 1. Verifica se existe um serviço na URL (ex: ?servico=...)
            const urlParams = new URLSearchParams(window.location.search);
            const servicoEscolhido = urlParams.get('servico');

            if (servicoEscolhido) {
                // Se escolheu algo, vai para o dashboard levando a info no parâmetro 'contratar'
                window.location.href = `dashboard.html?contratar=${servicoEscolhido}`;
            } else {
                // Login normal sem serviço prévio
                window.location.href = 'dashboard.html';
            }
            // --- FIM DA ALTERAÇÃO ---
        }
    });
}

async function checkUser() {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
        window.location.href = 'index.html';
    }
    return user;
}

async function logout() {
    await supabaseClient.auth.signOut();
    window.location.href = 'index.html';
}
