import React from 'react';
import { CompanyIdentity, SubscriptionPlan } from '../types.ts';

interface PricingPageProps {
  identity: CompanyIdentity;
  plans: SubscriptionPlan[];
  onContract: (planId: string) => void;
  isAuthenticated: boolean;
  onGoToRegister: () => void;
}

const PricingPage: React.FC<PricingPageProps> = ({ identity, plans, onContract, isAuthenticated, onGoToRegister }) => {
  const activePlans = plans.filter(p => p.isActive);

  const handleAction = (plan: SubscriptionPlan) => {
    if (!isAuthenticated) {
      onGoToRegister();
      return;
    }

    if (plan.checkoutUrl) {
      window.open(plan.checkoutUrl, '_blank');
      onContract(plan.id);
    } else {
      onContract(plan.id);
    }
  };

  return (
    <div className="pricing-page-container" style={{ background: '#0b1c2d', color: '#ffffff', minHeight: '100vh', padding: '80px 20px' }}>
      <div className="container" style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div className="text-center mb-16">
          <h2 style={{ color: '#bd9617', fontSize: '0.9rem', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '15px' }}>
            Nossos Planos de Acompanhamento
          </h2>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '3rem', color: '#bd9617', marginBottom: '20px' }}>
            Escolha o plano ideal para você
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
            O acesso ao portal do cliente {identity.name} requer a contratação de um plano de acompanhamento contábil. Selecione uma opção para continuar.
          </p>
        </div>

        <div className="plans-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', justifyContent: 'center' }}>
          {activePlans.length === 0 ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', background: '#0e2a47', borderRadius: '20px', border: '1px dashed rgba(189, 150, 23, 0.3)' }}>
              <i className="fas fa-exclamation-circle" style={{ fontSize: '3rem', color: '#bd9617', marginBottom: '20px' }}></i>
              <h3 style={{ color: '#bd9617', fontSize: '1.5rem', marginBottom: '15px' }}>Nenhum plano disponível no momento</h3>
              <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '30px' }}>Entre em contato diretamente com nossa equipe para obter acesso.</p>
              <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <a href={`mailto:${identity.email}`} style={{ background: '#bd9617', color: '#0b1c2d', padding: '12px 25px', borderRadius: '10px', fontWeight: 'bold', textDecoration: 'none' }}>
                  <i className="fas fa-envelope"></i> {identity.email}
                </a>
                <a href={`https://wa.me/${identity.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" style={{ background: '#25D366', color: '#000', padding: '12px 25px', borderRadius: '10px', fontWeight: 'bold', textDecoration: 'none' }}>
                  <i className="fab fa-whatsapp"></i> WhatsApp
                </a>
              </div>
            </div>
          ) : (
            activePlans.map(plan => (
              <div 
                key={plan.id}
                className="plan-card"
                style={{ 
                  background: '#0e2a47', 
                  padding: '40px', 
                  borderRadius: '20px', 
                  border: plan.recommended ? '2px solid #bd9617' : '1px solid rgba(189, 150, 23, 0.2)',
                  position: 'relative',
                  transition: 'transform 0.3s ease',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {plan.recommended && (
                  <div style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', background: '#bd9617', color: '#0b1c2d', padding: '5px 20px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                    Recomendado
                  </div>
                )}
                
                <div style={{ marginBottom: '30px' }}>
                  <h3 style={{ color: '#bd9617', fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '10px' }}>{plan.name}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', lineHeight: '1.5' }}>{plan.description}</p>
                </div>

                <div style={{ marginBottom: '30px', display: 'flex', alignItems: 'baseline', gap: '5px' }}>
                  <span style={{ color: '#bd9617', fontWeight: 'bold' }}>R$</span>
                  <span style={{ fontSize: '3.5rem', fontWeight: '800', color: '#ffffff' }}>{plan.price.toFixed(2).split('.')[0]}</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ffffff' }}>,{plan.price.toFixed(2).split('.')[1]}</span>
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', marginLeft: '10px' }}>/ {plan.interval}</span>
                </div>

                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 40px 0', flexGrow: 1 }}>
                  {plan.features.map((feature, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '15px', fontSize: '0.95rem', color: 'rgba(255,255,255,0.8)' }}>
                      <i className="fas fa-check-circle" style={{ color: '#bd9617', marginTop: '4px' }}></i>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={() => handleAction(plan)}
                  style={{ 
                    width: '100%', 
                    padding: '18px', 
                    borderRadius: '12px', 
                    fontWeight: '800', 
                    fontSize: '1rem', 
                    border: 'none', 
                    cursor: 'pointer', 
                    transition: 'all 0.3s',
                    background: plan.recommended ? '#bd9617' : 'rgba(189, 150, 23, 0.1)',
                    color: plan.recommended ? '#0b1c2d' : '#bd9617',
                    border: plan.recommended ? 'none' : '1px solid #bd9617',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}
                >
                  {isAuthenticated ? (
                    <>
                      {plan.checkoutUrl ? 'Contratar via Pagamento Seguro' : 'Assinar Plano'}
                      {plan.checkoutUrl && <i className="fas fa-external-link-alt" style={{ marginLeft: '10px', fontSize: '0.8rem' }}></i>}
                    </>
                  ) : (
                    'Criar Conta para Iniciar'
                  )}
                </button>
              </div>
            ))
          )}
        </div>

        <div style={{ marginTop: '60px', textAlign: 'center' }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <i className="fas fa-shield-alt" style={{ color: '#bd9617' }}></i>
            Seus dados fiscais estão protegidos seguindo a LGPD.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
