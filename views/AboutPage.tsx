import React from 'react';
import { CompanyIdentity } from '../types.ts';

interface AboutPageProps {
  identity: CompanyIdentity;
  onBack: () => void;
}

const AboutPage: React.FC<AboutPageProps> = ({ identity, onBack }) => {
  return (
    <div className="about-page-container" style={{ background: '#0b1c2d', color: '#ffffff', minHeight: '100vh' }}>
      <main className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', display: 'grid', gridTemplateColumns: '1fr 350px', gap: '60px' }}>
        
        <section className="sobre-conteudo">
          <nav className="breadcrumb" style={{ padding: '20px 0', fontSize: '0.9rem', color: '#bd9617' }}>
            <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#bd9617', cursor: 'pointer', fontWeight: 'bold', padding: 0 }}>Início</button>
            <span style={{ margin: '0 8px' }}>›</span>
            <strong style={{ color: '#ffffff' }}>Sobre Nós</strong>
          </nav>

          <h1 style={{ fontFamily: "'Playfair Display', serif", color: '#bd9617', fontSize: '2.5rem', marginBottom: '30px', textTransform: 'uppercase' }}>
            Conheça a J L Serviços Contábeis
          </h1>

          <div className="bloco-texto" style={{ marginBottom: '35px' }}>
            <h2 style={{ fontSize: '1.2rem', color: '#bd9617', marginBottom: '15px' }}>🔹 SOBRE A J L SERVIÇOS CONTÁBEIS</h2>
            <p style={{ lineHeight: '1.7', color: '#e0e0e0', marginBottom: '10px' }}>A J L Serviços Contábeis é um escritório contábil voltado para quem busca clareza, responsabilidade e praticidade no cumprimento de suas obrigações fiscais e contábeis.</p>
            <p style={{ lineHeight: '1.7', color: '#e0e0e0', marginBottom: '10px' }}>Nosso objetivo é simplificar a contabilidade, oferecendo serviços acessíveis, organizados e com acompanhamento direto, especialmente para MEI, Pessoa Física e pequenos empreendedores.</p>
          </div>

          <div className="bloco-texto" style={{ marginBottom: '35px' }}>
            <h2 style={{ fontSize: '1.2rem', color: '#bd9617', marginBottom: '15px' }}>🔹 PARA QUEM TRABALHAMOS</h2>
            <p style={{ lineHeight: '1.7', color: '#e0e0e0', marginBottom: '10px' }}>Atendemos clientes que precisam de orientação segura e objetiva, incluindo:</p>
            <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
              {['Microempreendedores Individuais (MEI)', 'Pessoas Físicas', 'Autônomos e profissionais liberais', 'Pequenos negócios', 'Pessoas que precisam regularizar pendências fiscais', 'Contribuintes que precisam de declarações e certidões'].map((item, idx) => (
                <li key={idx} style={{ marginBottom: '10px', paddingLeft: '25px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0, color: '#bd9617' }}>✔</span> {item}
                </li>
              ))}
            </ul>
            <p style={{ marginTop: '15px' }}><strong style={{ color: '#bd9617' }}>Nosso foco é atender quem busca solução, não complicação.</strong></p>
          </div>

          <div className="bloco-texto" style={{ marginBottom: '35px' }}>
            <h2 style={{ fontSize: '1.2rem', color: '#bd9617', marginBottom: '15px' }}>🔹 NOSSO JEITO DE TRABALHAR</h2>
            <p style={{ lineHeight: '1.7', color: '#e0e0e0', marginBottom: '10px' }}>Trabalhamos com um modelo simples e transparente, sem burocracia desnecessária.</p>
            <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
              {['Atendimento direto com o profissional responsável', 'Comunicação clara e objetiva', 'Explicação de cada etapa do serviço', 'Organização e acompanhamento do processo', 'Respeito a prazos e normas legais'].map((item, idx) => (
                <li key={idx} style={{ marginBottom: '10px', paddingLeft: '25px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0, color: '#bd9617' }}>✔</span> {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bloco-texto">
            <h2 style={{ fontSize: '1.2rem', color: '#bd9617', marginBottom: '15px' }}>🔹 SOBRE MIM</h2>
            <p style={{ lineHeight: '1.7', color: '#e0e0e0' }}>Sou profissional da área contábil com atuação focada em MEI, Pessoa Física e pequenos negócios, auxiliando na abertura, regularização, organização e cumprimento das obrigações fiscais.</p>
          </div>
        </section>

        <aside className="sobre-perfil">
          <div className="card-autoridade" style={{ background: '#0e2a47', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(189, 150, 23, 0.3)', position: 'sticky', top: '40px' }}>
            <div className="foto-placeholder">
              <img src="/minha-foto.jpeg" alt="JOÃO VITOR SANTOS SILVA" style={{ width: '100%', height: '320px', objectFit: 'cover' }} />
            </div>
            <div className="perfil-info" style={{ padding: '25px', textAlign: 'center' }}>
              <h3 style={{ margin: '0 0 5px', color: '#ffffff' }}>JOÃO VITOR SANTOS SILVA</h3>
              <p style={{ color: '#bd9617', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '15px' }}>Contador Responsável</p>
              
              <div className="registro-box" style={{ background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '15px', color: '#e0e0e0' }}>
                <strong>Registro Profissional</strong><br />
                CRC DF-031580/O
              </div>

              <p style={{ fontSize: '0.9rem', color: '#e0e0e0', marginBottom: '20px' }}>Especialista em transformar a contabilidade em uma aliada do seu dia a dia.</p>

              <a href="https://wa.me/5561920041427" target="_blank" rel="noreferrer" style={{ display: 'block', background: '#25D366', color: '#000', textDecoration: 'none', padding: '12px', borderRadius: '30px', fontWeight: 'bold', marginBottom: '15px' }}>
                Falar no WhatsApp
              </a>
              
              <a href="https://www3.cfc.org.br/SPW/ConsultaNacionalCFC/cfc" target="_blank" rel="noreferrer" style={{ display: 'block', fontSize: '0.75rem', color: '#bd9617', textDecoration: 'none' }}>Consultar Registro no CRC</a>
            </div>
          </div>
        </aside>

      </main>
      
      <style>{`
        @media (max-width: 900px) {
          .about-page-container main { grid-template-columns: 1fr !important; }
          .sobre-perfil { order: -1; }
          .card-autoridade { position: relative !important; top: 0 !important; }
        }
      `}</style>
    </div>
  );
};

export default AboutPage;
