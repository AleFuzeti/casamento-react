// src/pages/Home.jsx
import React from 'react';
import '../styles/index.css'; // Estilos específicos da Home (separados do home.css)

const Home = () => {
  return (
    <main>
      <section id="foto-casal">
        <img src="/assets/foto-casal.jpg" alt="Foto do Casal" />
        <div className="overlay">
          <h1>Carolina e Alexandre</h1>
          <p>06.06.2026</p>
        </div>
      </section>

      <section id="ocasal">
        <div className="container-texto">
          <h2>Nossa História</h2>
          <p>Carolina e Alexandre se conheceram em 2022, em uma festa (diz ele) ou em um aplicativo de conversa (diz ela).</p>
          <p>.</p>
          <p>Cada dia que passava eles percebiam que o que mais queriam era ficar juntos.</p>
          <p>.</p>
        </div>
      </section>

      <section id="curiosidades">
        <div className="container-foto">
          <img src="/assets/curiosidades.png" alt="Curiosidades" />
        </div>
        <div className="container-texto">
          <h2>Curiosidades sobre o casal</h2>
          <p>Adoram jogos de tabuleiro.</p>
          <p>Adoram cozinhar juntos e experimentar novas receitas.</p>
        </div>
      </section>

      <section id="noiva">
        <div className="container-foto">
          <img src="/assets/noiva.jpeg" alt="Noiva" />
        </div>
        <div className="container-texto">
          <h2>SOBRE A NOIVA</h2>
          <p>Nascida em 06 de março de 2001, a noiva pisciana é formada em Psicologia pela Universidade Estadual de Londrina, atuando em clínica particular, avaliação psicológica e orientação profissional.</p>
          <p>Extremamente planejada e animada, a noiva adora cozinhar, cultivar plantas, pintar aquarelas e cantar. O que Alexandre mais admira na Carol é seu companheirismo.</p>
        </div>
      </section>

      <section id="noivo">
        <div className="container-foto">
          <img src="/assets/noivo.jpeg" alt="Noivo" />
        </div>
        <div className="container-texto">
          <h2>Sobre o Noivo</h2>
          <p>Nascido em 27 de outubro de 2003, o noivo é formado em Computação na UEL.</p>
          <p>O noivo adora tocar música, desenhar e ler. O que Carolina mais admira no Ale é ...</p>
        </div>
      </section>
    </main>
  );
};

export default Home;
