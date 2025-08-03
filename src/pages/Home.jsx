// src/pages/Home.jsx
import React from 'react';
import '../styles/index.css'; // Estilos específicos da Home (separados do home.css)
import FotoTexto from './FotoTexto';

const Home = () => {
  return (
    <main>
      <section id="foto-casal">
        <img src={`${process.env.PUBLIC_URL}/assets/foto-casal.jpg`} alt="Foto do Casal" />
        <div className="overlay">
          <h1>Carolina e Alexandre</h1>
          <p>06.06.2026</p>
        </div>
      </section>

      <FotoTexto>
        <p>Carolina e Alexandre se conheceram em 2022, em uma festa (diz ele) ou em um aplicativo de conversa (diz ela).</p>
        <p>.</p>
        <p>Cada dia que passava eles percebiam que o que mais queriam era ficar juntos.</p>
        <p>.</p>
      </FotoTexto>

      <FotoTexto imagem={`${process.env.PUBLIC_URL}/assets/curiosidades.png`} alt="Curiosidades" titulo="Curiosidades sobre o casal">
        <p>Adoram jogos de tabuleiro.</p>
        <p>Adoram cozinhar juntos e experimentar novas receitas.</p>
        <p>Adoram viajar e conhecer novos lugares.</p>
        <p>Adoram fazer trilhas e estar em contato com a natureza.</p>
        <p>Adoram fazer maratonas de séries e filmes.</p>
        <p>Adoram dançar e cantar juntos.</p>
      </FotoTexto>

      <FotoTexto imagem={`${process.env.PUBLIC_URL}/assets/noiva.jpeg`} alt="Noiva" titulo="Sobre a Noiva" reverse>
        <p>Nascida em 06 de março de 2001, a noiva pisciana é formada em Psicologia pela Universidade Estadual de Londrina, atuando em clínica particular, avaliação psicológica e orientação profissional.</p>
        <p>Extremamente planejada e animada, a noiva adora cozinhar, cultivar plantas, pintar aquarelas e cantar. O que Alexandre mais admira na Carol é seu companheirismo.</p>
      </FotoTexto>

      <FotoTexto imagem={`${process.env.PUBLIC_URL}/assets/noivo.jpeg`} alt="Noivo" titulo="Sobre o Noivo">
        <p>Nascido em 27 de outubro de 2003, o noivo é formado em Computação na UEL.</p>
        <p>O noivo adora tocar música, desenhar e ler. O que Carolina mais admira no Ale é seu jeito de ser.</p>
      </FotoTexto>

    </main>
  );
};

export default Home;
