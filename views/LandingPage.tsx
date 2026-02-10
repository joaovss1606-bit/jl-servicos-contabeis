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
    <div className="home-page-content">
      <div className="brand-identity" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '30px', margin: '40px 0' }}>
        <img src="/logo.png" alt="JL Serviços" className="site-logo-circle" style={{ width: '150px', height: '150px', borderRadius: '50%', border: '4px solid #bd9617' }} />
        <div className="brand-text" style={{ textAlign: 'left' }}>
          <h1 className="site-title-header" style={{ fontSize: '3.8rem', fontWeight: 900, lineHeight: 1.1, color: '#bd9617' }}>J L Serviços Contábeis</h1>
          <p className="site-subtitle-header" style={{ fontSize: '1.2rem', marginTop: '5px', color: '#ffffff' }}>Atendimento Online para todo o Brasil</p>
        </div>
      </div>

      <div style={{ textAlign: 'center', margin: '60px 0 40px' }}>
        <h2 className="site-title-header" style={{ fontSize: '2.8rem', marginBottom: '10px', color: '#bd9617' }}>
          Conteúdo Especializado
        </h2>
        <p style={{ color: '#ffffff', opacity: 0.8, fontSize: '1.1rem', fontFamily: "'Montserrat', sans-serif" }}>
          Informações essenciais para sua segurança contábil e fiscal
        </p>
        <div style={{ width: '80px', height: '3px', background: '#bd9617', margin: '25px auto' }}></div>
      </div>

      <section className="blog-home">
        {blogPosts.map((post, idx) => (
          <article key={idx} className="blog-highlight">
            <img src={post.img} alt={post.title} />
            <div className="blog-content">
              <h2>{post.title}</h2>
              <p>{post.desc}</p>
              <a href={post.link} style={{ color: '#bd9617', fontWeight: 'bold', textDecoration: 'none', display: 'inline-block', marginTop: '10px' }}>
                Ler Artigo Completo →
              </a>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
};

export default LandingPage;
