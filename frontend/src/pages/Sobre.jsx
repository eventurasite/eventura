import React from "react";
import "../components/sobre.css";
import Header from "../components/Header";
import SobreHeader from "../components/SobreHeader";
import SobreMissao from "../components/SobreMissao";
import SobreValores from "../components/SobreValores";
import SobreEquipe from "../components/SobreEquipe";

export default function Sobre() {
  return (
    <main className="sobre-container">
      <Header />
      <SobreHeader />
      <SobreMissao />
      <SobreValores />
      <SobreEquipe />
    </main>
  );
}
