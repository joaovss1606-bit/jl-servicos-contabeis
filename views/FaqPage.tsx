import React, { useState } from 'react';
import { FaqItem, CompanyIdentity } from '../types.ts';

interface FaqPageProps {
  faqs: FaqItem[];
  identity: CompanyIdentity;
  onBack: () => void;
}

const FaqPage: React.FC<FaqPageProps> = ({ faqs, identity, onBack }) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(faqs.map(f => f.category)));
  const filteredFaqs = faqs.filter(f => 
    f.isActive && 
    (search === '' || f.question.toLowerCase().includes(search.toLowerCase()) || f.answer.toLowerCase().includes(search.toLowerCase())) &&
    (activeCategory === null || f.category === activeCategory)
  );

  return (
    <div className="faq-page-container" style={{ background: '#0b1c2d', color: '#ffffff', minHeight: '100vh', padding: '80px 20px' }}>
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#bd9617', cursor: 'pointer', marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold', fontSize: '0.9rem' }}>
          <i className="fas fa-chevron-left"></i> VOLTAR AO INÍCIO
        </button>

        <div className="text-center mb-16">
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '3rem', color: '#bd9617', marginBottom: '15px' }}>Como podemos ajudar?</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem' }}>Tire suas dúvidas sobre nossos processos, segurança e planos.</p>
        </div>

        <div style={{ position: 'relative', marginBottom: '50px' }}>
          <i className="fas fa-search" style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(189, 150, 23, 0.5)' }}></i>
          <input 
            type="text"
            placeholder="Busque por uma dúvida..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '100%', background: '#0e2a47', border: '1px solid rgba(189, 150, 23, 0.3)', borderRadius: '15px', padding: '20px 20px 20px 55px', color: '#ffffff', outline: 'none', fontSize: '1rem' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '40px', overflowX: 'auto', paddingBottom: '10px' }}>
          <button 
            onClick={() => setActiveCategory(null)}
            style={{ 
              padding: '10px 25px', 
              borderRadius: '30px', 
              fontSize: '0.8rem', 
              fontWeight: 'bold', 
              cursor: 'pointer', 
              transition: 'all 0.3s',
              background: activeCategory === null ? '#bd9617' : 'rgba(255,255,255,0.05)',
              color: activeCategory === null ? '#0b1c2d' : 'rgba(255,255,255,0.6)',
              border: 'none',
              whiteSpace: 'nowrap'
            }}
          >
            TODAS
          </button>
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{ 
                padding: '10px 25px', 
                borderRadius: '30px', 
                fontSize: '0.8rem', 
                fontWeight: 'bold', 
                cursor: 'pointer', 
                transition: 'all 0.3s',
                background: activeCategory === cat ? '#bd9617' : 'rgba(255,255,255,0.05)',
                color: activeCategory === cat ? '#0b1c2d' : 'rgba(255,255,255,0.6)',
                border: 'none',
                whiteSpace: 'nowrap'
              }}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gap: '15px' }}>
          {filteredFaqs.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', padding: '40px', fontStyle: 'italic' }}>Nenhuma pergunta encontrada para sua busca.</p>
          ) : (
            filteredFaqs.map(faq => (
              <details key={faq.id} style={{ background: '#0e2a47', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                <summary style={{ listStyle: 'none', padding: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', fontWeight: 'bold', color: '#ffffff' }}>
                  {faq.question}
                  <i className="fas fa-chevron-down" style={{ color: '#bd9617', fontSize: '0.8rem' }}></i>
                </summary>
                <div style={{ padding: '0 25px 25px', color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', lineHeight: '1.6', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
                  {faq.answer}
                </div>
              </details>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FaqPage;
