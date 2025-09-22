import React from "react";
export default function SobreEquipe() {
  return (
    <section className="sobre-equipe">
      <h2>Nossa Equipe</h2>
      <p>
        Somos um time apaixonado por tecnologia e inovação, dedicado a criar
        soluções digitais sob medida.
      </p>
      <div className="equipe-grid">
        <div className="equipe-card">
          <img
            src="public/assets/imagens/lorena.jpeg"
            alt="Lorena"
            className="foto"
          />
          <h3>Lorena</h3>
          <p>Desenvolvedora</p>
        </div>
        <div className="equipe-card">
          <img
            src="public/assets/imagens/yasmin.jpeg"
            alt="Yasmin"
            className="foto"
          />
          <h3>Yasmin</h3>
          <p>Desenvolvedora</p>
        </div>
        <div className="equipe-card">
          <img
            src="public/assets/imagens/patrick.jpeg"
            alt="Patrick"
            className="foto"
          />
          <h3>Patrick</h3>
          <p>Desenvolvedor Backend</p>
        </div>
        <div className="equipe-card">
          <img
            src="public/assets/imagens/victor.jpeg"
            alt="Victor"
            className="foto"
          />
          <h3>Victor</h3>
          <p>Desenvolvedor Frontend</p>
        </div>
        <div className="equipe-card">
          <img
            src="public/assets/imagens/mauro.jpeg"
            alt="Mauro"
            className="foto"
          />
          <h3>Mauro</h3>
          <p>PO</p>
        </div>
      </div>
    </section>
  );
}
