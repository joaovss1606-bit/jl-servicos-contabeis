import { supabase } from './supabase.js';

async function updateAuthHeader() {
  const { data: { session } } = await supabase.auth.getSession();
  const loginBtn = document.querySelector('.btn-area-cliente');
  
  if (session && session.user && loginBtn) {
    let name = '';
    
    // Tentar pegar o nome do perfil
    try {
      const { data: profile } = await supabase.from('profiles').select('full_name, first_name, last_name').eq('id', session.user.id).single();
      if (profile) {
        if (profile.full_name) {
          name = profile.full_name;
        } else if (profile.first_name) {
          name = profile.first_name + (profile.last_name ? ' ' + profile.last_name : '');
        }
      }
    } catch (e) {
      console.error('Erro ao buscar perfil:', e);
    }

    // Se não encontrar no perfil, tenta o metadata do user ou o email
    if (!name) {
      name = session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email.split('@')[0];
    }

    // Tratar nome do admin específico se for o email do admin
    if (session.user.email === 'jlservicoscontabeis0@gmail.com') {
        name = 'JL Serviços Contábeis Online';
    }

    // Pegar apenas o primeiro e segundo nome se houver
    const nameParts = name.split(' ');
    const displayName = nameParts.length > 1 ? `${nameParts[0]} ${nameParts[1]}` : nameParts[0];

    // Atualizar o botão de login para mostrar o nome
    loginBtn.innerHTML = `<i class="fas fa-user-circle"></i> Olá, ${displayName}`;
    loginBtn.href = '/servicos/area_do_cliente/dashboard.html';
    
    // Verificar se é admin para redirecionar corretamente
    try {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
        if (profile?.role === 'admin' || session.user.email === 'jlservicoscontabeis0@gmail.com') {
            loginBtn.href = '/servicos/area_do_cliente/admin.html';
        } else {
            loginBtn.href = '/servicos/area_do_cliente/dashboard.html';
        }
    } catch (e) {
        loginBtn.href = '/servicos/area_do_cliente/dashboard.html';
    }
  }
}

document.addEventListener('DOMContentLoaded', updateAuthHeader);
window.addEventListener('load', updateAuthHeader);
