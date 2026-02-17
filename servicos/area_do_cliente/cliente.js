// Configurações do Supabase
const SB_URL = 'https://qdgsmnfhpbkbovptwwjp.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkZ3NtbmZocGJrYm92cHR3d2pwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxNTQ1MzYsImV4cCI6MjA4MzczMDUzNn0.-fpxGBv738LflicnI2edM7ywwAmed3Uka4111fzTj8c'; 

let supabaseClient;

function initSupabase() {
    if (typeof supabase === 'undefined') return null;
    if (!supabaseClient) {
        supabaseClient = supabase.createClient(SB_URL, SB_KEY, {
            auth: { persistSession: true, autoRefreshToken: true, storage: window.localStorage }
        });
    }
    return supabaseClient;
}

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
    if (client) await client.auth.signOut();
    window.location.href = '/servicos/area_do_cliente/index.html';
};
