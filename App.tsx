import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
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
import AboutPage from './views/AboutPage.tsx';

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [auth, setAuth] = useState<AuthState>({ user: null, isAuthenticated: false });
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
        }
      } catch (e) {
        console.error("Erro ao carregar sessão:", e);
        localStorage.removeItem('portal_auth');
      }
    }
  }, []);

  useEffect(() => {
    if (location.pathname === '/') {
      document.body.classList.add('home-page');
    } else {
      document.body.classList.remove('home-page');
    }
  }, [location.pathname]);

  const handleLogin = (user: User) => {
    const newState = { user, isAuthenticated: true };
    setAuth(newState);
    localStorage.setItem('portal_auth', JSON.stringify(newState));
    
    if (user.role === UserRole.ADMIN) {
      navigate('/dashboard');
    } else if (!user.isPlanActive) {
      navigate('/pricing');
    } else {
      navigate('/dashboard');
    }
  };

  const handleLogout = () => {
    setAuth({ user: null, isAuthenticated: false });
    localStorage.removeItem('portal_auth');
    navigate('/');
  };

  return (
    <div className="app-container">
      <Navbar 
        auth={auth} 
        onLogout={handleLogout} 
        onNavigate={(path: string) => navigate(path)} 
        identity={companyIdentity} 
      />
      
      <main>
        <Routes>
          <Route path="/" element={
            <LandingPage 
              onStart={() => navigate('/pricing')} 
              onLogin={() => navigate('/login')} 
              identity={companyIdentity} 
            />
          } />
          
          <Route path="/login" element={
            <Login 
              onLogin={handleLogin} 
              onBack={() => navigate('/')} 
              onRegister={() => navigate('/register')} 
              onResetPassword={() => navigate('/reset-password')} 
              identity={companyIdentity} 
            />
          } />

          <Route path="/sobre" element={
            <AboutPage 
              identity={companyIdentity} 
              onBack={() => navigate('/')} 
            />
          } />
          
          <Route path="/register" element={
            <Register 
              onRegister={handleLogin} 
              onBack={() => navigate('/')} 
              onLogin={() => navigate('/login')} 
              identity={companyIdentity} 
            />
          } />
          
          <Route path="/pricing" element={
            <PricingPage 
              identity={companyIdentity} 
              plans={plans} 
              onContract={() => navigate('/dashboard')} 
              isAuthenticated={auth.isAuthenticated} 
              onGoToRegister={() => navigate('/register')} 
            />
          } />
          
          <Route path="/faq" element={
            <FaqPage 
              faqs={faqs} 
              identity={companyIdentity} 
              onBack={() => navigate('/')} 
            />
          } />
          
          <Route path="/reset-password" element={
            <PasswordReset 
              identity={companyIdentity} 
              onBack={() => navigate('/login')} 
            />
          } />
          
          <Route path="/dashboard" element={
            auth.isAuthenticated && auth.user ? (
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
            ) : (
              <Login 
                onLogin={handleLogin} 
                onBack={() => navigate('/')} 
                onRegister={() => navigate('/register')} 
                onResetPassword={() => navigate('/reset-password')} 
                identity={companyIdentity} 
              />
            )
          } />
        </Routes>
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
              <li><button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }}>Início</button></li>
              <li><a href="/servicos/">Catálogo de Serviços</a></li>
              <li><a href="/blog/">Blog</a></li>
              <li><button onClick={() => navigate('/sobre')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0 }}>Quem Somos</button></li>
              <li><a href="/lgpd/">Política de Privacidade</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Contato</h4>
            <a href="https://wa.me/5561920041427" target="_blank" rel="noreferrer" className="btn-whatsapp-footer">
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
