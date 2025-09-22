import React from "react";
const valores = [
  {
    titulo: "Acessibilidade",
    desc: "Facilitamos o acesso à cultura e ao lazer para toda a comunidade.",
  },
  {
    titulo: "Conexão",
    desc: "Aproximamos organizadores e participantes para fortalecer a vida social.",
  },
  {
    titulo: "Inovação",
    desc: "Usamos tecnologia para simplificar a busca e a divulgação de eventos.",
  },
  {
    titulo: "Credibilidade",
    desc: "Garantimos informações confiáveis e atualizadas para quem organiza e para quem participa.",
  },
  {
    titulo: "Comunidade",
    desc: "Valorizamos a troca de experiências e o impacto positivo dos eventos na cidade.",
  },
];

export default function SobreValores() {
  return (
    <section className="sobre-valores">
      <h2>Nossos Valores</h2>
      <div className="valores-grid">
        {valores.map((v, i) => (
          <div key={i} className="valor-card">
            <h3>{v.titulo}</h3>
            <p>{v.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
