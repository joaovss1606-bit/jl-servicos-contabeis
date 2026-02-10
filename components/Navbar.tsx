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
        {!isHomePage && (
          <div className="brand-identity" onClick={() => onNavigate('/')} style={{ cursor: 'pointer' }}>
            <img src="/logo.png" alt="JL Serviços" className="site-logo-circle" />
            <div className="brand-text">
              <h1 className="site-title-header">J L Serviços Contábeis</h1>
              <p className="site-subtitle-header">Atendimento Online para todo o Brasil</p>
            </div>
          </div>
        )}

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
           <button className="menu-toggle" id="mobile-menu" aria-label="Abrir menu">
              <i className="fas fa-bars"></i>
           </button>
        </div>

        <nav className="navbar">
            <ul className="nav-links" id="nav-list">
                <li><button onClick={() => onNavigate('/')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>Início</button></li>
                <li><a href="/servicos/">Serviços</a></li>
                <li><a href="/blog/">Blog</a></li>
                <li><a href="/sobre/">Sobre</a></li>
                <li><a href="/lgpd/">LGPD</a></li>
            </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
