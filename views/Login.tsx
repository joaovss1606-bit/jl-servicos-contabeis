import React, { useState } from 'react';
import { UserRole, CompanyIdentity } from '../types.ts';
import { MOCK_ADMIN_USER } from '../constants.ts';

interface LoginProps {
  onLogin: (user: any) => void;
  onBack: () => void;
  onRegister: () => void;
  onResetPassword: () => void;
  identity: CompanyIdentity;
}

const Login: React.FC<LoginProps> = ({ onLogin, onBack, onRegister, onResetPassword, identity }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      if (email === 'admin@escritorio.com.br') {
        onLogin(MOCK_ADMIN_USER);
      } else {
        onLogin({
          id: 'client-' + Math.random().toString(36).substr(2, 9),
          name: email.split('@')[0],
          email,
          role: UserRole.CLIENTE,
          createdAt: new Date().toISOString(),
          isPlanActive: false
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="login-page-container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div className="login-card" style={{ maxWidth: '450px', width: '100%', background: '#0e2a47', borderRadius: '20px', border: '1px solid rgba(189, 150, 23, 0.3)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', overflow: 'hidden' }}>
        <div className="p-8" style={{ padding: '40px' }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#bd9617', cursor: 'pointer', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold', fontSize: '0.9rem' }}>
            <i className="fas fa-chevron-left"></i> VOLTAR
          </button>
          
          <div className="text-center mb-10" style={{ marginBottom: '40px' }}>
            <div 
              className="login-icon"
              style={{ width: '80px', height: '80px', borderRadius: '50%', border: '2px solid #bd9617', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 20px', color: '#bd9617', background: 'rgba(189, 150, 23, 0.1)' }}
            >
              <i className="fas fa-lock"></i>
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 700, color: '#bd9617', margin: '0 0 10px', textTransform: 'uppercase' }}>{identity.name}</h2>
            <p style={{ color: '#ffffff', opacity: 0.7, fontSize: '1rem' }}>Acesse sua área restrita</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            <div className="form-group">
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: '#bd9617', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>E-mail</label>
              <div style={{ position: 'relative' }}>
                <i className="fas fa-envelope" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(189, 150, 23, 0.5)' }}></i>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(189, 150, 23, 0.2)', borderRadius: '10px', padding: '15px 15px 15px 45px', color: '#ffffff', outline: 'none', transition: 'all 0.3s' }}
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#bd9617', textTransform: 'uppercase', letterSpacing: '1px' }}>Senha</label>
                <button type="button" onClick={onResetPassword} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 'bold' }}>Esqueceu a senha?</button>
              </div>
              <div style={{ position: 'relative' }}>
                <i className="fas fa-key" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(189, 150, 23, 0.5)' }}></i>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(189, 150, 23, 0.2)', borderRadius: '10px', padding: '15px 15px 15px 45px', color: '#ffffff', outline: 'none', transition: 'all 0.3s' }}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              style={{ width: '100%', background: '#bd9617', color: '#0b1c2d', padding: '18px', borderRadius: '10px', fontWeight: '800', fontSize: '1rem', border: 'none', cursor: 'pointer', transition: 'all 0.3s', marginTop: '10px', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
            >
              {isLoading ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                <>ENTRAR NO SISTEMA <i className="fas fa-sign-in-alt"></i></>
              )}
            </button>
          </form>

          <div style={{ marginTop: '40px', paddingTop: '30px', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>Ainda não tem conta? <button onClick={onRegister} style={{ background: 'none', border: 'none', color: '#bd9617', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}>Cadastre-se aqui</button></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
