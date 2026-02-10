import React, { useState, useEffect } from 'react';
import { 
  User, 
  UserRole, 
  ServiceRequest, 
  AuthState, 
  InvoiceData,
  Invoice,
  CompanyIdentity,
  SubscriptionPlan,
  FaqItem,
  InternalAlert
} from './types.ts';
import { 
  DEFAULT_COMPANY_IDENTITY, 
  INITIAL_PLANS, 
  INITIAL_FAQ 
} from './constants.ts';
import Navbar from './components/Navbar.tsx';
import LandingPage from './views/LandingPage.tsx';
import Login from './views/Login.tsx';
import ClientDashboard from './views/ClientDashboard.tsx';
import AdminDashboard from './views/AdminDashboard.tsx';
import Register from './views/Register.tsx';
import PricingPage from './views/PricingPage.tsx';
import FaqPage from './views/FaqPage.tsx';
import PasswordReset from './views/PasswordReset.tsx';

const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthState>({ user: null, isAuthenticated: false });
  const [view, setView] = useState<'LANDING' | 'LOGIN' | 'REGISTER' | 'PRICING' | 'DASHBOARD' | 'FAQ' | 'RESET_PASSWORD'>('LANDING');
  const [companyIdentity, setCompanyIdentity] = useState<CompanyIdentity>(DEFAULT_COMPANY_IDENTITY);
  const [plans, setPlans] = useState<SubscriptionPlan[]>(INITIAL_PLANS);
  const [faqs, setFaqs] = useState<FaqItem[]>(INITIAL_FAQ);
  
  const [clients, setClients] = useState<User[]>([]);
  const [services, setServices] = useState<ServiceRequest[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [alerts, setAlerts] = useState<InternalAlert[]>([]);
  const [clientInvoiceData, setClientInvoiceData] = useState<Record<string, InvoiceData>>({});

  useEffect(() => {
    const savedAuth = localStorage.getItem('portal_auth');
    if (savedAuth) {
      try {
        const parsed = JSON.parse(savedAuth) as AuthState;
        if (parsed && parsed.user) {
          setAuth(parsed);
          if (parsed.user.role === UserRole.CLIENTE && !parsed.user.isPlanActive) {
            setView('PRICING');
          } else if (parsed.isAuthenticated) {
            setView('DASHBOARD');
          }
        }
      } catch (e) {
        console.error("Erro ao carregar sessão:", e);
        localStorage.removeItem('portal_auth');
      }
    }
  }, []);

  const handleLogin = (user: User) => {
    const newState = { user, isAuthenticated: true };
    setAuth(newState);
    localStorage.setItem('portal_auth', JSON.stringify(newState));
    
    if (user.role === UserRole.ADMIN) {
      setView('DASHBOARD');
    } else if (!user.isPlanActive) {
      setView('PRICING');
    } else {
      setView('DASHBOARD');
    }
  };

  const handleLogout = () => {
    setAuth({ user: null, isAuthenticated: false });
    localStorage.removeItem('portal_auth');
    setView('LANDING');
  };

  return (
    <div className={view === 'LANDING' ? 'home-page' : ''}>
      <Navbar 
        auth={auth} 
        onLogout={handleLogout} 
        onNavigate={(v: any) => setView(v)} 
        identity={companyIdentity} 
      />
      
      <main>
        {view === 'LANDING' && (
          <LandingPage 
            onStart={() => setView('PRICING')} 
            onLogin={() => setView('LOGIN')} 
            identity={companyIdentity} 
          />
        )}
        
        {view === 'LOGIN' && (
          <Login 
            onLogin={handleLogin} 
            onBack={() => setView('LANDING')} 
            onRegister={() => setView('REGISTER')} 
            onResetPassword={() => setView('RESET_PASSWORD')} 
            identity={companyIdentity} 
          />
        )}
        
        {view === 'REGISTER' && (
          <Register 
            onRegister={handleLogin} 
            onBack={() => setView('LANDING')} 
            onLogin={() => setView('LOGIN')} 
            identity={companyIdentity} 
          />
        )}
        
        {view === 'PRICING' && (
          <PricingPage 
            identity={companyIdentity} 
            plans={plans} 
            onContract={() => setView('DASHBOARD')} 
            isAuthenticated={auth.isAuthenticated} 
            onGoToRegister={() => setView('REGISTER')} 
          />
        )}
        
        {view === 'FAQ' && (
          <FaqPage 
            faqs={faqs} 
            identity={companyIdentity} 
            onBack={() => setView('LANDING')} 
          />
        )}
        
        {view === 'RESET_PASSWORD' && (
          <PasswordReset 
            identity={companyIdentity} 
            onBack={() => setView('LOGIN')} 
          />
        )}
        
        {view === 'DASHBOARD' && auth.isAuthenticated && auth.user && (
          auth.user.role === UserRole.ADMIN ? (
            <AdminDashboard 
              admin={auth.user} 
              services={services} 
              setServices={setServices}
              clients={clients} 
              setClients={setClients}
              invoices={invoices} 
              setInvoices={setInvoices}
              clientInvoiceData={clientInvoiceData} 
              identity={companyIdentity}
              onUpdateIdentity={setCompanyIdentity} 
              plans={plans} 
              onUpdatePlans={setPlans}
              faqs={faqs} 
              onUpdateFaqs={setFaqs} 
              alerts={alerts} 
              setAlerts={setAlerts}
            />
          ) : (
            <ClientDashboard 
              user={auth.user} 
              services={services.filter(s => s.clientId === auth.user?.id)}
              setServices={setServices} 
              invoices={invoices.filter(i => i.clientId === auth.user?.id)}
              invoiceData={clientInvoiceData[auth.user.id]} 
              setInvoiceData={(data) => setClientInvoiceData(prev => ({ ...prev, [auth.user!.id]: data }))}
              identity={companyIdentity} 
              activePlan={plans.find(p => p.id === auth.user?.activePlanId)}
            />
          )
        )}
      </main>

      <footer className="site-footer">
        <div className="footer-container container">
          <div className="footer-col">
            <h3>J L Serviços Contábeis</h3>
            <p>Soluções contábeis com transparência, segurança e foco em resultados para MEI, Pessoa Física e Empresas.</p>
          </div>

          <div className="footer-col">
            <h4>Links Rápidos</h4>
            <ul>
              <li><button onClick={() => setView('LANDING')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }}>Início</button></li>
              <li><a href="/servicos/index.html">Catálogo de Serviços</a></li>
              <li><a href="/sobre/index.html">Quem Somos</a></li>
              <li><a href="/lgpd/index.html">Política de Privacidade</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Contato</h4>
            <a href="https://wa.me/5561920041427" target="_blank" className="btn-whatsapp-footer">
              <i className="fab fa-whatsapp" style={{ marginRight: '10px' }}></i> WhatsApp
            </a>
            <div className="footer-email">
              <i className="far fa-envelope" style={{ marginRight: '8px' }}></i> jlservicoscontabeis0@gmail.com
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 J L Serviços Contábeis — Todos os direitos reservados</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
