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
      <div className="container header-stack"> 
        {/* Identidade Visual - Aparece de forma diferente na Home via CSS */}
        <div className="brand-identity" onClick={() => onNavigate('/')} style={{ cursor: 'pointer' }}>
          <img src="/logo.png" alt="JL Serviços" className="site-logo-circle" />
          <div className="brand-text">
            <h1 className="site-title-header">J L Serviços Contábeis</h1>
            <p className="site-subtitle-header">Atendimento Online para todo o Brasil</p>
          </div>
        </div>

        {/* Acesso do Cliente */}
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
