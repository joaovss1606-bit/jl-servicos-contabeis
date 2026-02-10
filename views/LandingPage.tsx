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
    <div className="home-page-container" style={{ display: 'block', visibility: 'visible', opacity: 1 }}>
      <div className="brand-identity-home" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '30px', margin: '60px 0', textAlign: 'left' }}>
        <img src="/logo.png" alt="JL Serviços" style={{ width: '150px', height: '150px', borderRadius: '50%', border: '4px solid #bd9617', display: 'block' }} />
        <div className="brand-text">
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '3.8rem', fontWeight: 900, lineHeight: 1.1, color: '#bd9617', margin: 0, textTransform: 'uppercase' }}>J L Serviços Contábeis</h1>
          <p style={{ fontSize: '1.2rem', marginTop: '5px', color: '#ffffff', display: 'block' }}>Atendimento Online para todo o Brasil</p>
        </div>
      </div>

      <div className="container" style={{ textAlign: 'center', margin: '60px auto 40px' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.8rem', marginBottom: '10px', color: '#bd9617', textTransform: 'uppercase' }}>
          Conteúdo Especializado
        </h2>
        <p style={{ color: '#ffffff', opacity: 0.8, fontSize: '1.1rem', fontFamily: "'Montserrat', sans-serif" }}>
          Informações essenciais para sua segurança contábil e fiscal
        </p>
        <div style={{ width: '80px', height: '3px', background: '#bd9617', margin: '25px auto' }}></div>
      </div>

      <section className="container blog-home" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginTop: '40px' }}>
        {blogPosts.map((post, idx) => (
          <article key={idx} className="blog-highlight" style={{ background: '#0e2a47', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(189, 150, 23, 0.1)' }}>
            <img src={post.img} alt={post.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
            <div className="blog-content" style={{ padding: '20px' }}>
              <h2 style={{ color: '#bd9617', fontSize: '1.5rem', marginBottom: '10px' }}>{post.title}</h2>
              <p style={{ color: '#ffffff', fontSize: '0.95rem' }}>{post.desc}</p>
              <a href={post.link} style={{ color: '#bd9617', fontWeight: 'bold', textDecoration: 'none', display: 'inline-block', marginTop: '15px' }}>
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
