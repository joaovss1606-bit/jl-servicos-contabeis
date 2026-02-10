import React, { useState } from 'react';
import { 
  User, ServiceRequest, ServiceStatus, ServiceType, Invoice, InvoiceData, CompanyIdentity, SubscriptionPlan, FaqItem, InternalAlert, CommunicationTemplate
} from '../types.ts';
import { SERVICE_LABELS, STATUS_COLORS, COMMUNICATION_TEMPLATES } from '../constants.ts';

interface AdminDashboardProps {
  admin: User;
  services: ServiceRequest[];
  setServices: React.Dispatch<React.SetStateAction<ServiceRequest[]>>;
  clients: User[];
  setClients: React.Dispatch<React.SetStateAction<User[]>>;
  invoices: Invoice[];
  setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>;
  clientInvoiceData: Record<string, InvoiceData>;
  identity: CompanyIdentity;
  onUpdateIdentity: (identity: CompanyIdentity) => void;
  plans: SubscriptionPlan[];
  onUpdatePlans: (plans: SubscriptionPlan[]) => void;
  faqs: FaqItem[];
  onUpdateFaqs: (faqs: FaqItem[]) => void;
  alerts: InternalAlert[];
  setAlerts: React.Dispatch<React.SetStateAction<InternalAlert[]>>;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  admin, services, setServices, clients, setClients, invoices, setInvoices, clientInvoiceData, identity, onUpdateIdentity, plans, onUpdatePlans, faqs, onUpdateFaqs, alerts, setAlerts
}) => {
  const [activeView, setActiveView] = useState<'OVERVIEW' | 'SERVICES' | 'CLIENTS' | 'PLANS' | 'FAQ' | 'CONFIG'>('OVERVIEW');

  const stats = {
    revenue: invoices.reduce((a, b) => a + b.value, 0),
    pending: services.filter(s => s.status !== ServiceStatus.CONCLUIDO).length,
    clients: clients.length,
    alerts: alerts.filter(a => !a.resolved).length
  };

  const handleTogglePlan = (clientId: string) => {
    setClients(prev => prev.map(c => c.id === clientId ? { ...c, isPlanActive: !c.isPlanActive } : c));
  };

  const handleCopyMessage = (template: CommunicationTemplate, service: ServiceRequest) => {
    let msg = template.content
      .replace('[NOME]', service.clientName)
      .replace('[SERVICO]', SERVICE_LABELS[service.type])
      .replace('[STATUS]', service.status)
      .replace('[PENDENCIA]', 'documentos pendentes')
      .replace('[PRAZO]', service.deadline || '48 horas');
    
    navigator.clipboard.writeText(msg);
    alert("Mensagem copiada! Envie manualmente pelo seu e-mail.");
  };

  const exportClients = () => {
    const csv = "Nome,Email,Plano,Status\n" + clients.map(c => `${c.name},${c.email},${c.activePlanId},${c.isPlanActive}`).join("\n");
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'clientes.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="admin-dashboard" style={{ display: 'flex', height: '100vh', background: '#0b1c2d', color: '#ffffff', overflow: 'hidden' }}>
      {/* Sidebar */}
      <aside style={{ width: '260px', background: '#0e2a47', borderRight: '1px solid rgba(189, 150, 23, 0.2)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '30px 20px' }}>
          <p style={{ fontSize: '0.65rem', fontWeight: 'bold', color: '#bd9617', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '30px' }}>Administração</p>
          <nav style={{ display: 'grid', gap: '10px' }}>
            {[
              { id: 'OVERVIEW', icon: 'fa-chart-pie', label: 'Dashboard' },
              { id: 'SERVICES', icon: 'fa-folder-open', label: 'Serviços' },
              { id: 'CLIENTS', icon: 'fa-user-friends', label: 'Clientes' },
              { id: 'PLANS', icon: 'fa-tags', label: 'Planos' },
              { id: 'FAQ', icon: 'fa-question-circle', label: 'FAQ Central' },
              { id: 'CONFIG', icon: 'fa-cog', label: 'Configurações' },
            ].map(item => (
              <button 
                key={item.id} onClick={() => setActiveView(item.id as any)}
                style={{ 
                  width: '100%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '15px', 
                  padding: '12px 20px', 
                  borderRadius: '10px', 
                  fontSize: '0.9rem', 
                  fontWeight: 'bold', 
                  border: 'none', 
                  cursor: 'pointer', 
                  transition: 'all 0.3s',
                  background: activeView === item.id ? '#bd9617' : 'transparent',
                  color: activeView === item.id ? '#0b1c2d' : 'rgba(255,255,255,0.6)'
                }}
              >
                <i className={`fas ${item.icon}`} style={{ width: '20px' }}></i> {item.label}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flexGrow: 1, overflowY: 'auto', padding: '40px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {activeView === 'OVERVIEW' && (
            <div style={{ display: 'grid', gap: '40px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', color: '#bd9617', margin: 0 }}>Visão Geral</h2>
                <button onClick={exportClients} style={{ background: 'none', border: '1px solid rgba(189, 150, 23, 0.3)', color: '#bd9617', padding: '10px 20px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer' }}>
                  <i className="fas fa-download" style={{ marginRight: '10px' }}></i> EXPORTAR BASE
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                {[
                  { label: 'Alertas Ativos', val: stats.alerts, icon: 'fa-bell', color: '#ff4d4d' },
                  { label: 'Serviços Ativos', val: stats.pending, icon: 'fa-clock', color: '#bd9617' },
                  { label: 'Clientes Totais', val: stats.clients, icon: 'fa-users', color: '#ffffff' },
                  { label: 'Receita Total', val: `R$ ${stats.revenue.toFixed(2)}`, icon: 'fa-wallet', color: '#25D366' },
                ].map((s, i) => (
                  <div key={i} style={{ background: '#0e2a47', padding: '30px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <i className={`fas ${s.icon}`} style={{ color: s.color, fontSize: '1.2rem', marginBottom: '20px' }}></i>
                    <div>
                      <p style={{ fontSize: '0.65rem', fontWeight: 'bold', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 5px' }}>{s.label}</p>
                      <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#ffffff', margin: 0 }}>{s.val}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ background: '#0e2a47', padding: '40px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#bd9617', marginBottom: '30px' }}>Lembretes de Ações (Manuais)</h3>
                <div style={{ display: 'grid', gap: '15px' }}>
                  {services.filter(s => s.status !== ServiceStatus.CONCLUIDO).map(svc => (
                    <div key={svc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                         <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(189, 150, 23, 0.1)', color: '#bd9617', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                           <i className="fas fa-exclamation-triangle"></i>
                         </div>
                         <div>
                            <p style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#ffffff', margin: '0 0 3px' }}>{svc.clientName} - {SERVICE_LABELS[svc.type]}</p>
                            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', margin: 0 }}>Status: {svc.status.replace('_', ' ')}</p>
                         </div>
                      </div>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        {COMMUNICATION_TEMPLATES.map(t => (
                          <button 
                            key={t.id}
                            onClick={() => handleCopyMessage(t, svc)}
                            style={{ background: 'none', border: '1px solid rgba(189, 150, 23, 0.3)', color: '#bd9617', padding: '8px 15px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: 'bold', cursor: 'pointer' }}
                          >
                            <i className="fas fa-copy" style={{ marginRight: '5px' }}></i> {t.id === 'temp-doc' ? 'PEDIR DOCS' : 'AVISO FIM'}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                  {services.length === 0 && <p style={{ color: 'rgba(255,255,255,0.4)', fontStyle: 'italic', fontSize: '0.9rem' }}>Nenhuma pendência ativa.</p>}
                </div>
              </div>
            </div>
          )}

          {activeView === 'CLIENTS' && (
            <div style={{ display: 'grid', gap: '30px' }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', color: '#bd9617', margin: 0 }}>Base de Clientes & Planos</h2>
              <div style={{ background: '#0e2a47', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead style={{ background: 'rgba(0,0,0,0.2)' }}>
                    <tr>
                      <th style={{ padding: '20px', fontSize: '0.75rem', fontWeight: 'bold', color: '#bd9617', textTransform: 'uppercase' }}>Cliente</th>
                      <th style={{ padding: '20px', fontSize: '0.75rem', fontWeight: 'bold', color: '#bd9617', textTransform: 'uppercase' }}>E-mail</th>
                      <th style={{ padding: '20px', fontSize: '0.75rem', fontWeight: 'bold', color: '#bd9617', textTransform: 'uppercase' }}>Acesso ao Portal</th>
                      <th style={{ padding: '20px', fontSize: '0.75rem', fontWeight: 'bold', color: '#bd9617', textTransform: 'uppercase' }}>Ação</th>
                    </tr>
                  </thead>
                  <tbody style={{ color: 'rgba(255,255,255,0.8)' }}>
                    {clients.map(client => (
                      <tr key={client.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '20px', fontWeight: 'bold' }}>{client.name}</td>
                        <td style={{ padding: '20px', fontSize: '0.9rem' }}>{client.email}</td>
                        <td style={{ padding: '20px' }}>
                          <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 'bold', background: client.isPlanActive ? 'rgba(37, 211, 102, 0.1)' : 'rgba(255, 77, 77, 0.1)', color: client.isPlanActive ? '#25D366' : '#ff4d4d' }}>
                            {client.isPlanActive ? 'PLANO ATIVO' : 'BLOQUEADO'}
                          </span>
                        </td>
                        <td style={{ padding: '20px' }}>
                          <button 
                            onClick={() => handleTogglePlan(client.id)}
                            style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: '#ffffff', padding: '8px 15px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}
                          >
                            {client.isPlanActive ? 'Bloquear' : 'Ativar Manual'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
