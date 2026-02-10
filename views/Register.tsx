import React, { useState } from 'react';
import { UserRole, CompanyIdentity } from '../types.ts';
import { LGPD_TEXT } from '../constants.ts';

interface RegisterProps {
  onRegister: (user: any) => void;
  onBack: () => void;
  onLogin: () => void;
  identity: CompanyIdentity;
}

const Register: React.FC<RegisterProps> = ({ onRegister, onBack, onLogin, identity }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    consent: false
  });
  const [step, setStep] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("As senhas não coincidem");
      return;
    }
    
    onRegister({
      id: 'client-' + Math.random().toString(36).substr(2, 9),
      name: formData.name,
      email: formData.email,
      role: UserRole.CLIENTE,
      createdAt: new Date().toISOString()
    });
  };

  return (
    <div className="register-page-container" style={{ background: '#0b1c2d', color: '#ffffff', minHeight: '100vh', padding: '40px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="register-card" style={{ maxWidth: '650px', width: '100%', background: '#0e2a47', borderRadius: '25px', border: '1px solid rgba(189, 150, 23, 0.3)', boxShadow: '0 30px 60px rgba(0,0,0,0.4)', overflow: 'hidden' }}>
        <div className="p-8" style={{ padding: '40px' }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#bd9617', cursor: 'pointer', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold', fontSize: '0.9rem' }}>
            <i className="fas fa-chevron-left"></i> VOLTAR
          </button>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
            <div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', color: '#bd9617', margin: '0 0 5px' }}>{identity.name}</h2>
              <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Crie sua conta no portal</p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: step === 1 ? '#bd9617' : 'rgba(255,255,255,0.1)' }}></div>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: step === 2 ? '#bd9617' : 'rgba(255,255,255,0.1)' }}></div>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '25px' }}>
            {step === 1 ? (
              <div style={{ display: 'grid', gap: '25px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', color: '#bd9617', textTransform: 'uppercase', marginBottom: '10px' }}>Nome Completo</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(189, 150, 23, 0.2)', borderRadius: '10px', padding: '15px', color: '#ffffff', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', color: '#bd9617', textTransform: 'uppercase', marginBottom: '10px' }}>E-mail</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(189, 150, 23, 0.2)', borderRadius: '10px', padding: '15px', color: '#ffffff', outline: 'none' }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', color: '#bd9617', textTransform: 'uppercase', marginBottom: '10px' }}>Senha</label>
                    <input 
                      type="password" 
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(189, 150, 23, 0.2)', borderRadius: '10px', padding: '15px', color: '#ffffff', outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 'bold', color: '#bd9617', textTransform: 'uppercase', marginBottom: '10px' }}>Confirmar</label>
                    <input 
                      type="password" 
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(189, 150, 23, 0.2)', borderRadius: '10px', padding: '15px', color: '#ffffff', outline: 'none' }}
                    />
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => setStep(2)}
                  style={{ width: '100%', background: '#bd9617', color: '#0b1c2d', padding: '18px', borderRadius: '12px', fontWeight: '800', border: 'none', cursor: 'pointer', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                >
                  CONTINUAR PARA LGPD <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '25px' }}>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '25px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', maxHeight: '250px', overflowY: 'auto' }}>
                  <h3 style={{ color: '#bd9617', fontSize: '1rem', fontWeight: 'bold', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <i className="fas fa-shield-alt"></i> Privacidade e LGPD
                  </h3>
                  <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                    {LGPD_TEXT}
                  </div>
                </div>

                <label style={{ display: 'flex', gap: '15px', padding: '20px', background: 'rgba(189, 150, 23, 0.05)', border: '1px solid rgba(189, 150, 23, 0.2)', borderRadius: '15px', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    required
                    checked={formData.consent}
                    onChange={(e) => setFormData({...formData, consent: e.target.checked})}
                    style={{ marginTop: '4px', width: '20px', height: '20px', accentColor: '#bd9617' }} 
                  />
                  <div style={{ fontSize: '0.9rem' }}>
                    <span style={{ fontWeight: 'bold', color: '#bd9617' }}>Aceito os termos e declaro veracidade.</span>
                    <p style={{ color: 'rgba(255,255,255,0.6)', margin: '5px 0 0' }}>
                      Compreendo que meus dados serão utilizados para fins de gestão contábil no escritório {identity.name}.
                    </p>
                  </div>
                </label>

                <div style={{ display: 'flex', gap: '15px' }}>
                  <button 
                    type="button"
                    onClick={() => setStep(1)}
                    style={{ flex: 1, background: 'rgba(255,255,255,0.05)', color: '#ffffff', padding: '18px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    VOLTAR
                  </button>
                  <button 
                    type="submit"
                    disabled={!formData.consent}
                    style={{ flex: 2, background: '#bd9617', color: '#0b1c2d', padding: '18px', borderRadius: '12px', fontWeight: '800', border: 'none', cursor: 'pointer', opacity: formData.consent ? 1 : 0.5 }}
                  >
                    FINALIZAR CADASTRO
                  </button>
                </div>
              </div>
            )}
          </form>

          <div style={{ marginTop: '40px', textAlign: 'center' }}>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>Já possui uma conta? <button onClick={onLogin} style={{ background: 'none', border: 'none', color: '#bd9617', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}>Entre agora</button></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
