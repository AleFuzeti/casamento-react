// src/pages/ListaDePresentes.jsx
import React, { useState, useEffect } from 'react';
import '../styles/presentes.css';
import FotoTexto from './FotoTexto';

const ListaDePresentes = () => {
  const [presentes, setPresentes] = useState([]);
  const [overlayVisible, setOverlayVisible] = useState(false);

  const carregarPresentes = () => {
    fetch('/static/presentes.json')
      .then(response => response.json())
      .then(data => setPresentes(data))
      .catch(error => console.error("Erro ao carregar presentes:", error));
  };

  useEffect(() => {
    carregarPresentes();
  }, []);

  const ordenarMaiorPreco = () => {
    const ordenados = [...presentes].sort((a, b) => b.preco - a.preco);
    setPresentes(ordenados);
  };

  const ordenarMenorPreco = () => {
    const ordenados = [...presentes].sort((a, b) => a.preco - b.preco);
    setPresentes(ordenados);
  };

  const abrirOverlay = () => {
    setOverlayVisible(true);
  };

  const fecharOverlay = () => {
    setOverlayVisible(false);
  };

  return (
    <main>
      <section id="foto-casal">
        <img src="/assets/foto-casal.jpg" alt="Foto do Casal" />
        <div className="overlay">
          <h1>Carolina e Alexandre</h1>
          <p>06.06.2026</p>
        </div>
      </section>

      <FotoTexto titulo="A Lista de Presentes">
        <p>Devido aos noivos já possuírem a maioria dos itens necessários para a casa, optamos por uma lista de presentes virtual. Esses presentes são simbólicos e representam uma contribuição para a nossa lua de mel e vida a dois.</p>
        <p>Os itens possuem cunho cômico e valores aproximados, para que você possa escolher o que mais lhe agrada. A contribuição é feita por PIX, onde você pode escolher o presente que deseja nos dar e fazer a contribuição diretamente.</p> 
        <p>Ao selecionar o presente, você será redirecionado ao código PIX e QR Code para efetuar a contribuição.</p>
        <p>Agradecemos muito a sua contribuição e apoio em nosso grande dia!</p>
      </FotoTexto>

      <div id="opcoes-ordenacao">
        <button onClick={carregarPresentes}>Ordenar por Relevância</button>
        <button onClick={ordenarMaiorPreco}>Ordenar por Maior Preço</button>
        <button onClick={ordenarMenorPreco}>Ordenar por Menor Preço</button>
      </div>

      <section id="presentes">
        <div className="presentes">
          {presentes.map((presente, index) => (
            <div className="presente" key={index}>
              <img src={`/assets/presentes/${presente.foto}`} alt={presente.nome} />
              <h3>{presente.nome}</h3>
              <h2 className="preco">R$ {presente.preco.toFixed(2)}</h2>
              <button className="botao-comprar" onClick={abrirOverlay}>Comprar</button>
            </div>
          ))}
        </div>
      </section>

      {overlayVisible && (
        <div id="overlay" onClick={fecharOverlay} style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          <div id="overlay-content" onClick={(e) => e.stopPropagation()}>
            <img src="/assets/pix.jpeg" alt="Pix" style={{ height: 'auto' }} />
            <p style={{ color: 'white', fontSize: '1.5em', margin: '20px 0' }}>PIX(cel): 43988030433</p>
            <button onClick={fecharOverlay}>Fechar</button>
          </div>
        </div>
      )}
    </main>
  );
};

export default ListaDePresentes;
