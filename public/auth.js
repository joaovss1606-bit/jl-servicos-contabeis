const _supabaseUrl = 'https://qdgsmnfhpbkbovptwwjp.supabase.co';
const _supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // sua chave completa aqui
const supabase = supabase.createClient(_supabaseUrl, _supabaseKey);

// Função para o Cliente fazer Login
async function loginCliente(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if (error) {
        alert("Erro ao entrar: " + error.message);
    } else {
        window.location.href = "area-do-cliente.html"; // Redireciona após login
    }
}
