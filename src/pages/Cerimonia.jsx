// src/pages/Cerimonia.jsx
import React, { useState, useEffect } from 'react';
import '../styles/cerimonia.css';
import FotoTexto from './FotoTexto';

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

      <FotoTexto titulo="A Cerimônia">
        <p>Estamos muito felizes em compartilhar esse momento especial com você!</p>
        <p>O nosso casamento será realizado no dia 06 de junho de 2026, às 16h30, na Chácara da Dinda em Londrina-PR.</p>
        <p>Esperamos que você possa nos acompanhar nesse dia tão especial!</p>
        <p>Com amor, Carolina e Alexandre.</p>
      </FotoTexto>

      <FotoTexto titulo="Cronograma">
        <table className="cronograma-table">
          <tbody>
            <tr>
              <td>15h Recepção dos convidados</td>
            </tr>
            <tr>
              <td>16h Início da cerimônia</td>
            </tr>
            <tr>
              <td>17h Fotos com os noivos</td>
            </tr>
            <tr>
              <td>18h Início do jantar</td>
            </tr>
            <tr>
              <td>21h Corte do Bolo</td>
            </tr>
            <tr>
              <td>22h Final de cerimônia</td>
            </tr>
          </tbody>
        </table>
      </FotoTexto>

      <FotoTexto titulo="Traje">
        <p>O traje para a cerimônia é esporte fino. Pedimos que os convidados evitem roupas muito informais, como shorts e chinelos.</p>
        <p>Para os homens, sugerimos calça social e camisa de manga longa. Para as mulheres, vestido ou saia e blusa.</p>
        <p>Esperamos que todos estejam confortáveis e elegantes para celebrar conosco!</p>
      </FotoTexto>

      <FotoTexto titulo="Cardápio">
        <p>O cardápio escolhido para a cerimônia é um rodízio de pizza, com diversos sabores, doces e salgados, incluindo opções vegetarianas.</p>
        <p>Para beber, teremos água, refrigerante, suco e cerveja.</p>
        <p>Esperamos que todos aproveitem!</p>
      </FotoTexto>

      <FotoTexto titulo="Local">
        <p>A cerimônia será realizada na Chácara da Dinda, localizada em Londrina-PR.</p>
        <p>O local possui uma linda área verde, ideal para a cerimônia ao ar livre.</p>
        <p>Contamos com estacionamento próprio e segurança para garantir a tranquilidade de todos os convidados.</p>
        <p>Esperamos que todos aproveitem o espaço e a natureza ao nosso redor!</p>
        <div className="mapa">
          <iframe
            title="Mapa do local"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3660.0000000000005!2d-51.16999968502141!3d-23.3100009847466!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94d8c9b4b4b4b4b4%3A0x4b8b4b4b4b4b4b4!2sRua%20dos%20Eventos%2C%20123%20-%20Centro%2C%20Londrina%20-%20PR%2C%2086010-000!5e0!3m2!1spt-BR!2sbr!4v1633660000000!5m2!1spt-BR!2sbr"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </FotoTexto>

      <FotoTexto titulo="Tempo">
        <p>Estamos contando os dias para o nosso grande dia!</p>
        <p>Faltam apenas:</p>
        <p id="countdown" className="digital-clock">
          {countdown.split("").map((char, index) => (
            <span key={index} className={`digit ${char === ":" ? "colon" : ""}`}>
              {char}
            </span>
          ))}
        </p>
        <p>para o nosso "Sim".</p>
        <p>Esperamos que você esteja tão animado quanto nós!</p>
      </FotoTexto>

    </main>
  );
};

export default Cerimonia;
