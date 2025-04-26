// src/pages/Cerimonia.jsx
import React, { useState, useEffect } from 'react';
import '../styles/cerimonia.css';

const Cerimonia = () => {
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    const countDownDate = new Date('Jun 6, 2026 16:30:00').getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = countDownDate - now;

      if (distance < 0) {
        clearInterval(interval);
        setCountdown('O grande dia chegou!');
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setCountdown(`${String(days).padStart(2, '0')}:${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main>
      <section id="foto-casal">
        <img src="/assets/foto-casal.jpg" alt="Foto do Casal" />
        <div className="overlay">
          <h1>Carolina e Alexandre</h1>
          <p>06.06.2026</p>
        </div>
      </section>

      <section id="cerimonia">
        <div className="container-texto">
          <h2>A Cerimônia</h2>
          <p>LOCAL, DATA, DRESSCODE, CARDÁPIO, CRONOGRAMA</p>
        </div>
      </section>

      <section id="cronograma">
        <div className="container-foto">
          <img src="/assets/curiosidades.png" alt="Cronograma" />
        </div>
        <div className="container-texto">
          <h2>CRONOGRAMA</h2>
          <p>16:00 Recepção dos convidados</p>
          <p>16:30 Início da cerimônia</p>
          <p>18:00 Fotos com os noivos</p>
          <p>18:30 Início do jantar</p>
          <p>21:00 Corte do Bolo</p>
          <p>22:00 Final de cerimônia</p>
        </div>
      </section>

      <section id="cardapio" style={{ flexDirection: 'row-reverse' }}>
        <div className="container-foto">
          <img src="/assets/noiva.jpeg" alt="Noiva" />
        </div>
        <div className="container-texto">
          <h2>Cardápio</h2>
          <p>
            O cardápio escolhido para a cerimônia é um rodízio de pizza, com diversos sabores, doces e salgados, incluindo opções vegetarianas.
          </p>
          <p>Para beber, teremos água, refrigerante, suco e cerveja.</p>
        </div>
      </section>

      <section id="local">
        <div className="container-texto">
          <h2>Local</h2>
          <p>
            Av. Casa do Caralho, n 690, Jardim Londrilar, Londrina-PR
          </p>
          <p>
            O local possui estacionamento próprio e segurança para garantir a tranquilidade de todos os convidados.
          </p>
        </div>
        <div className="mapa">
          <iframe
            title="Mapa do local"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3660.0000000000005!2d-51.16999968502141!3d-23.3100009847466!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94d8c9b4b4b4b4b4%3A0x4b8b4b4b4b4b4b4!2sRua%20dos%20Eventos%2C%20123%20-%20Centro%2C%20Londrina%20-%20PR%2C%2086010-000!5e0!3m2!1spt-BR!2sbr!4v1633660000000!5m2!1spt-BR!2sbr"
            width="600"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </section>

      <section id="tempo">
        <div className="container-texto">
          <h2>Distância do nosso "Sim"</h2>
          <p id="countdown" className="digital-clock">
            {countdown.split("").map((char, index) => (
              <span key={index} className={`digit ${char === ":" ? "colon" : ""}`}>
                {char}
              </span>
            ))}
          </p>
        </div>
      </section>
    </main>
  );
};

export default Cerimonia;
