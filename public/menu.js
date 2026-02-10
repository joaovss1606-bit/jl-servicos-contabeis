import { supabase } from './supabase.js'

// Seletores ajustados para o seu HTML atual
const menuToggle = document.getElementById('mobile-menu');
const navList = document.getElementById('nav-list');
const dropdownToggle = document.querySelector('.dropdown-toggle');
const dropdown = document.querySelector('.menu-item.dropdown');

/* --- MENU MOBILE --- */
if (menuToggle && navList) {
  menuToggle.addEventListener('click', () => {
    // Alterna a classe que definimos no CSS
    navList.classList.toggle('active');
    
    // Feedback visual no ícone (Barras vira X)
    const icon = menuToggle.querySelector('i');
    if (icon) {
      icon.classList.toggle('fa-bars');
      icon.classList.toggle('fa-times');
    }
  });
}

/* --- DROPDOWN (SERVIÇOS) --- */
if (dropdownToggle && dropdown) {
  let isDropdownOpen = false;

  dropdownToggle.addEventListener('click', (e) => {
    if (window.innerWidth <= 992) { // Ajustado para bater com o Media Query
      if (!isDropdownOpen) {
        e.preventDefault(); 
        e.stopPropagation();

        dropdown.classList.add('active');
        isDropdownOpen = true;
      }
    }
  });

  // Fecha ao clicar fora
  document.addEventListener('click', (e) => {
    if (dropdown && !dropdown.contains(e.target)) {
      dropdown.classList.remove('active');
      isDropdownOpen = false;
    }
  });
}

/* --- TESTE SUPABASE --- */
async function testSupabase() {
  try {
    const { data, error } = await supabase.from('assinaturas').select('*').limit(1);
    console.log('Supabase: Conexão verificada.');
  } catch (error) {
    console.warn('Supabase: Verifique as chaves e tabelas.');
  }
}

testSupabase();
