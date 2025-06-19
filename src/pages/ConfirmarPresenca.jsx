// src/pages/ConfirmarPresenca.jsx
import React, { useState } from 'react';
import '../styles/confirmar-presenca.css';
import convidadosData from '../data/convidados.json';

const ConfirmarPresenca = () => {
  const [codigo, setCodigo] = useState('');
  const [listaConvidados, setListaConvidados] = useState([]);
  const [formVisible, setFormVisible] = useState(false);

  // Simula o "outro JSON" dos confirmados usando localStorage
  const salvarConfirmados = (novosConfirmados) => {
    const confirmadosAtuais = JSON.parse(localStorage.getItem('confirmados') || '[]');
    localStorage.setItem('confirmados', JSON.stringify([...confirmadosAtuais, ...novosConfirmados]));
  };

  const buscarConvidados = () => {
    const codigoTrim = codigo.trim();
    if (!codigoTrim) {
      alert("Por favor, insira um código válido.");
      return;
    }

    const convidado = convidadosData.find(
      c => c.codigo.toLowerCase() === codigoTrim.toLowerCase()
    );
    if (!convidado || convidado.nomes.length === 0) {
      alert("Código não encontrado.");
      return;
    }
    setListaConvidados(convidado.nomes);
    setFormVisible(true);
  };

  const confirmarPresenca = (e) => {
    e.preventDefault();
    const checkboxes = Array.from(document.querySelectorAll("input[name='convidado']:checked"));
    const nomesSelecionados = checkboxes.map(cb => cb.value);

    if (nomesSelecionados.length === 0) {
      alert("Selecione pelo menos um convidado.");
      return;
    }

    // Atualiza o status de confirmado no array local
    const novosConfirmados = [];
    const novaLista = listaConvidados.map(c => {
      if (nomesSelecionados.includes(c.nome) && !c.confirmado) {
        novosConfirmados.push({ ...c, confirmado: true });
        return { ...c, confirmado: true };
      }
      return c;
    });

    // Salva os confirmados no "outro JSON" (localStorage)
    salvarConfirmados(novosConfirmados);

    alert(`Presença confirmada para: ${novosConfirmados.map(c => c.nome).join(', ')}`);
    setFormVisible(false);
    setListaConvidados([]);
    setCodigo('');
  };

  return (
    <main>
      <header>
        <h1>Confirmação de Presença</h1>
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
              {listaConvidados.map((c, index) => (
                <div key={index}>
                  <label style={{ color: c.confirmado ? 'gray' : '#2f4e25' }}>
                    <input
                      type="checkbox"
                      name="convidado"
                      value={c.nome}
                      disabled={c.confirmado}
                    />
                    {` ${c.nome}`}
                    {c.confirmado && " (Já confirmado)"}
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
