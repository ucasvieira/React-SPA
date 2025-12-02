import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const scrollToHash = (hash) => {
  if (!hash) return;
  const id = hash.replace('#', '');
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const Legal = () => {
  const location = useLocation();

  useEffect(() => {
    // Rola para o hash presente (se houver) após o mount
    if (typeof window !== 'undefined') {
      scrollToHash(location.hash);
      const onHashChange = () => scrollToHash(window.location.hash);
      window.addEventListener('hashchange', onHashChange);
      return () => window.removeEventListener('hashchange', onHashChange);
    }
  }, [location.hash]);

  return (
    <div className="min-h-screen bg-secondary py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-black text-primary mb-6">Acordos e Documentos</h1>

        <section id="privacy" className="mb-12 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-primary mb-3">Política de Privacidade</h2>
          <p className="text-gray-600 leading-relaxed">Este projeto acadêmico coleta apenas os dados estritamente necessários para demonstrar as funcionalidades da aplicação (por exemplo, títulos de filmes, categorias e informações de locação simuladas). Os dados são armazenados localmente no navegador do usuário via <code>localStorage</code> e não são enviados a servidores externos. Utilizamos essas informações apenas para fins de demonstração e testes na disciplina. Caso você decida remover seus dados, utilize as opções de exclusão disponíveis na interface; os dados removidos são eliminados do armazenamento local.</p>
        </section>

        <section id="terms" className="mb-12 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-primary mb-3">Termos de Uso</h2>
          <p className="text-gray-600 leading-relaxed">A aplicação foi desenvolvida como parte de um trabalho acadêmico e destina-se exclusivamente a fins educativos e de demonstração. O uso da aplicação é por conta e risco do usuário; os autores não se responsabilizam por qualquer dano indireto decorrente do uso do software. É proibida a utilização deste código para fins ilegais ou para violar direitos de terceiros. Sinta-se à vontade para estudar, modificar e adaptar o código para fins acadêmicos, respeitando sempre as regras de citação e atribuição do trabalho original.</p>
        </section>

        <section id="contract" className="mb-12 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-primary mb-3">Contrato</h2>
          <p className="text-gray-600 leading-relaxed">Este documento apresenta um modelo simples de contrato para fins didáticos. Ele descreve um acordo hipotético entre o fornecedor da aplicação (desenvolvedores do projeto) e o usuário final para uso e testes em ambiente acadêmico. Não há cobrança ou obrigação financeira associada a este projeto. Qualquer uso comercial ou produção do software deve ser precedido de revisão legal e acordo formal entre as partes envolvidas.</p>
        </section>

      </div>
    </div>
  );
};

export default Legal;
