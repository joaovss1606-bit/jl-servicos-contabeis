import React, { useState } from 'react';
import { User, ServiceRequest, ServiceStatus, ServiceType, Invoice, InvoiceData, CompanyIdentity, SubscriptionPlan, Document, CommunicationLog } from '../types.ts';
import { SERVICE_LABELS, STATUS_COLORS, LGPD_TEXT } from '../constants.ts';

interface ClientDashboardProps {
  user: User;
  services: ServiceRequest[];
  setServices: React.Dispatch<React.SetStateAction<ServiceRequest[]>>;
  invoices: Invoice[];
  invoiceData: InvoiceData | undefined;
  setInvoiceData: (data: InvoiceData) => void;
  identity: CompanyIdentity;
  activePlan: SubscriptionPlan | undefined;
}

const ClientDashboard: React.FC<ClientDashboardProps> = ({ 
  user, services, setServices, invoices, invoiceData, setInvoiceData, identity, activePlan
}) => {
  const [activeTab, setActiveTab] = useState<'SERVICES' | 'DOCS' | 'HISTORY' | 'FISCAL'>('SERVICES');
  const [requestModal, setRequestModal] = useState<{show: boolean, step: 1 | 2}>({show: false, step: 1});
  const [newRequest, setNewRequest] = useState({ type: 'MEI' as ServiceType, description: '' });

  const handleRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (requestModal.step === 1) {
      setRequestModal({show: true, step: 2});
      return;
    }
    const req: ServiceRequest = {
      id: 'svc-' + Math.random().toString(36).substr(2, 9),
      clientId: user.id, clientName: user.name, type: newRequest.type, description: newRequest.description,
      status: ServiceStatus.PENDENTE, value: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      documents: [], history: [{id: '1', date: new Date().toISOString(), message: 'Solicitação recebida pelo sistema.', sender: 'SISTEMA'}],
      termsAccepted: true
    };
    setServices(prev => [...prev, req]);
    setRequestModal({show: false, step: 1});
    setNewRequest({type: 'MEI', description: ''});
    alert("Solicitação enviada! Aguarde a análise do contador.");
  };

  return (
    <div className="dashboard-container" style={{ background: '#0b1c2d', color: '#ffffff', minHeight: '100vh', padding: '40px 20px' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header & Plan Info */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '30px', marginBottom: '60px' }}>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', color: '#bd9617', margin: '0 0 10px' }}>Portal de Atendimento</h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem' }}>Bem-vindo(a), <span style={{ color: '#bd9617', fontWeight: 'bold' }}>{user.name}</span>.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
             <div style={{ background: '#0e2a47', border: '1px solid rgba(189, 150, 23, 0.3)', padding: '15px 25px', borderRadius: '15px', textAlign: 'center' }}>
               <p style={{ fontSize: '0.65rem', fontWeight: 'bold', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 5px' }}>Seu Plano</p>
               <p style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#bd9617', margin: 0 }}>{activePlan?.name || 'Aguardando Ativação'}</p>
             </div>
             <button 
               onClick={() => setRequestModal({show: true, step: 1})}
               style={{ background: '#bd9617', color: '#0b1c2d', padding: '15px 30px', borderRadius: '12px', fontWeight: '800', border: 'none', cursor: 'pointer', transition: 'all 0.3s', boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}
             >
               NOVO SERVIÇO
             </button>
          </div>
        </div>

        {/* Internal Alerts */}
        {services.some(s => s.status === ServiceStatus.AGUARDANDO_DOCUMENTO) && (
          <div style={{ marginBottom: '40px', background: 'rgba(255, 165, 0, 0.1)', border: '1px solid rgba(255, 165, 0, 0.3)', padding: '25px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
             <div style={{ width: '50px', height: '50px', background: 'rgba(255, 165, 0, 0.2)', color: '#ffa500', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
               <i className="fas fa-exclamation-triangle"></i>
             </div>
             <div>
               <h4 style={{ color: '#ffa500', margin: '0 0 5px', fontWeight: 'bold' }}>Ação Necessária!</h4>
               <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', margin: 0 }}>Temos um ou mais serviços aguardando o envio de documentos para prosseguir.</p>
             </div>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '40px', overflowX: 'auto', gap: '10px' }}>
          {[
            { id: 'SERVICES', label: 'Meus Processos' },
            { id: 'DOCS', label: 'Documentos' },
            { id: 'HISTORY', label: 'Comunicações' },
            { id: 'FISCAL', label: 'Dados Fiscais' },
          ].map(tab => (
            <button 
              key={tab.id} onClick={() => setActiveTab(tab.id as any)}
              style={{ 
                padding: '15px 25px', 
                background: 'none', 
                border: 'none', 
                borderBottom: activeTab === tab.id ? '3px solid #bd9617' : '3px solid transparent',
                color: activeTab === tab.id ? '#bd9617' : 'rgba(255,255,255,0.4)',
                fontWeight: 'bold',
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.3s',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'SERVICES' && (
            <div style={{ display: 'grid', gap: '20px' }}>
              {services.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px', background: '#0e2a47', borderRadius: '20px', border: '1px dashed rgba(189, 150, 23, 0.2)', color: 'rgba(255,255,255,0.4)' }}>
                  <i className="fas fa-folder-open" style={{ fontSize: '3rem', marginBottom: '20px', opacity: 0.3 }}></i>
                  <p>Nenhuma solicitação em andamento.</p>
                </div>
              ) : (
                services.map(svc => (
                  <div key={svc.id} style={{ background: '#0e2a47', padding: '30px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
                     <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '15px', background: 'rgba(189, 150, 23, 0.1)', color: '#bd9617', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                          <i className="fas fa-file-signature"></i>
                        </div>
                        <div>
                          <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#ffffff', margin: '0 0 5px' }}>{SERVICE_LABELS[svc.type]}</h3>
                          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', margin: '0 0 10px' }}>{svc.description}</p>
                          <span style={{ fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase', padding: '4px 12px', borderRadius: '20px', background: 'rgba(189, 150, 23, 0.2)', color: '#bd9617' }}>
                            {svc.status.replace('_', ' ')}
                          </span>
                        </div>
                     </div>
                     <button style={{ background: 'none', border: '1px solid rgba(189, 150, 23, 0.3)', color: '#bd9617', padding: '10px 20px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer' }}>
                       DETALHES <i className="fas fa-chevron-right" style={{ marginLeft: '8px' }}></i>
                     </button>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'HISTORY' && (
            <div style={{ maxWidth: '800px', margin: '0 auto', display: 'grid', gap: '30px' }}>
              {services.map(svc => (
                <div key={svc.id}>
                  <h3 style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#bd9617', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '15px', paddingLeft: '10px' }}>{SERVICE_LABELS[svc.type]}</h3>
                  <div style={{ background: '#0e2a47', padding: '30px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', display: 'grid', gap: '25px' }}>
                    {svc.history.map(log => (
                      <div key={log.id} style={{ display: 'flex', gap: '15px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: log.sender === 'ADMIN' ? '#bd9617' : 'rgba(255,255,255,0.1)', color: log.sender === 'ADMIN' ? '#0b1c2d' : '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <i className={log.sender === 'ADMIN' ? 'fas fa-user-tie' : 'fas fa-robot'}></i>
                        </div>
                        <div>
                          <p style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'rgba(255,255,255,0.4)', margin: '0 0 5px' }}>{new Date(log.date).toLocaleString()}</p>
                          <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.8)', lineHeight: '1.5', margin: 0 }}>{log.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {services.length === 0 && <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>Sem comunicações registradas.</p>}
            </div>
          )}

          {activeTab === 'FISCAL' && (
            <div style={{ maxWidth: '600px', margin: '0 auto', background: '#0e2a47', padding: '50px', borderRadius: '20px', border: '1px solid rgba(189, 150, 23, 0.3)', textAlign: 'center' }}>
              <i className="fas fa-id-card" style={{ fontSize: '3rem', color: '#bd9617', marginBottom: '25px' }}></i>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ffffff', marginBottom: '15px' }}>Seus Dados Fiscais</h2>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', lineHeight: '1.6', marginBottom: '35px' }}>Estes dados são usados exclusivamente para faturamento dos serviços do escritório contábil.</p>
              <button 
                style={{ width: '100%', background: '#bd9617', color: '#0b1c2d', padding: '18px', borderRadius: '12px', fontWeight: '800', border: 'none', cursor: 'pointer' }}
                onClick={() => {}}
              >
                {invoiceData ? 'ATUALIZAR DADOS FISCAIS' : 'PREENCHER DADOS PARA NF'}
              </button>
            </div>
          )}
        </div>

        {/* Modal Novo Serviço */}
        {requestModal.show && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div style={{ background: '#0e2a47', borderRadius: '25px', width: '100%', maxWidth: '600px', padding: '40px', border: '1px solid rgba(189, 150, 23, 0.3)', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}>
              {requestModal.step === 1 ? (
                <form onSubmit={handleRequest} style={{ display: 'grid', gap: '25px' }}>
                  <h3 style={{ fontSize: '1.8rem', color: '#bd9617', margin: 0 }}>Novo Serviço</h3>
                  <p style={{ color: 'rgba(255,255,255,0.6)', margin: 0 }}>Selecione o tipo de atendimento contábil desejado.</p>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#bd9617', textTransform: 'uppercase', marginBottom: '10px' }}>Tipo de Atendimento</label>
                    <select 
                      value={newRequest.type} onChange={e => setNewRequest({...newRequest, type: e.target.value as ServiceType})}
                      style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(189, 150, 23, 0.2)', borderRadius: '10px', padding: '15px', color: '#ffffff', outline: 'none' }}
                    >
                      {Object.entries(SERVICE_LABELS).map(([k,v]) => <option key={k} value={k} style={{ background: '#0e2a47' }}>{v}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#bd9617', textTransform: 'uppercase', marginBottom: '10px' }}>Explicação / Detalhes</label>
                    <textarea 
                      required value={newRequest.description} onChange={e => setNewRequest({...newRequest, description: e.target.value})}
                      placeholder="Descreva brevemente sua necessidade..."
                      style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(189, 150, 23, 0.2)', borderRadius: '10px', padding: '15px', color: '#ffffff', outline: 'none', minHeight: '120px', resize: 'none' }}
                    ></textarea>
                  </div>
                  <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                    <button type="button" onClick={() => setRequestModal({show: false, step: 1})} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', color: '#ffffff', padding: '15px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>CANCELAR</button>
                    <button type="submit" style={{ flex: 1, background: '#bd9617', color: '#0b1c2d', padding: '15px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>PRÓXIMO PASSO</button>
                  </div>
                </form>
              ) : (
                <div style={{ display: 'grid', gap: '30px' }}>
                  <h3 style={{ fontSize: '1.8rem', color: '#bd9617', margin: 0 }}>Aceite de Responsabilidade</h3>
                  <div style={{ background: 'rgba(0,0,0,0.2)', padding: '25px', borderRadius: '15px', fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', maxHeight: '250px', overflowY: 'auto', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                    {LGPD_TEXT}
                    
                    {"\n\n"}Declaro que:
                    {"\n"}- As informações fornecidas são verdadeiras.
                    {"\n"}- Tenho ciência dos prazos e obrigações do serviço de {SERVICE_LABELS[newRequest.type]}.
                    {"\n"}- Autorizo o processamento de dados para fins contábeis.
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                     <button 
                       onClick={handleRequest}
                       style={{ width: '100%', background: '#bd9617', color: '#0b1c2d', padding: '20px', borderRadius: '12px', fontWeight: '800', fontSize: '1.1rem', border: 'none', cursor: 'pointer' }}
                     >
                       ACEITAR E SOLICITAR SERVIÇO
                     </button>
                     <button onClick={() => setRequestModal({show: true, step: 1})} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer' }}>VOLTAR E AJUSTAR DADOS</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;
