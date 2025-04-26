// src/pages/ConfirmarPresenca.jsx
import React, { useState } from 'react';

const scriptURL = "https://script.google.com/macros/s/AKfycbwpRMAXUIrdaAgqnjgNIfrr2--t4WUi2OjUPD2MupKixGI3ZlRU68m-PFXAX-UHvIAI/exec";

const ConfirmarPresenca = () => {
  const [codigo, setCodigo] = useState('');
  const [listaConvidados, setListaConvidados] = useState([]);
  const [formVisible, setFormVisible] = useState(false);

  const buscarConvidados = () => {
    const codigoTrim = codigo.trim();
    if (!codigoTrim) {
      alert("Por favor, insira um código válido.");
      return;
    }

    fetch(`${scriptURL}?codigo=${codigoTrim}`)
      .then(response => response.json())
      .then(nomes => {
        if (nomes.length === 0) {
          alert("Código não encontrado.");
          return;
        }
        setListaConvidados(nomes);
        setFormVisible(true);
      })
      .catch(error => console.error("Erro:", error));
  };

  const confirmarPresenca = (e) => {
    e.preventDefault();
    const checkboxes = Array.from(document.querySelectorAll("input[name='convidado']:checked"));
    const nomesSelecionados = checkboxes.map(cb => cb.value);

    if (nomesSelecionados.length === 0) {
      alert("Selecione pelo menos um convidado.");
      return;
    }

    fetch(scriptURL, {
      method: "POST",
      body: JSON.stringify({ codigo, nomes: nomesSelecionados }),
      headers: { "Content-Type": "application/json" }
    })
      .then(response => response.text())
      .then(result => {
        alert(result);
        setFormVisible(false);
        setListaConvidados([]);
        setCodigo('');
      })
      .catch(error => console.error("Erro:", error));
  };

  return (
    <main>
      <header>
        <h1>Confirmação de Presença</h1>
        {/* Use Link do react-router-dom para navegar */}
      </header>

      <section>
        <h2>Digite seu código de convite:</h2>
        <input
          type="text"
          id="codigo"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
        />
        <button onClick={buscarConvidados}>Buscar</button>

        {formVisible && (
          <form id="confirmacao-form" onSubmit={confirmarPresenca}>
            <h3>Selecione os convidados confirmados:</h3>
            <div id="lista-convidados">
              {listaConvidados.map((nome, index) => (
                <div key={index}>
                  <label>
                    <input type="checkbox" name="convidado" value={nome} />
                    {` ${nome}`}
                  </label>
                </div>
              ))}
            </div>
            <button type="submit">Confirmar Presença</button>
          </form>
        )}
      </section>
    </main>
  );
};

export default ConfirmarPresenca;
