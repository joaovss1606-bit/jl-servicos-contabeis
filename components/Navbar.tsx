import React from 'react';
import { AuthState, CompanyIdentity } from '../types.ts';
import { useLocation } from 'react-router-dom';

interface NavbarProps {
  auth: AuthState;
  onLogout: () => void;
  onNavigate: (path: string) => void;
  identity: CompanyIdentity;
}

const Navbar: React.FC<NavbarProps> = ({ auth, onLogout, onNavigate, identity }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <header className="site-header">
      <div className="container"> 
        {/* Identidade Visual - SÓ APARECE EM PÁGINAS INTERNAS PARA EVITAR DUPLICAÇÃO NA HOME */}
        {!isHomePage && (
          <div className="brand-identity-internal" onClick={() => onNavigate('/')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', marginBottom: '20px' }}>
            <img src="/logo.png" alt="JL Serviços" style={{ width: '60px', height: '60px', borderRadius: '50%', border: '2px solid #bd9617' }} />
            <div className="brand-text-internal">
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', color: '#bd9617', margin: 0, textTransform: 'uppercase' }}>J L Serviços Contábeis</h1>
            </div>
          </div>
        )}

        {/* Acesso do Cliente - Posicionado de forma absoluta ou fixa via CSS se necessário */}
        <div className="client-access-row">
           {!auth.isAuthenticated ? (
             <button onClick={() => onNavigate('/login')} className="btn-area-cliente" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
               <i className="fas fa-user-circle"></i> Login
             </button>
           ) : (
             <button onClick={onLogout} className="btn-area-cliente" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
               <i className="fas fa-sign-out-alt"></i> Sair
             </button>
           )}
        </div>

        {/* Menu de Navegação */}
        <nav className="navbar">
            <ul className="nav-links">
                <li><button onClick={() => onNavigate('/')}>Início</button></li>
                <li><a href="/servicos/">Serviços</a></li>
                <li><a href="/blog/">Blog</a></li>
                <li><button onClick={() => onNavigate('/sobre')}>Sobre</button></li>
                <li><a href="/lgpd/">LGPD</a></li>
            </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
