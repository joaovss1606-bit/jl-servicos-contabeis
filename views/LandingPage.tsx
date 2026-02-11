import React from 'react';
import { CompanyIdentity } from '../types.ts';

interface LandingPageProps {
  onStart: () => void;
  onLogin: () => void;
  identity: CompanyIdentity;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart, onLogin, identity }) => {
  const blogPosts = [
    {
      title: "Conta PF vs PJ: Entenda",
      desc: "Descubra por que separar as suas contas pessoais das da empresa é vital para o seu sucesso.",
      img: "https://via.placeholder.com/800x400/0a192f/bd9617?text=PF+vs+PJ",
      link: "blog/contabilidade/separar-conta-pf-pj/"
    },
    {
      title: "Mudanças para 2026",
      desc: "Fique por dentro das novas regras tributárias e limites de faturamento para este ano.",
      img: "https://via.placeholder.com/800x400/0a192f/bd9617?text=Legislação+2026",
      link: "blog/legislacao/mudancas-contabeis-2026/"
    },
    {
      title: "Contratar no MEI: Regras",
      desc: "Saiba quanto custa e como registrar seu primeiro funcionário de forma legal e segura.",
      img: "https://via.placeholder.com/800x400/0a192f/bd9617?text=Contratação+MEI",
      link: "blog/departamento-pessoal/contratar-funcionario-mei/"
    },
    {
      title: "Guia DAS-MEI: Evite Multas",
      desc: "Saiba como manter seu imposto mensal em dia e como regularizar atrasos.",
      img: "https://via.placeholder.com/800x400/0a192f/bd9617?text=Guia+DAS-MEI",
      link: "blog/fiscal/guia-das-mei/"
    },
    {
      title: "Documentos Mensais",
      desc: "Confira o checklist completo do que você precisa enviar para manter sua empresa regular.",
      img: "https://via.placeholder.com/800x400/0a192f/bd9617?text=Checklist+Mensal",
      link: "blog/contabil/documentos-mensais-contador/"
    }
  ];

  return (
    <div className="landing-page">
      {/* Identidade Visual Grande - Exclusiva da Home */}
      <section className="container">
        <div className="brand-identity-home">
          <img src="/logo.png" alt="JL Serviços" className="site-logo-home" />
          <div className="brand-text-home">
            <h1 className="site-title-home">J L SERVIÇOS CONTÁBEIS</h1>
            <p className="site-subtitle-home">Atendimento Online para todo o Brasil</p>
          </div>
        </div>
      </section>

      {/* Conteúdo Especializado */}
      <section className="container" style={{ padding: '60px 0' }}>
        <h2 className="section-title">CONTEÚDO ESPECIALIZADO</h2>
        <p className="section-subtitle">Informações essenciais para sua segurança contábil e fiscal</p>
        <div style={{ width: '80px', height: '3px', background: '#bd9617', margin: '-30px auto 50px' }}></div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          {blogPosts.map((post, idx) => (
            <article key={idx} className="service-card" style={{ padding: 0, overflow: 'hidden' }}>
              <img src={post.img} alt={post.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              <div style={{ padding: '25px' }}>
                <h3 style={{ color: '#bd9617', fontSize: '1.4rem', marginBottom: '10px', fontFamily: "'Playfair Display', serif" }}>{post.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', lineHeight: '1.6' }}>{post.desc}</p>
                <a href={post.link} style={{ color: '#bd9617', fontWeight: 'bold', textDecoration: 'none', display: 'inline-block', marginTop: '15px', fontSize: '0.9rem' }}>
                  Ler Artigo Completo →
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
